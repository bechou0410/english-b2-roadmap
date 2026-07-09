/* Trang Phát âm & phương pháp:
   - Bảng 44 âm IPA (nguyên âm đơn/đôi, phụ âm) với mẹo đặt lưỡi + lỗi người Việt,
     mỗi từ ví dụ bấm là TTS đọc.
   - Game cặp âm tối thiểu: máy đọc 1 từ, chọn nghe thấy từ nào — luyện tai.
     Kỷ lục lưu b2-ipa-v1.
   - 6 bài phương pháp học hiệu quả. */

(function () {
  "use strict";

  var DATA = window.IPA_METHOD;
  var root = document.getElementById("ipa-root");
  if (!DATA || !DATA.vowels) {
    root.innerHTML = "<p>Không tải được dữ liệu. Hãy kiểm tra <code>ipa-method-data.js</code>.</p>";
    return;
  }

  var STORE_KEY = "b2-ipa-v1";
  var PAIR_ROUND = 10;
  var TABS = [
    { key: "am", label: "🔤 Bảng 44 âm" },
    { key: "cap-am", label: "👂 Luyện tai: cặp âm" },
    { key: "phuong-phap", label: "📚 Phương pháp học" },
  ];

  function loadStore() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function put(key, entry) {
    var s = loadStore();
    s[key] = entry;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
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
  function tts(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = rate || 0.9;
    speechSynthesis.speak(u);
  }

  /* ---------- bảng âm ---------- */
  function soundCard(s) {
    return (
      '<div class="sound-card">' +
      '<div class="sound-head">' +
      '<span class="sound-symbol" aria-label="Ký hiệu IPA">' + esc(s.symbol) + "</span>" +
      '<span class="sound-label">' + esc(s.label_vi) + "</span>" +
      "</div>" +
      '<div class="sound-examples">' +
      s.examples.map(function (ex) {
        return '<button class="chip-btn" type="button" data-say="' + esc(ex.word) + '" lang="en">🔊 ' + esc(ex.word) + " <span>" + esc(ex.ipa) + "</span></button>";
      }).join("") +
      "</div>" +
      '<p class="sound-tip">' + esc(s.tip_vi) + "</p>" +
      "<details><summary>⚠️ Lỗi người Việt hay mắc</summary><p>" + esc(s.vn_mistake_vi) + "</p></details>" +
      "</div>"
    );
  }

  function renderSounds(box) {
    var groups = [
      { title: "Nguyên âm đơn — 12 âm", note: "Cặp dài/ngắn là chìa khoá: sai độ dài là đổi nghĩa từ.", items: DATA.vowels },
      { title: "Nguyên âm đôi — 8 âm", note: "Âm trượt hai chặng — đọc đủ cả hai chặng, đừng cắt cụt.", items: DATA.diphthongs },
      { title: "Phụ âm — 24 âm", note: "Người Việt cần để ý nhất: /θ/ /ð/, âm cuối, và /ʃ/ /tʃ/ /dʒ/.", items: DATA.consonants },
    ];
    groups.forEach(function (g) {
      var section = el("div", null,
        "<h2>" + esc(g.title) + "</h2>" +
        '<p class="section-lede" style="margin-bottom:1.2rem;">' + esc(g.note) + "</p>" +
        '<div class="sound-grid">' + g.items.map(soundCard).join("") + "</div>");
      box.appendChild(section);
    });
    box.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-say]");
      if (b) tts(b.getAttribute("data-say"), 0.85);
    });
  }

  /* ---------- game cặp âm ---------- */
  var pendingTimer = null;

  function renderPairs(box) {
    var intro = el("div", "panel-card",
      "<h2>Nghe ra khác biệt chưa?</h2>" +
      '<p class="section-lede" style="margin-bottom:1rem;">Máy đọc MỘT từ — bạn chọn nghe thấy từ nào trong cặp. ' + PAIR_ROUND + " câu mỗi lượt. Tai phân biệt được thì miệng mới bắt chước được.</p>" +
      '<div class="skill-switch" id="pair-picker"></div>');
    box.appendChild(intro);
    var arena = el("div", null);
    box.appendChild(arena);

    var picker = intro.querySelector("#pair-picker");
    DATA.pairSets.forEach(function (set, i) {
      var best = loadStore()["pair:" + set.contrast];
      var b = el("button", null,
        esc(set.contrast) + (best ? ' <span class="tab-count">' + Number(best.best) + "/" + PAIR_ROUND + "</span>" : ""));
      b.type = "button";
      b.title = set.label_vi;
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(picker.children, function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        startPairRound(set, arena);
      });
      picker.appendChild(b);
    });
    arena.appendChild(el("p", "exercise-hint", "Chọn một cặp âm phía trên để bắt đầu. Gợi ý: bắt đầu với ɪ vs iː — cặp huyền thoại ship/sheep."));
  }

  function startPairRound(set, arena) {
    clearTimeout(pendingTimer);
    if (window.speechSynthesis) speechSynthesis.cancel();
    var round = [];
    for (var i = 0; i < PAIR_ROUND; i++) {
      var pair = set.pairs[i % set.pairs.length];
      round.push({ pair: pair, target: Math.random() < 0.5 ? "a" : "b" });
    }
    /* xáo thứ tự câu */
    for (i = round.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = round[i]; round[i] = round[j]; round[j] = t;
    }
    var idx = 0, correct = 0;
    var wrongLog = []; /* {pair, target, picked} — xem lại cuối lượt */

    arena.innerHTML = "";
    var head = el("p", "quiz-counter", "");
    var card = el("div", "exercise");
    var live = el("div", "sr-only");
    live.setAttribute("role", "status");
    arena.appendChild(head);
    arena.appendChild(card);
    arena.appendChild(live);

    function show() {
      if (idx >= round.length) { finish(); return; }
      var item = round[idx];
      head.textContent = "Câu " + (idx + 1) + " / " + round.length + " · đúng " + correct + " · " + set.label_vi;
      card.innerHTML =
        '<div class="exercise-controls" style="justify-content:center;">' +
        '<button class="chip-btn" type="button" data-act="play">🔊 Nghe lại</button>' +
        "</div>" +
        '<div class="pair-options">' +
        '<button class="pair-opt" type="button" data-pick="a"><b lang="en">' + esc(item.pair.a) + "</b><span>" + esc(item.pair.a_vi) + "</span></button>" +
        '<button class="pair-opt" type="button" data-pick="b"><b lang="en">' + esc(item.pair.b) + "</b><span>" + esc(item.pair.b_vi) + "</span></button>" +
        "</div>" +
        '<div class="exercise-result" role="status"></div>';
      tts(item.pair[item.target], 0.85);

      card.onclick = function (e) {
        var t = e.target.closest && e.target.closest("[data-act], [data-pick]");
        if (!t) return;
        if (t.dataset.act === "play") { tts(item.pair[item.target], 0.85); return; }
        if (t.disabled) return;
        var ok = t.dataset.pick === item.target;
        if (ok) correct++;
        else wrongLog.push({ pair: item.pair, target: item.target, picked: t.dataset.pick });
        var result = card.querySelector(".exercise-result");
        result.innerHTML = ok
          ? "<b>Đúng!</b> Máy đọc “" + esc(item.pair[item.target]) + "”."
          : "<b>Chưa đúng.</b> Máy đọc “" + esc(item.pair[item.target]) + "” (" + esc(item.pair[item.target + "_vi"]) + ") — nghe lại nhé.";
        card.querySelectorAll(".pair-opt").forEach(function (b) {
          b.disabled = true;
          if (b.dataset.pick === item.target) b.classList.add("is-right");
          else if (b === t && !ok) b.classList.add("is-wrong");
        });
        idx++;
        pendingTimer = setTimeout(show, ok ? 900 : 1800);
      };
    }

    function finish() {
      var key = "pair:" + set.contrast;
      var prev = loadStore()[key];
      var isRecord = !prev || correct > Number(prev.best || 0);
      if (isRecord) put(key, { best: correct });
      /* cập nhật badge kỷ lục trên nút chọn cặp đang active */
      var activeBtn = document.querySelector('#pair-picker button[aria-pressed="true"]');
      if (activeBtn) {
        var best = loadStore()[key];
        activeBtn.innerHTML = esc(set.contrast) +
          (best ? ' <span class="tab-count">' + Number(best.best) + "/" + PAIR_ROUND + "</span>" : "");
      }
      live.textContent = "Xong lượt: đúng " + correct + " trên " + round.length + ".";
      card.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">👂 Xong</span>' +
        '<span class="exercise-text">' + correct + "/" + round.length + " câu đúng · " + esc(set.contrast) + "</span></div>" +
        '<p class="exercise-hint">' +
        (correct >= 9 ? "Tai bạn đã tách được cặp này — chuyển sang cặp khó hơn." :
         correct >= 7 ? "Khá rồi — luyện thêm một lượt để chắc tay." :
         "Cặp này còn lẫn — mở Bảng 44 âm đọc lại mẹo của hai âm rồi quay lại.") +
        (isRecord && correct > 0 ? " Kỷ lục mới!" : "") + "</p>" +
        '<div class="exercise-controls"><button class="chip-btn" type="button" data-act="again">↺ Lượt mới</button></div>' +
        (wrongLog.length
          ? '<div class="game-review"><p class="panel-label">Các câu nghe nhầm — nghe lại cả hai từ để tách âm</p>' +
            wrongLog.map(function (w, wi) {
              var heard = w.pair[w.target], picked = w.pair[w.picked];
              return '<div class="game-review-row">' +
                '<div class="grev-main"><p class="grev-en">Máy đọc <b lang="en">' + esc(heard) + "</b> (" + esc(w.pair[w.target + "_vi"]) + ") — bạn chọn " +
                '<span class="grev-bad" lang="en">' + esc(picked) + "</span> (" + esc(w.pair[w.picked + "_vi"]) + ")</p></div>" +
                '<button class="chip-btn" type="button" data-wsay="' + wi + '-' + w.target + '">🔊 ' + esc(heard) + "</button>" +
                '<button class="chip-btn" type="button" data-wsay="' + wi + '-' + w.picked + '">🔊 ' + esc(picked) + "</button>" +
                "</div>";
            }).join("") + "</div>"
          : "");
      card.onclick = function (e) {
        if (e.target.dataset && e.target.dataset.act === "again") { startPairRound(set, arena); return; }
        var ws = e.target.getAttribute && e.target.getAttribute("data-wsay");
        if (ws != null) {
          var parts = ws.split("-");
          tts(wrongLog[Number(parts[0])].pair[parts[1]], 0.85);
        }
      };
      if (window.FocusTools) {
        FocusTools.recordActivity();
        if (correct >= 9) FocusTools.celebrate(card);
      }
    }

    show();
  }

  /* ---------- bài phương pháp ---------- */
  function renderArticles(box) {
    DATA.articles.forEach(function (a) {
      var art = el("details", "method-article");
      art.innerHTML =
        "<summary><span class=\"method-icon\" aria-hidden=\"true\">" + esc(a.icon) + "</span>" +
        "<span><b>" + esc(a.title_vi) + "</b><span class=\"lesson-row-sub\">" + esc(a.summary_vi) + "</span></span></summary>" +
        '<div class="method-body">' +
        a.sections.map(function (sec) {
          return "<h3>" + esc(sec.heading_vi) + "</h3><p>" + esc(sec.body_vi).replace(/\n/g, "<br>") + "</p>";
        }).join("") +
        '<div class="exit-test"><p class="panel-label">Làm ngay trên web này</p><p>' + esc(a.action_vi) + "</p></div>" +
        "</div>";
      box.appendChild(art);
    });
  }

  /* ---------- router (hash: #am | #cap-am | #phuong-phap) ---------- */
  var switchBox = document.getElementById("ipa-switch");
  function parseHash() {
    var h = location.hash.replace(/^#/, "");
    return TABS.some(function (t) { return t.key === h; }) ? h : "am";
  }
  function route() {
    clearTimeout(pendingTimer);
    if (window.speechSynthesis) speechSynthesis.cancel();
    var active = parseHash();
    if (!switchBox.childNodes.length) {
      TABS.forEach(function (t) {
        var b = el("button", null, esc(t.label));
        b.type = "button";
        b.addEventListener("click", function () { location.hash = t.key; });
        switchBox.appendChild(b);
      });
    }
    Array.prototype.forEach.call(switchBox.children, function (b, i) {
      b.setAttribute("aria-pressed", TABS[i].key === active ? "true" : "false");
    });
    root.innerHTML = "";
    var box = el("div");
    root.appendChild(box);
    if (active === "am") renderSounds(box);
    else if (active === "cap-am") renderPairs(box);
    else renderArticles(box);
  }
  window.addEventListener("hashchange", route);
  route();
})();
