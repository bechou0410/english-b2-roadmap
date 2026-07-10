/* Trang luyện 4 kỹ năng theo chặng.
   - Nghe: TTS đọc câu → người học gõ lại → so khớp từng từ (LCS), đạt khi >=80%.
   - Nói: hiện câu → SpeechRecognition chấm từng từ; trình duyệt không hỗ trợ thì
     ghi âm bằng MediaRecorder để nghe lại và tự chấm.
   - Đọc: đoạn văn + 4 câu hỏi trắc nghiệm (quiz-engine).
   - Viết: dịch câu VI→EN chấm bằng so khớp chuẩn hoá + viết đoạn có bài mẫu và
     checklist tự chấm. Điểm tốt nhất lưu localStorage (b2-practice-v1). */

(function () {
  "use strict";

  var STAGES = window.PRACTICE;
  var root = document.getElementById("practice-root");
  if (!STAGES || !STAGES.length) {
    root.innerHTML = "<p>Không tải được dữ liệu luyện tập. Hãy kiểm tra file <code>practice-data.js</code>.</p>";
    return;
  }

  var STORE_KEY = "b2-practice-v1";
  var PASS_PCT = 80;
  var STAGE_TITLES = ["Giai đoạn 1 · 0 → A1", "Giai đoạn 2 · A1 → A2", "Giai đoạn 3 · A2 → B1", "Giai đoạn 4 · B1 → B2"];
  var SKILLS = [
    { key: "nghe", label: "🎧 Nghe" },
    { key: "noi", label: "🎤 Nói" },
    { key: "doc", label: "📖 Đọc" },
    { key: "viet", label: "✍️ Viết" },
    { key: "blitz", label: "⚡ Blitz" },
    { key: "xepcau", label: "🧩 Xếp câu" },
    { key: "noitu", label: "🃏 Nối từ" },
  ];

  /* ---------- store ---------- */
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
  function get(key) { return loadStore()[key] || null; }

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
  function markDone(key, pct, element) {
    var prev = get(key);
    if (!prev || pct > Number(prev.best || 0)) put(key, { best: pct });
    if (window.FocusTools) {
      FocusTools.recordActivity();
      if (pct >= PASS_PCT) FocusTools.celebrate(element);
    }
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
    u.rate = rate || 1;
    speechSynthesis.speak(u);
  }

  /* ---------- so khớp từ + chấm ngữ pháp ----------
     Dùng chung từ translate-grade.js (window.TranslateGrade) — cùng một bộ chấm
     với câu dịch trong bài học, tránh lệch tiêu chí giữa hai nơi. */
  var TG = window.TranslateGrade;
  var normWords = TG.normWords, compare = TG.compare, grammarIssues = TG.grammarIssues;

  /* badge % tốt nhất trên card bài đã làm */
  function bestBadge(text, pass) {
    return '<span class="badge exercise-best' + (pass ? " badge-free" : "") + '">' + esc(text) + "</span>";
  }
  function setBestBadge(card, text, pass) {
    var old = card.querySelector(".exercise-best");
    if (old) old.remove();
    card.querySelector(".exercise-head").insertAdjacentHTML("beforeend", bestBadge(text, pass));
  }
  function resultLine(pct) {
    return pct >= PASS_PCT
      ? "<b>" + pct + "%</b> — đạt. Từ gạch đỏ (nếu có) là chỗ cần để ý."
      : "<b>" + pct + "%</b> — chưa đạt " + PASS_PCT + "%. Nghe/đọc lại bản mẫu rồi thử lần nữa nhé.";
  }

  /* ---------- thanh tiến độ kỹ năng ---------- */
  function progressLine(stage, skillKey) {
    var total, done = 0;
    var sid = stage.stage_id;
    /* các tab trò chơi hiển thị kỷ lục thay vì tiến độ bài */
    if (skillKey === "blitz") {
      var b = get("blitz:" + sid);
      return b ? "kỷ lục: " + Number(b.best || 0) + " điểm" : "chưa có kỷ lục — chơi ván đầu đi!";
    }
    if (skillKey === "xepcau") {
      var o = get("order:" + sid);
      return o ? "ván tốt nhất: " + Number(o.best || 0) + "/8 câu" : "chưa có kỷ lục — chơi ván đầu đi!";
    }
    if (skillKey === "noitu") {
      var m = get("match:" + sid);
      return m ? "kỷ lục: " + (Number(m.timeMs || 0) / 1000).toFixed(1) + "s · " + Number(m.mistakes || 0) + " lỗi" : "chưa có kỷ lục — chơi ván đầu đi!";
    }
    if (skillKey === "nghe") {
      total = stage.listening.length;
      stage.listening.forEach(function (_, i) { var r = get("dict:" + sid + ":" + i); if (r && r.best >= PASS_PCT) done++; });
    } else if (skillKey === "noi") {
      total = stage.speaking.length;
      stage.speaking.forEach(function (_, i) { var r = get("speak:" + sid + ":" + i); if (r && (r.best >= PASS_PCT || r.self)) done++; });
    } else if (skillKey === "doc") {
      total = stage.reading.length;
      stage.reading.forEach(function (_, i) { var r = get("read:" + sid + ":" + i); if (r && r.best >= 3) done++; });
    } else {
      total = stage.writing.sentences.length + 1;
      stage.writing.sentences.forEach(function (_, i) { var r = get("sent:" + sid + ":" + i); if (r && r.best >= PASS_PCT) done++; });
      var p = get("para:" + sid);
      if (p && p.done) done++;
    }
    return done + "/" + total + " bài đạt";
  }

  /* ---------- NGHE: chép chính tả ---------- */
  function renderListening(stage, box) {
    stage.listening.forEach(function (item, i) {
      var key = "dict:" + stage.stage_id + ":" + i;
      var saved = get(key);
      var card = el("div", "exercise" + (saved && saved.best >= PASS_PCT ? " is-done" : ""));
      card.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">Câu ' + (i + 1) + "</span>" +
        '<p class="exercise-hint">' + esc(item.hint_vi) + "</p>" +
        (saved ? bestBadge("Tốt nhất " + Number(saved.best) + "%", Number(saved.best) >= PASS_PCT) : "") +
        "</div>" +
        '<div class="exercise-controls">' +
        '<button class="chip-btn" type="button" data-act="play">🔊 Nghe</button>' +
        '<button class="chip-btn" type="button" data-act="slow">🐢 Chậm</button>' +
        "</div>" +
        '<textarea rows="2" placeholder="Gõ lại chính xác câu bạn nghe được..." aria-label="Câu bạn nghe được"></textarea>' +
        '<div class="exercise-controls"><button class="chip-btn" type="button" data-act="check">Chấm</button></div>' +
        '<div class="exercise-result" role="status"></div>';
      var ta = card.querySelector("textarea");
      var result = card.querySelector(".exercise-result");
      card.addEventListener("click", function (e) {
        var act = e.target.dataset && e.target.dataset.act;
        if (act === "play") tts(item.text, 1);
        if (act === "slow") tts(item.text, 0.6);
        if (act === "check") {
          if (!ta.value.trim()) { result.textContent = "Gõ câu bạn nghe được rồi mới chấm nhé."; return; }
          var r = compare(item.text, ta.value);
          result.innerHTML = resultLine(r.pct) +
            '<div class="word-diff" lang="en">' + r.diffHtml + "</div>" +
            '<p class="exercise-hint">Bản gốc: <span lang="en">' + esc(item.text) + "</span></p>";
          markDone(key, r.pct, card);
          if (r.pct >= PASS_PCT) card.classList.add("is-done");
          var best = get(key);
          if (best) setBestBadge(card, "Tốt nhất " + Number(best.best) + "%", Number(best.best) >= PASS_PCT);
        }
      });
      box.appendChild(card);
    });
  }

  /* ---------- NÓI: đọc to & chấm ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var activeRecognition = null;
  var activeRecognitionKey = null; /* card nào đang nghe — để phân biệt dừng vs chuyển card */
  var activeRecorder = null;       /* MediaRecorder đang ghi — dừng khi đổi trang/card khác */
  var lastBlobUrl = null;

  function renderSpeaking(stage, box) {
    if (!SR) {
      box.appendChild(el("p", "exercise-hint",
        "Trình duyệt này không hỗ trợ nhận dạng giọng nói (hãy dùng Chrome/Edge để được chấm tự động). " +
        "Bạn vẫn luyện được: nghe bản mẫu, ghi âm mình đọc rồi so sánh."));
    }
    /* công cụ ngoài bổ trợ: máy ở đây chấm ĐÚNG TỪ, ELSA chấm ĐÚNG ÂM */
    box.appendChild(el("p", "exercise-hint",
      "💡 Bài ở đây chấm bạn đọc <b>đúng từ</b>. Muốn được chấm chi tiết <b>từng âm</b> (IPA, trọng âm, âm cuối), luyện thêm với " +
      '<a href="https://elsaspeak.com/vi/" target="_blank" rel="noopener noreferrer">ELSA Speak</a> — app chấm phát âm bằng AI, có bản miễn phí, đã nằm trong tài nguyên của lộ trình.'));
    stage.speaking.forEach(function (item, i) {
      var key = "speak:" + stage.stage_id + ":" + i;
      var saved = get(key);
      var card = el("div", "exercise" + (saved && (saved.best >= PASS_PCT || saved.self) ? " is-done" : ""));
      card.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">Câu ' + (i + 1) + "</span>" +
        '<span class="exercise-text" lang="en">' + esc(item.text) + "</span>" +
        (saved ? bestBadge(saved.self ? "Tự chấm: đạt" : "Tốt nhất " + Number(saved.best) + "%", true) : "") +
        "</div>" +
        '<p class="exercise-hint">💡 ' + esc(item.tip_vi) + "</p>" +
        '<div class="exercise-controls">' +
        '<button class="chip-btn" type="button" data-act="play">🔊 Nghe mẫu</button>' +
        (SR
          ? '<button class="chip-btn" type="button" data-act="rec">🎤 Đọc &amp; chấm</button>'
          : '<button class="chip-btn" type="button" data-act="record">⏺ Ghi âm</button>') +
        "</div>" +
        '<div class="exercise-result" role="status"></div>';
      var result = card.querySelector(".exercise-result");

      /* --- chấm tự động bằng SpeechRecognition --- */
      function autoGrade(btn) {
        if (activeRecognition && activeRecognitionKey === key) {
          /* bấm lại chính card đang nghe = dừng */
          activeRecognition.abort();
          activeRecognition = null;
          activeRecognitionKey = null;
          btn.textContent = "🎤 Đọc & chấm";
          btn.setAttribute("aria-pressed", "false");
          result.textContent = "Đã dừng nghe.";
          return;
        }
        if (activeRecognition) activeRecognition.abort(); /* card khác đang nghe → nhường mic */
        var rec = new SR();
        activeRecognition = rec;
        activeRecognitionKey = key;
        rec.lang = "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        btn.textContent = "👂 Đang nghe... (bấm để dừng)";
        btn.setAttribute("aria-pressed", "true");
        result.textContent = "Đọc to cả câu rồi dừng lại một nhịp.";
        rec.onresult = function (e) {
          var said = e.results[0][0].transcript;
          var r = compare(item.text, said);
          result.innerHTML = resultLine(r.pct) +
            '<div class="word-diff" lang="en">' + r.diffHtml + "</div>" +
            '<p class="exercise-hint">Máy nghe thấy: <span lang="en">' + esc(said) + "</span></p>";
          markDone(key, r.pct, card);
          if (r.pct >= PASS_PCT) card.classList.add("is-done");
          var best = get(key);
          if (best) setBestBadge(card, best.self ? "Tự chấm: đạt" : "Tốt nhất " + Number(best.best || 0) + "%", true);
        };
        rec.onerror = function (e) {
          result.textContent = e.error === "not-allowed"
            ? "Bạn cần cho phép trang dùng micro (biểu tượng 🔒 cạnh thanh địa chỉ)."
            : "Không nghe được — thử lại ở nơi yên tĩnh hơn nhé.";
        };
        rec.onend = function () {
          if (activeRecognition === rec) { activeRecognition = null; activeRecognitionKey = null; }
          btn.textContent = "🎤 Đọc & chấm";
          btn.setAttribute("aria-pressed", "false");
        };
        try { rec.start(); } catch (e) { result.textContent = "Không khởi động được micro — thử lại."; }
      }

      /* --- fallback: ghi âm & tự chấm --- */
      var mediaRecorder = null, chunks = [];
      function record(btn) {
        if (mediaRecorder && mediaRecorder.state === "recording") { mediaRecorder.stop(); return; }
        if (activeRecorder && activeRecorder.state === "recording") activeRecorder.stop(); /* card khác đang ghi */
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          result.textContent = "Trình duyệt không cho phép ghi âm.";
          return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          chunks = [];
          mediaRecorder = new MediaRecorder(stream);
          activeRecorder = mediaRecorder;
          mediaRecorder.ondataavailable = function (e) { chunks.push(e.data); };
          mediaRecorder.onstop = function () {
            stream.getTracks().forEach(function (t) { t.stop(); }); /* tắt hẳn micro */
            if (activeRecorder === mediaRecorder) activeRecorder = null;
            if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl); /* không rò rỉ bản ghi cũ */
            var url = URL.createObjectURL(new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" }));
            lastBlobUrl = url;
            result.innerHTML =
              '<audio controls src="' + url + '" style="width:100%; margin-top:0.4rem;"></audio>' +
              '<p class="exercise-hint">Nghe lại và so với bản mẫu (🔊). Bạn thấy mình đọc khớp chưa?</p>' +
              '<div class="exercise-controls"><button class="chip-btn" type="button" data-act="self-ok">✓ Khớp rồi, tính là đạt</button></div>';
            btn.textContent = "⏺ Ghi âm";
          };
          mediaRecorder.start();
          btn.textContent = "⏹ Dừng ghi";
          result.textContent = "Đang ghi âm — đọc to cả câu.";
        }).catch(function () {
          result.textContent = "Bạn cần cho phép trang dùng micro (biểu tượng 🔒 cạnh thanh địa chỉ).";
        });
      }

      card.addEventListener("click", function (e) {
        var act = e.target.dataset && e.target.dataset.act;
        if (act === "play") tts(item.text, 0.9);
        if (act === "rec") autoGrade(e.target);
        if (act === "record") record(e.target);
        if (act === "self-ok") {
          put(key, { self: true });
          card.classList.add("is-done");
          e.target.textContent = "✓ Đã tính là đạt";
          if (window.FocusTools) { FocusTools.recordActivity(); FocusTools.celebrate(card); }
        }
      });
      box.appendChild(card);
    });
  }

  /* ---------- ĐỌC: đoạn văn + câu hỏi ---------- */
  function renderReading(stage, box) {
    stage.reading.forEach(function (passage, i) {
      var key = "read:" + stage.stage_id + ":" + i;
      var saved = get(key);
      var card = el("div", "exercise" + (saved && saved.best >= 3 ? " is-done" : ""));
      card.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">Bài ' + (i + 1) + "</span>" +
        '<span class="exercise-text" lang="en">' + esc(passage.title) + "</span>" +
        (saved ? bestBadge("Tốt nhất " + Number(saved.best) + "/" + Number(saved.total || 4), Number(saved.best) >= 3) : "") +
        "</div>" +
        '<p class="reading-passage" lang="en">' + esc(passage.text) + "</p>";
      var quizBox = el("div");
      card.appendChild(quizBox);
      /* live region tạo TRƯỚC, đổ nội dung sau — screen reader mới đọc được */
      var banner = el("div", "");
      banner.setAttribute("role", "status");
      card.appendChild(banner);
      QuizEngine.renderList(quizBox, QuizEngine.shuffleOptions(passage.questions), {
        submitLabel: "Chấm điểm",
        onComplete: function (res) {
          var prev = get(key);
          if (!prev || res.correct > Number(prev.best || 0)) put(key, { best: res.correct, total: res.total });
          banner.className = "score-banner " + (res.correct >= 3 ? "pass" : "fail");
          banner.innerHTML =
            "<b>" + res.correct + "/" + res.total + " câu đúng.</b> " +
            (res.correct >= 3 ? "Đọc hiểu tốt — sang bài tiếp theo." : "Đọc lại đoạn văn và phần giải thích rồi thử lại nhé.");
          if (res.correct >= 3) card.classList.add("is-done");
          if (window.FocusTools) {
            FocusTools.recordActivity();
            if (res.correct >= 3) FocusTools.celebrate(banner);
          }
        },
      });
      box.appendChild(card);
    });
  }

  /* ---------- VIẾT: dịch câu + đoạn văn ---------- */
  function renderWriting(stage, box) {
    stage.writing.sentences.forEach(function (item, i) {
      var key = "sent:" + stage.stage_id + ":" + i;
      var saved = get(key);
      var card = el("div", "exercise" + (saved && saved.best >= PASS_PCT ? " is-done" : ""));
      card.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">Câu ' + (i + 1) + "</span>" +
        '<span class="exercise-text">' + esc(item.vi) + "</span>" +
        (saved ? bestBadge("Tốt nhất " + Number(saved.best) + "%", Number(saved.best) >= PASS_PCT) : "") +
        "</div>" +
        '<input type="text" placeholder="Dịch sang tiếng Anh..." aria-label="Bản dịch tiếng Anh của bạn" lang="en">' +
        '<div class="exercise-controls"><button class="chip-btn" type="button" data-act="check">Chấm</button></div>' +
        '<div class="exercise-result" role="status"></div>';
      var input = card.querySelector("input");
      var result = card.querySelector(".exercise-result");
      card.addEventListener("click", function (e) {
        if (!e.target.dataset || e.target.dataset.act !== "check") return;
        if (!input.value.trim()) { result.textContent = "Viết bản dịch của bạn rồi mới chấm nhé."; return; }
        var mineWords = normWords(input.value);
        var mine = mineWords.join(" ");
        var best = 0, bestMissed = [];
        item.answers.forEach(function (ans) {
          var pct, missed;
          if (normWords(ans).join(" ") === mine) { pct = 100; missed = []; }
          else { var r = compare(ans, input.value); pct = r.pct; missed = r.missed; }
          if (pct > best) { best = pct; bestMissed = missed; }
        });
        /* gần đúng về số từ nhưng dính lỗi ngữ pháp = lỗi nghiêm trọng, không đạt */
        var issues = best > 0 && best < 100 ? grammarIssues(bestMissed, mineWords) : [];
        var effective = best;
        var verdict;
        if (best === 100) {
          verdict = "<b>Chính xác.</b>";
        } else if (issues.length) {
          effective = Math.min(best, 60);
          verdict = '<b class="grev-bad">Lỗi ngữ pháp — tính là chưa đạt</b> (khớp ' + best + "% số từ): " +
            issues.map(esc).join("; ") + ".";
        } else if (best >= PASS_PCT) {
          verdict = "<b>Gần đúng (" + best + "%).</b> So từng từ với bản mẫu:";
        } else {
          verdict = "<b>Chưa khớp (" + best + "%).</b> So với bản mẫu:";
        }
        result.innerHTML = verdict +
          '<div class="model-answer"><p class="panel-label">Bản mẫu</p><p lang="en">' + esc(item.answers[0]) + "</p>" +
          '<p class="exercise-hint">' + esc(item.note_vi) + "</p></div>";
        markDone(key, effective, card);
        if (effective >= PASS_PCT) card.classList.add("is-done");
        var bestSaved = get(key);
        if (bestSaved) setBestBadge(card, "Tốt nhất " + Number(bestSaved.best) + "%", Number(bestSaved.best) >= PASS_PCT);
      });
      box.appendChild(card);
    });

    /* đoạn văn có bài mẫu + checklist tự chấm */
    var para = stage.writing.paragraph;
    var pKey = "para:" + stage.stage_id;
    var savedP = get(pKey) || { text: "", checked: [], done: false };
    var card = el("div", "exercise" + (savedP.done ? " is-done" : ""));
    card.innerHTML =
      '<div class="exercise-head"><span class="exercise-num">Viết đoạn</span>' +
      '<span class="exercise-text">' + esc(para.prompt_vi) + "</span></div>" +
      '<textarea rows="6" placeholder="Viết đoạn văn tiếng Anh của bạn ở đây — bản nháp tự lưu." aria-label="Đoạn văn của bạn" lang="en">' + esc(savedP.text) + "</textarea>" +
      '<p class="word-count"></p>' +
      '<div class="exercise-controls"><button class="chip-btn" type="button" data-act="model">Xem bài mẫu &amp; tự chấm</button></div>' +
      '<div class="exercise-result"></div>' +
      '<p class="exercise-hint" role="status" data-para-status></p>';
    var ta = card.querySelector("textarea");
    var wc = card.querySelector(".word-count");
    var result = card.querySelector(".exercise-result");
    function words() { return ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; }
    function renderWc() {
      wc.textContent = words() + " từ (tối thiểu " + para.min_words + ")";
    }
    renderWc();
    var saveTm = null;
    ta.addEventListener("input", function () {
      renderWc();
      clearTimeout(saveTm);
      saveTm = setTimeout(function () {
        var cur = get(pKey) || { checked: [] };
        put(pKey, { text: ta.value, checked: cur.checked || [], done: !!cur.done });
      }, 400);
    });
    card.addEventListener("click", function (e) {
      if (!e.target.dataset || e.target.dataset.act !== "model") return;
      var checkedSaved = (get(pKey) || {}).checked || [];
      result.innerHTML =
        '<div class="model-answer"><p class="panel-label">Bài mẫu</p><p lang="en">' + esc(para.model_en) + "</p></div>" +
        '<p class="exercise-hint" style="margin-top:0.8rem;">Tự chấm bài của bạn — tick đủ là hoàn thành:</p>' +
        '<ul class="self-checklist">' +
        para.checklist_vi.map(function (c, ci) {
          return '<li><label><input type="checkbox" data-ci="' + ci + '"' + (checkedSaved[ci] ? " checked" : "") + ">" +
            "<span>" + esc(c) + "</span></label></li>";
        }).join("") +
        "</ul>";
      result.querySelectorAll("input[data-ci]").forEach(function (cb) {
        cb.addEventListener("change", function () {
          var cur = get(pKey) || { text: ta.value, checked: [] };
          cur.checked = cur.checked || [];
          cur.checked[Number(cb.dataset.ci)] = cb.checked;
          var allChecked = para.checklist_vi.every(function (_, ci) { return cur.checked[ci]; });
          var enough = words() >= para.min_words;
          var wasDone = cur.done;
          cur.done = allChecked && enough;
          cur.text = ta.value;
          put(pKey, cur);
          var status = card.querySelector("[data-para-status]");
          if (cur.done && !wasDone) {
            card.classList.add("is-done");
            status.textContent = "Đã tính hoàn thành bài viết đoạn ✓";
            if (window.FocusTools) { FocusTools.recordActivity(); FocusTools.celebrate(card); }
          }
          if (allChecked && !enough) {
            status.textContent = "Đã tick đủ checklist — cần thêm từ: hiện " + words() + "/" + para.min_words + " từ tối thiểu.";
          }
        });
      });
    });
    box.appendChild(card);
  }

  /* ==================================================================
     TRÒ CHƠI — tái dùng dữ liệu sẵn có (ngân hàng đề, câu luyện, flashcard),
     phần thưởng tức thì: điểm, combo, kỷ lục cá nhân.
     ================================================================== */
  var gameCleanup = null; /* route() gọi để dừng timer của game đang chạy */

  function stageIndexOf(stage) {
    return STAGES.indexOf(stage);
  }
  function bestOf(key) {
    var r = get(key);
    return r && typeof r === "object" ? r : null;
  }

  /* ---------- ⚡ BLITZ: 60 giây, trả lời nhanh, combo nhân điểm ---------- */
  var BLITZ_SECONDS = 60;
  function blitzPool(si) {
    /* trộn câu hỏi bài học + ngân hàng đề của chặng */
    var pool = [];
    if (window.LESSONS && window.LESSONS[si]) {
      window.LESSONS[si].lessons.forEach(function (l) { pool = pool.concat(l.practice); });
      pool = pool.concat(window.LESSONS[si].stage_test.questions);
    }
    return pool;
  }

  function renderBlitz(stage, box) {
    var si = stageIndexOf(stage);
    var key = "blitz:" + stage.stage_id;
    var pool = blitzPool(si);
    if (!pool.length) {
      box.appendChild(el("p", "exercise-hint", "Không tải được ngân hàng câu hỏi (lessons-data.js)."));
      return;
    }
    var saved = bestOf(key);
    var intro = el("div", "exercise game-intro");
    intro.innerHTML =
      '<div class="exercise-head"><span class="exercise-num">⚡ Blitz</span>' +
      '<span class="exercise-text">' + BLITZ_SECONDS + " giây — trả lời nhanh nhất có thể</span></div>" +
      '<p class="exercise-hint">Đúng +10 điểm × hệ số combo (3 câu đúng liên tiếp: ×2, 6 câu: ×3...). Sai không bị trừ, chỉ mất combo. Ngân hàng ' + pool.length + " câu của chặng này, mỗi ván một đề khác.</p>" +
      (saved ? '<p class="game-best">Kỷ lục của bạn: <b>' + Number(saved.best || 0) + " điểm</b></p>" : "") +
      '<div class="exercise-controls"><button class="btn btn-primary" data-act="start" type="button">▶ Chơi</button></div>';
    box.appendChild(intro);

    intro.addEventListener("click", function (e) {
      if (!e.target.dataset || e.target.dataset.act !== "start") return;
      startBlitz(stage, box, pool, key);
    });
  }

  function startBlitz(stage, box, pool, key) {
    box.innerHTML = "";
    var questions = QuizEngine.shuffleOptions(QuizEngine.sample(pool, pool.length));
    var qi = 0, score = 0, combo = 0, correct = 0, answered = 0;
    var history = []; /* {q, picked} để xem lại + đọc giải thích sau ván */
    var endsAt = Date.now() + BLITZ_SECONDS * 1000;

    var hud = el("div", "blitz-hud",
      '<span class="blitz-score">0</span><span class="blitz-combo"></span><span class="blitz-time">' + BLITZ_SECONDS + "s</span>");
    var bar = el("div", "quiz-stepper-bar", '<div class="quiz-stepper-fill" style="width:100%"></div>');
    var qBox = el("div", null);
    var live = el("div", "sr-only");
    live.setAttribute("role", "status");
    box.appendChild(hud);
    box.appendChild(bar);
    box.appendChild(qBox);
    box.appendChild(live);

    var interval = setInterval(function () {
      var left = Math.max(0, endsAt - Date.now());
      hud.querySelector(".blitz-time").textContent = Math.ceil(left / 1000) + "s";
      bar.querySelector(".quiz-stepper-fill").style.width = (left / (BLITZ_SECONDS * 1000)) * 100 + "%";
      if (left <= 0) endBlitz();
    }, 100);
    /* phím 1-4: gắn lên document vì focus thường nằm ở body/nút vừa bấm */
    function keyHandler(e) {
      var n = Number(e.key);
      if (n >= 1 && n <= 4) {
        var b = qBox.querySelectorAll(".blitz-opt")[n - 1];
        if (b && !b.disabled) { e.preventDefault(); b.click(); }
      }
    }
    document.addEventListener("keydown", keyHandler);
    gameCleanup = function () {
      clearInterval(interval);
      document.removeEventListener("keydown", keyHandler);
    };

    function multiplier() { return 1 + Math.floor(combo / 3); }
    function updateHud() {
      hud.querySelector(".blitz-score").textContent = score;
      hud.querySelector(".blitz-combo").innerHTML = combo >= 3
        ? '<svg class="streak-flame" viewBox="0 0 24 24" aria-hidden="true"><path class="flame-body" d="M12 2c-.5 3.2-2.3 5.3-4 7.2-1.5 1.7-2.8 3.5-2.8 5.9a6.8 6.8 0 0 0 13.6 0c0-2.9-1.6-5.4-3.6-7.7.1 1.3-.5 2.3-1.6 2.8C14.4 7.8 13.7 4.8 12 2z"/><path class="flame-core" d="M12 13.2c1.3 1.4 2.2 2.6 2.2 4a2.7 2.7 0 0 1-5.4 0c0-.9.4-1.7 1-2.4.2.6.7.9 1.4 1-.6-.9-.5-1.8.8-2.6z"/></svg> combo ×' + multiplier()
        : "";
    }

    function showQuestion() {
      var q = questions[qi % questions.length];
      qi++;
      qBox.innerHTML =
        '<p class="blitz-question" lang="en">' + esc(q.question).replace(/\n/g, "<br>") + "</p>" +
        '<div class="blitz-options">' +
        q.options.map(function (o, i) {
          return '<button class="blitz-opt" type="button" data-i="' + i + '"><span aria-hidden="true">' + (i + 1) + ".</span> " + esc(o) + "</button>";
        }).join("") +
        "</div>";
      var opts = qBox.querySelectorAll(".blitz-opt");
      opts.forEach(function (b) {
        b.addEventListener("click", function (e) {
          /* e.target có thể là <span> số thứ tự bên trong — b mới là nút */
          if (Date.now() >= endsAt) return;
          answered++;
          var ok = Number(b.dataset.i) === q.answer;
          history.push({ q: q, picked: Number(b.dataset.i) });
          if (ok) { correct++; combo++; score += 10 * multiplier(); b.classList.add("is-right"); }
          else { combo = 0; b.classList.add("is-wrong"); opts[q.answer].classList.add("is-right"); }
          updateHud();
          opts.forEach(function (x) { x.disabled = true; });
          setTimeout(showQuestion, ok ? 220 : 650); /* sai thì kịp nhìn đáp án đúng */
        });
      });
    }

    function endBlitz() {
      clearInterval(interval);
      document.removeEventListener("keydown", keyHandler);
      gameCleanup = null;
      live.textContent = "Hết giờ. " + score + " điểm, đúng " + correct + " trên " + answered + " câu.";
      var prev = bestOf(key);
      var isRecord = !prev || score > Number(prev.best || 0);
      if (isRecord) put(key, { best: score });
      box.innerHTML = "";
      var end = el("div", "exercise");
      end.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">⚡ Hết giờ</span>' +
        '<span class="exercise-text">' + score + " điểm · đúng " + correct + "/" + answered + " câu</span></div>" +
        '<p class="exercise-hint" role="status">' +
        (isRecord ? "Kỷ lục mới! " : "Kỷ lục của bạn: " + Number(prev && prev.best || 0) + " điểm. ") +
        (correct === answered && answered > 0 ? "Không sai câu nào — quá gọn." : "Câu sai đã hiện đáp án đúng ngay lúc chơi — não học nhanh nhất ở khoảnh khắc đó.") +
        "</p>" +
        '<div class="exercise-controls">' +
        '<button class="btn btn-primary" data-act="again" type="button">↺ Chơi lại</button>' +
        (history.length
          ? '<button class="btn btn-ghost" data-act="review" type="button">📋 Xem lại ' + history.length + " câu (" + (answered - correct) + " sai)</button>"
          : "") +
        "</div>" +
        '<div class="game-review-box"></div>';
      box.appendChild(end);
      end.querySelector('[data-act="again"]').addEventListener("click", function () {
        startBlitz(stage, box, pool, key);
      });
      var revBtn = end.querySelector('[data-act="review"]');
      if (revBtn) revBtn.addEventListener("click", function () {
        var rb = end.querySelector(".game-review-box");
        if (rb.childNodes.length) { rb.innerHTML = ""; return; }
        rb.innerHTML = '<p class="exercise-hint" style="margin:1rem 0 0.6rem;">Trắc nghiệm đoán mò vẫn có thể đúng — đọc GIẢI THÍCH từng câu mới là học. Gặp từ lạ trong câu hay đáp án? Bôi đen từ đó → 🔎 Dịch → ➕ lưu thẻ.</p>';
        var list = el("div");
        rb.appendChild(list);
        QuizEngine.renderReview(list, history.map(function (h) { return h.q; }), history.map(function (h) { return h.picked; }));
      });
      if (window.FocusTools) {
        FocusTools.recordActivity();
        if (isRecord && score > 0) FocusTools.celebrate(end);
      }
    }

    updateHud();
    showQuestion();
  }

  /* ---------- 🧩 XẾP CÂU: chạm từng từ để ghép lại đúng thứ tự ---------- */
  var ORDER_ROUND = 8;
  function orderPool(stage) {
    /* câu nghe + nói của chặng, ưu tiên câu vừa tay (<=12 từ) */
    var all = stage.listening.map(function (x) { return x.text; })
      .concat(stage.speaking.map(function (x) { return x.text; }));
    var short = all.filter(function (t) { return t.split(/\s+/).length <= 12; });
    return short.length >= ORDER_ROUND ? short : all;
  }

  function renderWordOrder(stage, box) {
    var key = "order:" + stage.stage_id;
    var saved = bestOf(key);
    var intro = el("div", "exercise game-intro");
    intro.innerHTML =
      '<div class="exercise-head"><span class="exercise-num">🧩 Xếp câu</span>' +
      '<span class="exercise-text">Chạm từng từ để ghép câu đúng thứ tự</span></div>' +
      '<p class="exercise-hint">' + ORDER_ROUND + " câu mỗi ván, lấy từ kho câu nghe–nói của chặng. Ghép đúng được nghe máy đọc cả câu — mắt, tay và tai cùng nhớ.</p>" +
      (saved ? '<p class="game-best">Ván tốt nhất: <b>' + Number(saved.best || 0) + "/" + ORDER_ROUND + " câu không cần bỏ qua</b></p>" : "") +
      '<div class="exercise-controls"><button class="btn btn-primary" data-act="start" type="button">▶ Chơi</button></div>';
    box.appendChild(intro);
    intro.addEventListener("click", function (e) {
      if (e.target.dataset && e.target.dataset.act === "start") startWordOrder(stage, box, key);
    });
  }

  function startWordOrder(stage, box, key) {
    box.innerHTML = "";
    var sentences = QuizEngine.sample(orderPool(stage), ORDER_ROUND);
    var idx = 0, solved = 0;
    var roundLog = []; /* {text, ok} để xem lại cuối ván */
    var locked = false;       /* khoá bảng từ trong lúc chờ chuyển câu — chặn đếm đôi */
    var pendingTimer = null;
    gameCleanup = function () { clearTimeout(pendingTimer); };
    var head = el("p", "quiz-counter", "");
    var area = el("div", null);
    var live = el("div", "sr-only");
    live.setAttribute("role", "status");
    box.appendChild(head);
    box.appendChild(area);
    box.appendChild(live);

    function norm(s) { return s.replace(/\s+/g, " ").trim(); }

    function showSentence() {
      locked = false;
      if (idx >= sentences.length) { endRound(); return; }
      head.textContent = "Câu " + (idx + 1) + " / " + sentences.length + " · đúng " + solved;
      var target = norm(sentences[idx]);
      var words = target.split(" ");
      var shuffled = QuizEngine.sample(words.map(function (w, i) { return { w: w, i: i }; }), words.length);
      /* câu ngắn có thể xáo ra đúng thứ tự gốc — xoay 1 bước nếu vậy */
      if (shuffled.map(function (x) { return x.w; }).join(" ") === target && words.length > 2) {
        shuffled.push(shuffled.shift());
      }
      var picked = [];

      area.innerHTML =
        '<div class="exercise order-card">' +
        '<div class="order-built" aria-label="Câu bạn đang ghép"></div>' +
        '<div class="order-bank"></div>' +
        '<div class="exercise-controls">' +
        '<button class="chip-btn" data-act="skip" type="button">Bỏ qua (xem đáp án)</button>' +
        "</div>" +
        '<div class="exercise-result" role="status"></div></div>';
      var builtBox = area.querySelector(".order-built");
      var bankBox = area.querySelector(".order-bank");
      var result = area.querySelector(".exercise-result");

      function renderChips() {
        builtBox.innerHTML = picked.length
          ? picked.map(function (p, pi) {
            return '<button class="word-chip is-picked" type="button" data-pick="' + pi + '" lang="en">' + esc(p.w) + "</button>";
          }).join("")
          : '<span class="exercise-hint">Chạm từ bên dưới để bắt đầu…</span>';
        bankBox.innerHTML = shuffled.map(function (s, siW) {
          var used = picked.indexOf(s) >= 0;
          return '<button class="word-chip" type="button" data-bank="' + siW + '"' + (used ? " disabled" : "") + ' lang="en">' + esc(s.w) + "</button>";
        }).join("");
      }
      renderChips();

      function check() {
        if (picked.length !== words.length) return;
        var attempt = picked.map(function (p) { return p.w; }).join(" ");
        if (attempt === target) {
          locked = true; /* chặn thao tác trong lúc chờ chuyển câu */
          solved++;
          roundLog.push({ text: target, ok: true });
          result.innerHTML = '<b>Chuẩn!</b> <span lang="en">' + esc(target) + "</span>";
          live.textContent = "Chính xác: " + target + ". Đúng " + solved + " câu.";
          tts(target, 0.95);
          idx++;
          pendingTimer = setTimeout(showSentence, 1400);
        } else {
          result.textContent = "Chưa đúng thứ tự — chạm từ ở câu trên để trả lại rồi xếp lại.";
        }
      }

      area.onclick = function (e) {
        if (locked) return;
        var t = e.target;
        if (t.dataset && t.dataset.bank != null && !t.disabled) {
          picked.push(shuffled[Number(t.dataset.bank)]);
          renderChips();
          check();
        } else if (t.dataset && t.dataset.pick != null) {
          picked.splice(Number(t.dataset.pick), 1);
          renderChips();
        } else if (t.dataset && t.dataset.act === "skip") {
          locked = true;
          roundLog.push({ text: target, ok: false });
          result.innerHTML = "Đáp án: <b lang=\"en\">" + esc(target) + "</b>";
          live.textContent = "Đáp án: " + target;
          tts(target, 0.95);
          idx++;
          pendingTimer = setTimeout(showSentence, 1600);
        }
      };
    }

    function endRound() {
      gameCleanup = null;
      if (!box.isConnected) return; /* người dùng đã rời màn — không nổ pháo giấy mồ côi */
      var prev = bestOf(key);
      var isRecord = !prev || solved > Number(prev.best || 0);
      if (isRecord) put(key, { best: solved });
      area.innerHTML = "";
      head.textContent = "";
      var end = el("div", "exercise");
      end.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">🧩 Xong ván</span>' +
        '<span class="exercise-text">' + solved + "/" + sentences.length + " câu tự ghép đúng</span></div>" +
        '<p class="exercise-hint" role="status">' + (isRecord && solved > 0 ? "Kỷ lục mới!" : "Ván tốt nhất: " + Number(prev && prev.best || 0) + "/" + ORDER_ROUND + ".") + "</p>" +
        '<div class="exercise-controls"><button class="btn btn-primary" data-act="again" type="button">↺ Ván mới</button></div>' +
        '<div class="game-review">' +
        '<p class="panel-label">Xem lại cả ván — nghe lại và xem nghĩa từng câu</p>' +
        roundLog.map(function (rl, ri) {
          return '<div class="game-review-row">' +
            '<button class="chip-btn" type="button" data-rsay="' + ri + '" aria-label="Đọc câu">🔊</button>' +
            '<div class="grev-main"><p class="grev-en" lang="en">' + (rl.ok ? "✓ " : '<span class="grev-bad">✗</span> ') + esc(rl.text) + "</p>" +
            '<p class="grev-sub" data-rvi="' + ri + '"></p></div>' +
            '<button class="chip-btn" type="button" data-rtrans="' + ri + '">Dịch</button>' +
            "</div>";
        }).join("") +
        "</div>";
      box.appendChild(end);
      end.querySelector('[data-act="again"]').addEventListener("click", function () {
        end.remove();
        startWordOrder(stage, box, key);
      });
      end.addEventListener("click", function (e) {
        var say = e.target.getAttribute && e.target.getAttribute("data-rsay");
        var tr = e.target.getAttribute && e.target.getAttribute("data-rtrans");
        if (say != null) tts(roundLog[Number(say)].text, 0.9);
        if (tr != null && window.WordLookup) {
          var sub = end.querySelector('[data-rvi="' + tr + '"]');
          if (sub.textContent) return;
          sub.textContent = "Đang dịch…";
          WordLookup.translate(roundLog[Number(tr)].text)
            .then(function (r2) { sub.textContent = r2.vi; })
            .catch(function () { sub.textContent = "(không dịch được — kiểm tra mạng)"; });
        }
      });
      if (window.FocusTools) {
        FocusTools.recordActivity();
        if (solved === sentences.length) FocusTools.celebrate(end);
      }
    }

    showSentence();
  }

  /* ---------- 🃏 NỐI TỪ: ghép từ ↔ nghĩa từ bộ flashcard của chặng ---------- */
  var MATCH_PAIRS = 6;
  function renderMatching(stage, box) {
    var si = stageIndexOf(stage);
    var deck = window.FLASHDECKS && window.FLASHDECKS[si] ? window.FLASHDECKS[si].cards : [];
    var key = "match:" + stage.stage_id;
    if (deck.length < MATCH_PAIRS) {
      box.appendChild(el("p", "exercise-hint", "Không tải được bộ thẻ (flashcards-data.js)."));
      return;
    }
    var saved = bestOf(key);
    var intro = el("div", "exercise game-intro");
    intro.innerHTML =
      '<div class="exercise-head"><span class="exercise-num">🃏 Nối từ</span>' +
      '<span class="exercise-text">Ghép ' + MATCH_PAIRS + " cặp từ ↔ nghĩa nhanh nhất có thể</span></div>" +
      '<p class="exercise-hint">Từ lấy ngẫu nhiên từ bộ flashcard ' + deck.length + " thẻ của chặng. Ghép đúng máy đọc từ luôn — nghe kèm nhớ.</p>" +
      (saved ? '<p class="game-best">Kỷ lục: <b>' + (Number(saved.timeMs || 0) / 1000).toFixed(1) + "s · " + Number(saved.mistakes || 0) + " lỗi</b></p>" : "") +
      '<div class="exercise-controls"><button class="btn btn-primary" data-act="start" type="button">▶ Chơi</button></div>';
    box.appendChild(intro);
    intro.addEventListener("click", function (e) {
      if (e.target.dataset && e.target.dataset.act === "start") startMatching(stage, box, deck, key);
    });
  }

  function startMatching(stage, box, deck, key) {
    box.innerHTML = "";
    var pairs = QuizEngine.sample(deck, MATCH_PAIRS);
    var left = QuizEngine.sample(pairs, pairs.length);   /* cột từ */
    var right = QuizEngine.sample(pairs, pairs.length);  /* cột nghĩa */
    var startAt = Date.now(), mistakes = 0, matched = 0;
    var selLeft = null;
    var wrongByEn = {}; /* từ nào bị ghép sai bao nhiêu lần — dùng cho phần xem lại */

    var head = el("p", "quiz-counter", "0/" + MATCH_PAIRS + " cặp · 0 lỗi");
    var grid = el("div", "match-grid");
    grid.innerHTML =
      '<div class="match-col">' + left.map(function (c, i) {
        return '<button class="word-chip match-en" type="button" data-en="' + i + '" lang="en">' + esc(c.en) + "</button>";
      }).join("") + "</div>" +
      '<div class="match-col">' + right.map(function (c, i) {
        return '<button class="word-chip match-vi" type="button" data-vi="' + i + '">' + esc(c.vi) + "</button>";
      }).join("") + "</div>";
    box.appendChild(head);
    box.appendChild(grid);

    grid.addEventListener("click", function (e) {
      var t = e.target;
      if (t.dataset && t.dataset.en != null && !t.disabled) {
        grid.querySelectorAll(".match-en").forEach(function (b) { b.classList.remove("is-sel"); });
        t.classList.add("is-sel");
        selLeft = Number(t.dataset.en);
      } else if (t.dataset && t.dataset.vi != null && !t.disabled && selLeft != null) {
        /* so theo NGHĨA (text) chứ không theo reference — hai từ trùng nghĩa
           tiếng Việt thì chọn thẻ nghĩa nào cũng phải được chấp nhận */
        var ok = right[Number(t.dataset.vi)].vi === left[selLeft].vi;
        var enBtn = grid.querySelector('[data-en="' + selLeft + '"]');
        if (ok) {
          matched++;
          tts(left[selLeft].en, 1);
          enBtn.disabled = true;
          t.disabled = true;
          enBtn.classList.remove("is-sel");
          enBtn.classList.add("is-matched");
          t.classList.add("is-matched");
          selLeft = null;
          if (matched === MATCH_PAIRS) endMatch();
        } else {
          mistakes++;
          wrongByEn[left[selLeft].en] = (wrongByEn[left[selLeft].en] || 0) + 1;
          t.classList.add("is-wrong-flash");
          setTimeout(function () { t.classList.remove("is-wrong-flash"); }, 400);
        }
        head.textContent = matched + "/" + MATCH_PAIRS + " cặp · " + mistakes + " lỗi";
      }
    });

    function endMatch() {
      var timeMs = Date.now() - startAt;
      var prev = bestOf(key);
      /* kỷ lục: ít lỗi hơn, hoặc bằng lỗi mà nhanh hơn.
         Đọc số bằng isFinite tường minh — `prev.mistakes || 99` biến kỷ lục
         0 lỗi thành 99 và bị ván tệ hơn ghi đè */
      var pm = prev && isFinite(Number(prev.mistakes)) ? Number(prev.mistakes) : Infinity;
      var pt = prev && isFinite(Number(prev.timeMs)) ? Number(prev.timeMs) : Infinity;
      var isRecord = mistakes < pm || (mistakes === pm && timeMs < pt);
      if (isRecord) put(key, { timeMs: timeMs, mistakes: mistakes, best: MATCH_PAIRS });
      var end = el("div", "exercise");
      end.innerHTML =
        '<div class="exercise-head"><span class="exercise-num">🃏 Xong</span>' +
        '<span class="exercise-text">' + (timeMs / 1000).toFixed(1) + "s · " + mistakes + " lỗi</span></div>" +
        '<p class="exercise-hint" role="status">' + (isRecord ? "Kỷ lục mới!" : "Kỷ lục: " + (pt / 1000).toFixed(1) + "s · " + pm + " lỗi.") + "</p>" +
        '<div class="exercise-controls"><button class="btn btn-primary" data-act="again" type="button">↺ Ván mới</button></div>' +
        '<div class="game-review">' +
        '<p class="panel-label">Học sâu 6 từ vừa ghép — nối được cặp chưa chắc đã dùng được từ</p>' +
        pairs.map(function (c, ci) {
          var wrong = wrongByEn[c.en];
          return '<div class="game-review-row">' +
            '<button class="chip-btn" type="button" data-msay="' + ci + '" aria-label="Đọc từ ' + esc(c.en) + '">🔊</button>' +
            '<div class="grev-main"><p class="grev-en"><span lang="en">' + esc(c.en) + "</span>" +
            (c.ipa ? ' <span class="lookup-ipa" style="display:inline;">' + esc(c.ipa) + "</span>" : "") +
            " — " + esc(c.vi) +
            (wrong ? ' <span class="grev-bad">(sai ' + wrong + " lần)</span>" : "") + "</p>" +
            (c.example_en ? '<p class="grev-sub" lang="en">' + esc(c.example_en) + "</p>" : "") +
            (c.example_vi ? '<p class="grev-sub">' + esc(c.example_vi) + "</p>" : "") +
            "</div>" +
            (c.example_en ? '<button class="chip-btn" type="button" data-mex="' + ci + '" aria-label="Đọc câu ví dụ">🔊 ví dụ</button>' : "") +
            "</div>";
        }).join("") +
        "</div>";
      box.appendChild(end);
      end.querySelector('[data-act="again"]').addEventListener("click", function () {
        startMatching(stage, box, deck, key);
      });
      end.addEventListener("click", function (e) {
        var ms = e.target.getAttribute && e.target.getAttribute("data-msay");
        var me = e.target.getAttribute && e.target.getAttribute("data-mex");
        if (ms != null) tts(pairs[Number(ms)].en, 0.9);
        if (me != null) tts(pairs[Number(me)].example_en, 0.95);
      });
      if (window.FocusTools) {
        FocusTools.recordActivity();
        if (mistakes === 0) FocusTools.celebrate(end);
      }
    }
  }

  /* ---------- router ---------- */
  var RENDERERS = {
    nghe: renderListening, noi: renderSpeaking, doc: renderReading, viet: renderWriting,
    blitz: renderBlitz, xepcau: renderWordOrder, noitu: renderMatching,
  };

  function parseHash() {
    var m = location.hash.replace(/^#/, "").split("/");
    var si = parseInt((m[0] || "").replace("stage-", ""), 10);
    if (!(si >= 1 && si <= STAGES.length)) si = 1;
    var skill = SKILLS.some(function (s) { return s.key === m[1]; }) ? m[1] : "nghe";
    return { stage: si, skill: skill };
  }

  var stageBox = document.getElementById("stage-switch");
  var skillBox = document.getElementById("skill-switch");

  function maxUnlocked() {
    return window.Progression ? Progression.unlockedStage() : STAGES.length;
  }
  function renderSwitches(r) {
    if (!stageBox.childNodes.length) {
      STAGES.forEach(function (s, i) {
        var b = el("button", null, "");
        b.type = "button";
        b.style.setProperty("--sw-c", "var(--s" + (i + 1) + ")");
        b.style.setProperty("--sw-ink", "var(--s" + (i + 1) + "-ink)");
        b.addEventListener("click", function () { location.hash = "stage-" + (i + 1) + "/" + parseHash().skill; });
        stageBox.appendChild(b);
      });
      SKILLS.forEach(function (s) {
        var b = el("button", null, esc(s.label));
        b.type = "button";
        b.addEventListener("click", function () { location.hash = "stage-" + parseHash().stage + "/" + s.key; });
        skillBox.appendChild(b);
      });
    }
    var unlocked = maxUnlocked();
    Array.prototype.forEach.call(stageBox.children, function (b, i) {
      var locked = i + 1 > unlocked;
      b.setAttribute("aria-pressed", i + 1 === r.stage ? "true" : "false");
      b.disabled = locked;
      b.innerHTML = (locked ? "🔒 " : "") + esc(STAGE_TITLES[i]);
      b.title = locked && window.Progression ? Progression.lockHint(i + 1) : "";
    });
    Array.prototype.forEach.call(skillBox.children, function (b, i) {
      b.setAttribute("aria-pressed", SKILLS[i].key === r.skill ? "true" : "false");
    });
  }

  function route() {
    /* dừng nhận dạng/ghi âm/đọc/timer game đang dở khi chuyển màn */
    if (activeRecognition) { activeRecognition.abort(); activeRecognition = null; activeRecognitionKey = null; }
    if (activeRecorder && activeRecorder.state === "recording") activeRecorder.stop();
    if (gameCleanup) { gameCleanup(); gameCleanup = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    var r = parseHash();
    /* chống nhảy cóc: chặng khoá thì đưa về chặng mở cao nhất */
    if (r.stage > maxUnlocked()) {
      location.replace("#stage-" + maxUnlocked() + "/" + r.skill);
      return;
    }
    renderSwitches(r);
    var stage = STAGES[r.stage - 1];
    root.innerHTML = "";
    var prog = el("p", "practice-progress", esc(progressLine(stage, r.skill)));
    root.appendChild(prog);
    var box = el("div");
    root.appendChild(box);
    RENDERERS[r.skill](stage, box);
    /* cập nhật dòng tiến độ khi có thay đổi trong khu bài tập
       (click cho nút Chấm, change cho checklist/quiz radio) */
    function refreshProgress() {
      setTimeout(function () { prog.textContent = progressLine(stage, r.skill); }, 60);
    }
    box.addEventListener("click", refreshProgress);
    box.addEventListener("change", refreshProgress);
  }

  window.addEventListener("hashchange", route);
  route();
})();
