/* Flashcard từ vựng với lặp lại ngắt quãng kiểu Leitner — tối giản cho ADHD:
   - Mỗi phiên ngắn: thẻ đến hạn + tối đa 10 từ mới. Không phải chọn gì cả.
   - Chỉ 2 nút: "Chưa nhớ" (về hộp 1, hỏi lại cuối phiên) / "Nhớ rồi" (lên hộp,
     hẹn gặp lại xa dần: 1 → 3 → 7 → 16 → 35 ngày).
   - Thẻ tuỳ chỉnh: lưu từ popup tra từ 🔎 (b2-flashcards-custom-v1).
   Lịch ôn từng thẻ lưu ở b2-srs-v1: { id: { box, due } }. */

(function () {
  "use strict";

  var DECKS = window.FLASHDECKS;
  var root = document.getElementById("flashcards-root");
  if (!DECKS || !DECKS.length) {
    root.innerHTML = "<p>Không tải được dữ liệu thẻ. Hãy kiểm tra file <code>flashcards-data.js</code>.</p>";
    return;
  }

  var SRS_KEY = "b2-srs-v1";
  var CUSTOM_KEY = "b2-flashcards-custom-v1";
  var STAGE_SEL_KEY = "b2-flash-stage";
  var NEW_PER_SESSION = 10;
  var INTERVAL_DAYS = { 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 }; /* hộp → số ngày chờ */
  var MAX_BOX = 5;
  var STAGE_TITLES = ["Giai đoạn 1 · A1", "Giai đoạn 2 · A2", "Giai đoạn 3 · B1", "Giai đoạn 4 · B2"];

  /* ---------- store ---------- */
  function loadObj(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function loadArr(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function save(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ }
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function todayStart() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- TTS ---------- */
  var voice = null;
  function pickVoice() {
    var vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    voice =
      vs.find(function (v) { return v.lang === "en-US" && /google/i.test(v.name); }) ||
      vs.find(function (v) { return v.lang === "en-US"; }) ||
      vs.find(function (v) { return v.lang && v.lang.indexOf("en") === 0; }) || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.addEventListener("voiceschanged", pickVoice); }
  function tts(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }

  /* ---------- bộ thẻ ---------- */
  function stageCards(si) {
    return DECKS[si].cards.map(function (c, i) {
      return { id: "s" + (si + 1) + ":" + c.en.toLowerCase(), card: c, stage: si };
    });
  }
  function customCards() {
    return loadArr(CUSTOM_KEY).map(function (c) {
      return {
        id: "cu:" + String(c.en).toLowerCase(),
        card: { en: c.en, ipa: c.ipa || "", vi: c.vi, example_en: c.example_en || "", example_vi: "" },
        custom: true,
      };
    });
  }
  function allCards() {
    var out = [];
    DECKS.forEach(function (_, si) { out = out.concat(stageCards(si)); });
    return out.concat(customCards());
  }

  function dueList(srs) {
    var t = todayStart();
    return allCards().filter(function (c) {
      var st = srs[c.id];
      return st && st.due <= t;
    });
  }
  function newList(srs, si) {
    /* thẻ tuỳ chỉnh mới luôn được ưu tiên (người học vừa chủ động lưu chúng) */
    var fresh = customCards().filter(function (c) { return !srs[c.id]; });
    return fresh.concat(stageCards(si).filter(function (c) { return !srs[c.id]; }));
  }
  function counts(srs) {
    var learning = 0, mastered = 0;
    Object.keys(srs).forEach(function (k) {
      if (srs[k].box >= 4) mastered++;
      else learning++;
    });
    return { learning: learning, mastered: mastered };
  }

  /* ---------- bảng điều khiển ---------- */
  function selectedStage() {
    var v = parseInt(localStorage.getItem(STAGE_SEL_KEY) || "1", 10);
    if (!(v >= 1 && v <= DECKS.length)) v = 1;
    /* kẹp theo chặng đang mở — lựa chọn cũ có thể trỏ chặng đã bị khoá lại
       (thi lại placement bị hạ điểm xuất phát), nếu không kẹp thì nguồn từ mới
       vẫn rút từ chặng khoá, vô hiệu hoá chống nhảy cóc */
    var unlocked = window.Progression ? Progression.unlockedStage() : DECKS.length;
    if (v > unlocked) {
      v = unlocked;
      try { localStorage.setItem(STAGE_SEL_KEY, String(v)); } catch (e) { /* private mode */ }
    }
    return v;
  }

  /* dọn srs entry mồ côi (thẻ custom đã xoá / từ bị gỡ khỏi deck) — nếu không,
     đếm "đến hạn"/"đang học" sẽ báo mãi những thẻ không bao giờ ôn được */
  function reconcileSrs() {
    var srs = loadObj(SRS_KEY);
    var valid = {};
    allCards().forEach(function (c) { valid[c.id] = true; });
    var dirty = false;
    Object.keys(srs).forEach(function (k) {
      if (!valid[k]) { delete srs[k]; dirty = true; }
    });
    if (dirty) save(SRS_KEY, srs);
  }

  var currentView = "dashboard"; /* chỉ auto-refresh khi đang ở bảng điều khiển */

  function renderDashboard() {
    currentView = "dashboard";
    if (window.speechSynthesis) speechSynthesis.cancel();
    reconcileSrs();
    var srs = loadObj(SRS_KEY);
    var si = selectedStage();
    var due = dueList(srs);
    var fresh = newList(srs, si - 1);
    var c = counts(srs);
    var sessionSize = due.length + Math.min(fresh.length, NEW_PER_SESSION);

    root.innerHTML = "";
    var dash = el("div", "panel-card");
    dash.innerHTML =
      '<div class="flash-stats">' +
      '<div><b>' + due.length + "</b><span>đến hạn hôm nay</span></div>" +
      '<div><b>' + fresh.length + "</b><span>từ mới sẵn sàng</span></div>" +
      '<div><b>' + c.learning + "</b><span>đang học</span></div>" +
      '<div><b>' + c.mastered + "</b><span>đã thuộc</span></div>" +
      "</div>" +
      '<div class="result-actions" style="margin-top:1.2rem;">' +
      (sessionSize > 0
        ? '<button class="btn btn-primary" id="btn-review" type="button">▶ Ôn ngay (' + sessionSize + " thẻ)</button>"
        : '<p class="exercise-hint" style="margin:0;">Hết thẻ cho hôm nay 🎉 — quay lại vào ngày mai để giữ nhịp.</p>') +
      "</div>" +
      '<p class="panel-label" style="margin-top:1.6rem;">Lấy từ mới từ chặng</p>' +
      '<div class="stage-switch" id="flash-stage-switch"></div>';
    root.appendChild(dash);

    var sw = dash.querySelector("#flash-stage-switch");
    var unlocked = window.Progression ? Progression.unlockedStage() : DECKS.length;
    DECKS.forEach(function (_, i) {
      var locked = i + 1 > unlocked;
      /* dùng lại srs đã load — parse cả store cho từng thẻ là ~462 lần parse */
      var remaining = stageCards(i).filter(function (x) { return !srs[x.id]; }).length;
      var b = el("button", null,
        (locked ? "🔒 " : "") + esc(STAGE_TITLES[i]) +
        (locked ? "" : ' <span class="tab-count">' + remaining + " từ mới</span>"));
      b.type = "button";
      b.style.setProperty("--sw-c", "var(--s" + (i + 1) + ")");
      b.style.setProperty("--sw-ink", "var(--s" + (i + 1) + "-ink)");
      b.setAttribute("aria-pressed", i + 1 === si ? "true" : "false");
      b.disabled = locked;
      if (locked && window.Progression) b.title = Progression.lockHint(i + 1);
      b.addEventListener("click", function () {
        localStorage.setItem(STAGE_SEL_KEY, String(i + 1));
        renderDashboard();
      });
      sw.appendChild(b);
    });

    var btn = dash.querySelector("#btn-review");
    if (btn) btn.addEventListener("click", function () {
      /* tính lại tại thời điểm bấm — dashboard có thể mở qua đêm hoặc tab khác vừa ôn */
      var s2 = loadObj(SRS_KEY);
      startSession(dueList(s2), newList(s2, selectedStage() - 1));
    });

    renderCustomList();
  }

  function renderCustomList() {
    var list = loadArr(CUSTOM_KEY);
    var box = el("div", "panel-card", "");
    box.style.marginTop = "1.2rem";
    box.innerHTML =
      '<p class="panel-label">Thẻ của tôi · ' + list.length + " từ</p>" +
      (list.length
        ? ""
        : '<p class="exercise-hint">Chưa có thẻ nào. Bôi đen một từ tiếng Anh bất kỳ trên trang, bấm 🔎 Dịch rồi bấm <b>➕ Thẻ</b> — từ đó sẽ vào đây và được xếp lịch ôn.</p>');
    if (list.length) {
      var ul = el("ul", "custom-card-list");
      list.forEach(function (c, i) {
        var srsState = loadObj(SRS_KEY)["cu:" + String(c.en).toLowerCase()];
        var li = el("li", null,
          '<span><b lang="en">' + esc(c.en) + "</b>" +
          (c.ipa ? ' <span class="lookup-ipa" style="display:inline;">' + esc(c.ipa) + "</span>" : "") +
          " — " + esc(c.vi) + "</span>" +
          '<span class="custom-card-meta">' + (srsState ? "hộp " + srsState.box : "chưa học") + "</span>" +
          '<button class="lookup-close custom-card-del" type="button" aria-label="Xoá thẻ ' + esc(c.en) + '" data-del="' + esc(String(c.en).toLowerCase()) + '">×</button>');
        ul.appendChild(li);
      });
      box.appendChild(ul);
      ul.addEventListener("click", function (e) {
        /* xoá theo en (không theo index) — tab khác có thể vừa thêm/xoá làm lệch danh sách */
        var en = e.target.getAttribute && e.target.getAttribute("data-del");
        if (en == null) return;
        if (!confirm("Xoá thẻ “" + en + "” khỏi bộ của bạn?")) return;
        var cur = loadArr(CUSTOM_KEY);
        var idx = cur.findIndex(function (c) { return String(c.en).toLowerCase() === en; });
        if (idx >= 0) {
          cur.splice(idx, 1);
          save(CUSTOM_KEY, cur);
          var srs = loadObj(SRS_KEY);
          delete srs["cu:" + en];
          save(SRS_KEY, srs);
        }
        renderDashboard();
      });
    }
    root.appendChild(box);
  }

  /* ---------- phiên ôn ---------- */
  function grade(id, remembered) {
    var srs = loadObj(SRS_KEY); /* đọc lại trước khi ghi: an toàn đa tab */
    var st = srs[id] || { box: 0, due: 0 };
    var box = remembered ? Math.min(st.box + 1, MAX_BOX) : 1;
    srs[id] = { box: box, due: todayStart() + INTERVAL_DAYS[box] * 86400000 };
    save(SRS_KEY, srs);
  }

  function startSession(due, fresh) {
    currentView = "session";
    var queue = due.slice();
    /* xáo thẻ đến hạn cho đỡ đoán theo thứ tự */
    for (var i = queue.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = queue[i]; queue[i] = queue[j]; queue[j] = tmp;
    }
    queue = queue.concat(fresh.slice(0, NEW_PER_SESSION));
    var total = queue.length;
    var stats = { done: 0, again: 0 };

    root.innerHTML = "";
    var wrap = el("div", null);
    var head = el("div", "quiz-stepper-head",
      '<p class="quiz-counter"></p><div class="quiz-stepper-bar"><div class="quiz-stepper-fill"></div></div>');
    var cardBox = el("div", null);
    var live = el("div", "sr-only");
    live.setAttribute("aria-live", "polite");
    wrap.appendChild(head);
    wrap.appendChild(cardBox);
    wrap.appendChild(live);
    root.appendChild(wrap);

    var counter = head.querySelector(".quiz-counter");
    var fill = head.querySelector(".quiz-stepper-fill");

    function updateHead() {
      counter.textContent = "Còn " + queue.length + " thẻ · đã xong " + stats.done + "/" + total;
      fill.style.width = (total ? (stats.done / total) * 100 : 0) + "%";
    }

    function finish() {
      if (window.speechSynthesis) speechSynthesis.cancel();
      var srs = loadObj(SRS_KEY);
      var freshLeft = newList(srs, selectedStage() - 1).length;
      root.innerHTML = "";
      var end = el("div", "panel-card");
      end.setAttribute("tabindex", "-1");
      end.innerHTML =
        '<p class="eyebrow">Xong phiên hôm nay</p>' +
        "<h2>" + stats.done + " thẻ đã ôn" + (stats.again ? " · " + stats.again + " lần cần hỏi lại" : " — sạch sẽ!") + "</h2>" +
        '<p class="section-lede" style="margin-bottom:1.2rem;">Não ghi nhớ khi được NGHỈ giữa các lần gặp lại — về mặt khoa học, đóng tab bây giờ chính là học.</p>' +
        '<div class="result-actions">' +
        (freshLeft > 0 ? '<button class="btn btn-primary" id="btn-more" type="button">＋ Học thêm ' + Math.min(freshLeft, NEW_PER_SESSION) + " từ mới</button>" : "") +
        '<button class="btn btn-ghost" id="btn-back" type="button">Về bảng điều khiển</button>' +
        "</div>";
      root.appendChild(end);
      end.focus({ preventScroll: true });
      document.getElementById("btn-back").addEventListener("click", renderDashboard);
      var more = document.getElementById("btn-more");
      if (more) more.addEventListener("click", function () {
        var s2 = loadObj(SRS_KEY);
        startSession([], newList(s2, selectedStage() - 1));
      });
      if (window.FocusTools) {
        FocusTools.recordActivity();
        FocusTools.celebrate(end);
      }
    }

    function showNext() {
      if (window.speechSynthesis) speechSynthesis.cancel();
      if (!queue.length) { finish(); return; }
      updateHead();
      var item = queue.shift();
      var c = item.card;
      cardBox.innerHTML = "";

      var flipBtn = el("button", "flash-card");
      flipBtn.type = "button";
      flipBtn.setAttribute("aria-expanded", "false");
      flipBtn.setAttribute("aria-label", "Lật thẻ để xem nghĩa: " + c.en);
      flipBtn.innerHTML =
        '<span class="flash-inner">' +
        '<span class="flash-face flash-front">' +
        '<b lang="en">' + esc(c.en) + "</b>" +
        (c.ipa ? '<span class="lookup-ipa">' + esc(c.ipa) + "</span>" : "") +
        '<span class="flash-hintline">Bấm để lật thẻ</span>' +
        "</span>" +
        /* aria-hidden: backface-visibility chỉ ẩn thị giác — phải ẩn cả với screen reader
           kẻo đáp án bị đọc ra trước khi lật */
        '<span class="flash-face flash-back" aria-hidden="true">' +
        '<b>' + esc(c.vi) + "</b>" +
        (c.example_en ? '<span class="flash-example" lang="en">' + esc(c.example_en) + "</span>" : "") +
        (c.example_vi ? '<span class="flash-example-vi">' + esc(c.example_vi) + "</span>" : "") +
        "</span></span>";
      var controls = el("div", "flash-controls",
        '<button class="chip-btn" type="button" data-act="say">🔊 Phát âm</button>');
      var gradeRow = el("div", "flash-grade",
        '<button class="btn btn-ghost" type="button" data-grade="0" aria-keyshortcuts="1">😅 Chưa nhớ</button>' +
        '<button class="btn btn-primary" type="button" data-grade="1" aria-keyshortcuts="2">✅ Nhớ rồi</button>' +
        '<span class="flash-keys">Phím tắt: 1 = chưa nhớ · 2 = nhớ</span>');
      gradeRow.hidden = true;

      cardBox.appendChild(flipBtn);
      cardBox.appendChild(controls);
      cardBox.appendChild(gradeRow);
      flipBtn.focus({ preventScroll: true });

      var flipped = false;
      function flip() {
        if (flipped) return;
        flipped = true;
        flipBtn.classList.add("is-flipped");
        flipBtn.setAttribute("aria-expanded", "true");
        var back = flipBtn.querySelector(".flash-back");
        var front = flipBtn.querySelector(".flash-front");
        back.removeAttribute("aria-hidden");
        front.setAttribute("aria-hidden", "true");
        gradeRow.hidden = false;
        live.textContent = c.vi +
          (c.example_en ? ". Ví dụ: " + c.example_en : "") +
          (c.example_vi ? " — " + c.example_vi : "");
      }
      flipBtn.addEventListener("click", flip);

      controls.addEventListener("click", function (e) {
        if (e.target.dataset && e.target.dataset.act === "say") {
          tts(c.en);
          flipBtn.focus({ preventScroll: true }); /* trả focus về thẻ để Space lật được */
        }
      });

      gradeRow.addEventListener("click", function (e) {
        var g = e.target.dataset && e.target.dataset.grade;
        if (g == null) return;
        var remembered = g === "1";
        /* thẻ đã quên trong phiên này: lần "nhớ lại" cuối phiên KHÔNG chấm nữa —
           giữ nguyên hộp 1 / hẹn mai đã ghi lúc quên, tránh nhảy cóc lên hộp 2 */
        if (!(remembered && item.lapsed)) grade(item.id, remembered);
        if (remembered) {
          stats.done++;
          live.textContent = "Đã xong " + stats.done + "/" + total + " thẻ.";
        } else {
          stats.again++;
          item.lapsed = true;
          queue.push(item); /* hỏi lại cuối phiên đến khi nhớ */
        }
        showNext();
      });
    }

    /* phím tắt: Space/Enter lật (native click trên nút thẻ đang focus), 1 = chưa nhớ, 2 = nhớ */
    wrap.addEventListener("keydown", function (e) {
      var card = cardBox.querySelector(".flash-card");
      if (!card) return;
      if (e.key === "1" && !gradeHidden()) { e.preventDefault(); clickGrade("0"); }
      if (e.key === "2" && !gradeHidden()) { e.preventDefault(); clickGrade("1"); }
      function gradeHidden() { return cardBox.querySelector(".flash-grade").hidden; }
      function clickGrade(g) {
        var b = cardBox.querySelector('[data-grade="' + g + '"]');
        if (b) b.click();
      }
    });

    showNext();
  }

  renderDashboard();

  /* dashboard có thể cũ đi khi qua ngày mới hoặc tab khác ôn/lưu thẻ —
     làm tươi khi quay lại tab (không đụng vào phiên đang ôn dở) */
  window.addEventListener("storage", function () {
    if (currentView === "dashboard") renderDashboard();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && currentView === "dashboard") renderDashboard();
  });
})();
