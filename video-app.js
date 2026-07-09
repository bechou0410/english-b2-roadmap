/* Công cụ dịch song ngữ từng câu cho trang video luyện nghe.
   Tách đoạn tiếng Anh thành câu → dịch tuần tự qua WordLookup.translate
   (Google gtx, fallback MyMemory — dùng lại module tra từ) → bảng EN|VI
   với nút 🔊 từng câu để shadowing. Mỗi lần dịch xong tính là có học. */

(function () {
  "use strict";

  var MAX_CHARS = 4000;
  var MAX_SENTENCES = 60;

  var input = document.getElementById("transcript-input");
  var status = document.getElementById("translate-status");
  var rootBox = document.getElementById("bilingual-root");
  var btnTranslate = document.getElementById("btn-translate");
  var btnClear = document.getElementById("btn-clear");

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
    u.rate = rate || 0.95;
    speechSynthesis.speak(u);
  }

  /* tách câu: theo .!? giữ dấu; gộp mảnh quá ngắn vào câu trước (viết tắt, số...) */
  function splitSentences(text) {
    var raw = text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) || [];
    var out = [];
    raw.forEach(function (s) {
      s = s.trim();
      if (!s) return;
      if (out.length && (s.length < 12 || /^[a-z]/.test(s))) out[out.length - 1] += " " + s;
      else out.push(s);
    });
    return out.slice(0, MAX_SENTENCES);
  }

  var running = false;
  function translateAll() {
    if (running) return;
    var text = input.value.trim();
    if (!text) { status.textContent = "Dán đoạn tiếng Anh vào ô trên rồi bấm Dịch."; return; }
    if (text.length > MAX_CHARS) {
      status.textContent = "Đoạn quá dài (" + text.length + " ký tự) — tối đa " + MAX_CHARS + ". Hãy chia nhỏ.";
      return;
    }
    if (!window.WordLookup || !WordLookup.translate) {
      status.textContent = "Thiếu module dịch (word-lookup.js).";
      return;
    }
    var sentences = splitSentences(text);
    if (!sentences.length) { status.textContent = "Không tách được câu nào — kiểm tra lại đoạn văn."; return; }

    running = true;
    btnTranslate.disabled = true;
    rootBox.innerHTML = "";
    var table = document.createElement("div");
    table.className = "bilingual-list";
    rootBox.appendChild(table);

    /* dựng khung trước, dịch đổ dần vào — người học đọc được ngay từ câu đầu */
    var rows = sentences.map(function (s, i) {
      var row = document.createElement("div");
      row.className = "bilingual-row";
      row.innerHTML =
        '<button class="chip-btn" type="button" data-say="' + i + '" aria-label="Đọc câu ' + (i + 1) + '">🔊</button>' +
        '<div><p class="bi-en" lang="en">' + esc(s) + "</p>" +
        '<p class="bi-vi">Đang dịch…</p></div>';
      table.appendChild(row);
      return row;
    });

    table.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-say]");
      if (b) tts(sentences[Number(b.getAttribute("data-say"))]);
    });

    var done = 0, failed = 0;
    function next(i) {
      if (i >= sentences.length) {
        running = false;
        btnTranslate.disabled = false;
        status.textContent = "Xong " + done + "/" + sentences.length + " câu" +
          (failed ? " (" + failed + " câu lỗi mạng — bấm Dịch lại nếu cần)" : "") +
          ". Mẹo: bôi đen từ lạ trong cột tiếng Anh để tra và lưu thẻ.";
        if (window.FocusTools && done > 0) FocusTools.recordActivity();
        return;
      }
      status.textContent = "Đang dịch câu " + (i + 1) + "/" + sentences.length + "…";
      WordLookup.translate(sentences[i])
        .then(function (r) {
          done++;
          rows[i].querySelector(".bi-vi").textContent = r.vi;
        })
        .catch(function () {
          failed++;
          rows[i].querySelector(".bi-vi").textContent = "(không dịch được câu này)";
        })
        .then(function () { next(i + 1); });
    }
    next(0);
  }

  btnTranslate.addEventListener("click", translateAll);
  btnClear.addEventListener("click", function () {
    input.value = "";
    rootBox.innerHTML = "";
    status.textContent = "";
  });
})();
