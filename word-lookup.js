/* Tra từ nhanh: bôi đen từ/cụm tiếng Anh bất kỳ trên trang → nút "Dịch" →
   popup nghĩa tiếng Việt + phiên âm IPA + phát âm (audio từ điển hoặc TTS).

   Nguồn dữ liệu (đều miễn phí, gọi thẳng từ trình duyệt):
   - Dịch EN→VI: Google Translate endpoint công khai (client=gtx),
     dự phòng MyMemory API khi lỗi/bị chặn.
   - IPA + audio (chỉ với 1 từ): dictionaryapi.dev.
   - Phát âm dự phòng: Web Speech API (speechSynthesis), có nút đọc chậm.
   Kết quả cache vào localStorage (LRU) để đỡ gọi lại. */

(function () {
  "use strict";

  var MAX_LEN = 120;          /* chỉ dịch selection tới 120 ký tự */
  var CACHE_KEY = "b2-dict-cache-v1";
  var CACHE_MAX = 200;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function normText(s) {
    return String(s).replace(/[’‘]/g, "'").trim().replace(/\s+/g, " ");
  }
  /* selection có dấu tiếng Việt → là câu tiếng Việt, không cần dịch */
  function looksVietnamese(s) {
    return /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s);
  }
  function isTranslatable(s) {
    return s.length > 0 && s.length <= MAX_LEN && /[a-z]/i.test(s) && !looksVietnamese(s);
  }
  function isSingleWord(s) {
    return /^[a-z][a-z'-]*$/i.test(s); /* text đã normText nên nháy cong đã thành ' */
  }

  /* ---------- cache (LRU đơn giản: ts cập nhật cả khi đọc) ---------- */
  function loadCache() {
    try {
      var v = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function saveCache(c) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch (e) { /* private mode */ }
  }
  function cacheGet(key) {
    var c = loadCache();
    var hit = c[key];
    if (!hit || typeof hit !== "object") return null; /* entry hỏng → coi như miss */
    hit.ts = Date.now();
    saveCache(c);
    return hit;
  }
  function cachePut(key, entry) {
    var c = loadCache();
    entry.ts = Date.now();
    c[key] = entry;
    var keys = Object.keys(c);
    if (keys.length > CACHE_MAX) {
      keys.sort(function (a, b) { return (c[a].ts || 0) - (c[b].ts || 0); })
        .slice(0, keys.length - CACHE_MAX)
        .forEach(function (k) { delete c[k]; });
    }
    saveCache(c);
  }

  /* ---------- dịch ---------- */
  function translate(text) {
    /* thử Google gtx trước (chất lượng tốt hơn), lỗi thì sang MyMemory */
    return fetch(
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" +
      encodeURIComponent(text)
    )
      .then(function (r) { if (!r.ok) throw new Error("gtx " + r.status); return r.json(); })
      .then(function (d) {
        var t = (d && d[0] ? d[0] : []).map(function (x) { return x && x[0]; }).filter(Boolean).join("");
        if (!t) throw new Error("gtx empty");
        return { vi: t, src: "Google Dịch" };
      })
      .catch(function () {
        return fetch(
          "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|vi"
        )
          .then(function (r) { if (!r.ok) throw new Error("mymemory " + r.status); return r.json(); })
          .then(function (d) {
            var t = d && d.responseStatus === 200 && d.responseData && d.responseData.translatedText;
            if (!t) throw new Error("mymemory empty");
            return { vi: t, src: "MyMemory" };
          });
      });
  }

  /* IPA + audio cho MỘT từ; trả null nếu không có (không phải lỗi) */
  function fetchIpa(word) {
    return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word.toLowerCase()))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var e = d && d[0];
        if (!e) return null;
        var phonetics = e.phonetics || [];
        var ipa = e.phonetic || phonetics.map(function (p) { return p.text; }).filter(Boolean)[0] || null;
        var audio = phonetics.map(function (p) { return p.audio; }).filter(Boolean)[0] || null;
        return ipa || audio ? { ipa: ipa, audio: audio } : null;
      })
      .catch(function () { return null; });
  }

  /* ---------- phát âm ---------- */
  var voice = null;
  function pickVoice() {
    var vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    voice =
      vs.find(function (v) { return v.lang === "en-US" && /google/i.test(v.name); }) ||
      vs.find(function (v) { return v.lang === "en-US"; }) ||
      vs.find(function (v) { return v.lang && v.lang.indexOf("en") === 0; }) ||
      null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    /* addEventListener thay vì gán on* — không đè handler của module khác cùng trang */
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
  }

  var currentAudio = null;
  var currentUtterance = null;
  var playingRate = null; /* rate đang phát, để phân biệt "dừng" và "đổi tốc độ" */
  function stopPlayback() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    playingRate = null;
  }
  function speak(text, rate, audioUrl) {
    var isPlaying = currentAudio || (window.speechSynthesis && speechSynthesis.speaking);
    var sameRate = playingRate === rate;
    stopPlayback();
    if (isPlaying && sameRate) return; /* bấm lại cùng nút = dừng */

    playingRate = rate;
    if (audioUrl && rate >= 1) {
      /* audio từ điển (người thật) cho tốc độ thường */
      var a = new Audio(audioUrl);
      currentAudio = a;
      a.addEventListener("ended", function () {
        if (currentAudio === a) { currentAudio = null; playingRate = null; }
      });
      a.play().catch(function () {
        /* pause() của lượt phát sau làm promise này reject — chỉ fallback TTS
           khi audio này vẫn là audio hiện hành (lỗi tải thật) */
        if (currentAudio !== a) return;
        currentAudio = null;
        speakTts(text, rate);
      });
      return;
    }
    speakTts(text, rate);
  }
  function speakTts(text, rate) {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = rate;
    currentUtterance = u;
    u.onend = function () {
      /* cancel() cũng bắn onend — chỉ xoá state nếu utterance này còn hiện hành */
      if (currentUtterance === u) { playingRate = null; currentUtterance = null; }
    };
    speechSynthesis.speak(u);
  }

  /* ---------- UI ---------- */
  var btn = document.createElement("button");
  btn.className = "lookup-btn";
  btn.type = "button";
  btn.hidden = true;
  btn.innerHTML = "🔎 Dịch";
  document.body.appendChild(btn);

  var pop = document.createElement("div");
  pop.className = "lookup-pop";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-label", "Tra từ");
  pop.tabIndex = -1;
  pop.hidden = true;
  document.body.appendChild(pop);

  var currentText = "";
  var currentContext = null; /* câu chứa từ đang tra — làm example_en cho thẻ lưu */
  var returnFocusEl = null;  /* trả focus về đoạn văn vừa tra khi đóng */
  var openedAt = 0;

  /* tìm câu (<=140 ký tự) chứa cụm được bôi đen trong phần tử chứa nó */
  function sentenceAround(node, term) {
    if (!node || !node.textContent) return null;
    var full = normText(node.textContent);
    if (looksVietnamese(full)) return null; /* chỉ lấy ngữ cảnh tiếng Anh */
    var sentences = full.match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) || [];
    var low = term.toLowerCase();
    var hit = sentences.find(function (s) { return s.toLowerCase().indexOf(low) >= 0; });
    if (!hit) return null;
    hit = hit.trim();
    return hit.length > 3 && hit.length <= 140 && hit.toLowerCase() !== low ? hit : null;
  }

  function hideBtn() { btn.hidden = true; }
  function hidePop() {
    if (pop.hidden) return;
    var hadFocus = pop.contains(document.activeElement);
    pop.hidden = true;
    stopPlayback();
    if (hadFocus && returnFocusEl && document.contains(returnFocusEl)) {
      if (!returnFocusEl.hasAttribute("tabindex")) {
        returnFocusEl.setAttribute("tabindex", "-1");
        /* dọn tabindex tạm sau khi người dùng rời khỏi phần tử */
        returnFocusEl.addEventListener("blur", function () {
          this.removeAttribute("tabindex");
        }, { once: true });
      }
      returnFocusEl.focus({ preventScroll: true });
    }
    returnFocusEl = null;
  }

  /* anchor: toạ độ TRANG, chốt một lần lúc mở — cuộn trang sau đó không làm popup trôi */
  function makeAnchor(rect) {
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
    };
  }
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var GAP = coarsePointer ? 16 : 8; /* né selection handle trên mobile */

  function placeAt(el, anchor) {
    el.hidden = false;
    el.style.visibility = "hidden";
    el.style.left = "0px";
    el.style.top = "0px";
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var x = anchor.left + anchor.width / 2 - w / 2;
    x = Math.max(8 + window.scrollX, Math.min(x, window.scrollX + document.documentElement.clientWidth - w - 8));
    var y = anchor.bottom + GAP;
    /* không đủ chỗ bên dưới viewport → lật lên trên selection */
    var viewportBottom = window.scrollY + window.innerHeight;
    if (y + h > viewportBottom && anchor.top - h - GAP >= window.scrollY + 8) {
      y = anchor.top - h - GAP;
    }
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.visibility = "";
  }

  /* cấu trúc popup dựng MỘT LẦN mỗi lượt mở; kết quả async chỉ cập nhật
     vùng body (aria-live) — không phá focus, screen reader đọc được kết quả */
  var popBody = null, popIpa = null, popSrc = null, popState = null;
  function buildPop(text) {
    pop.innerHTML =
      '<div class="lookup-head"><b class="lookup-term" lang="en">' + esc(text) + "</b>" +
      '<button class="lookup-close" type="button" aria-label="Đóng">×</button></div>' +
      '<p class="lookup-ipa" hidden></p>' +
      '<div class="lookup-actions">' +
      '<button class="lookup-say" type="button" data-rate="1">🔊 Phát âm</button>' +
      '<button class="lookup-say" type="button" data-rate="0.6">🐢 Chậm</button>' +
      '<button class="lookup-say lookup-save" type="button" hidden>➕ Thẻ</button>' +
      "</div>" +
      '<div class="lookup-body" aria-live="polite"><p class="lookup-vi lookup-loading">Đang dịch…</p></div>' +
      '<p class="lookup-src" hidden></p>';
    popBody = pop.querySelector(".lookup-body");
    popIpa = pop.querySelector(".lookup-ipa");
    popSrc = pop.querySelector(".lookup-src");
    popState = { text: text, audio: null };

    pop.querySelector(".lookup-close").addEventListener("click", function () {
      /* ghost click trên touch có thể rơi trúng nút × ngay khi popup vừa mở */
      if (Date.now() - openedAt < 400) return;
      hidePop();
    });
    pop.querySelectorAll(".lookup-say[data-rate]").forEach(function (b) {
      b.addEventListener("click", function () {
        speak(popState.text, Number(b.dataset.rate), popState.audio);
      });
    });
  }

  /* Lưu từ đang tra vào bộ flashcard tuỳ chỉnh (trang flashcards.html sẽ xếp
     lịch ôn). Khoá b2-flashcards-custom-v1 là hợp đồng chung giữa 2 module. */
  function saveToFlashcards(entry) {
    var list;
    try {
      list = JSON.parse(localStorage.getItem("b2-flashcards-custom-v1") || "[]");
      if (!Array.isArray(list)) list = [];
    } catch (e) { list = []; }
    var exists = list.some(function (c) {
      return String(c.en).toLowerCase() === entry.en.toLowerCase();
    });
    if (!exists) list.push(entry);
    try { localStorage.setItem("b2-flashcards-custom-v1", JSON.stringify(list)); } catch (e) { /* private mode */ }
    return !exists;
  }

  function openPopover(rect) {
    hideBtn();
    var text = currentText;
    var anchor = makeAnchor(rect);
    openedAt = Date.now();
    buildPop(text);
    placeAt(pop, anchor);
    pop.focus({ preventScroll: true });

    var render = function (result, ipa) {
      if (ipa && ipa.ipa) { popIpa.textContent = ipa.ipa; popIpa.hidden = false; }
      if (ipa && ipa.audio) popState.audio = ipa.audio;
      if (!result) {
        popBody.innerHTML = '<p class="lookup-vi lookup-error">Không dịch được — kiểm tra kết nối mạng rồi thử lại.</p>';
      } else {
        popBody.innerHTML = '<p class="lookup-vi">' + esc(result.vi) + "</p>";
        popSrc.textContent = result.src + (popState.audio ? " · audio từ điển" : "");
        popSrc.hidden = false;
        /* có nghĩa rồi mới lưu thẻ được; giới hạn độ dài cho vừa mặt thẻ.
           Dùng hidden làm cờ "đã gắn listener" — render() có thể chạy 2 lần
           khi hai lượt fetch của cùng một từ cùng resolve */
        var saveBtn = pop.querySelector(".lookup-save");
        if (text.length <= 40 && saveBtn.hidden) {
          saveBtn.hidden = false;
          saveBtn.addEventListener("click", function () {
            saveToFlashcards({
              en: text,
              vi: result.vi,
              ipa: (ipa && ipa.ipa) || null,
              /* chính câu đang đọc làm ví dụ — nhớ theo ngữ cảnh tốt hơn nghĩa trần */
              example_en: currentContext || "",
              addedAt: Date.now(),
            });
            saveBtn.textContent = "✓ Đã lưu vào flashcard";
            saveBtn.disabled = true;
          }, { once: true });
        }
      }
      placeAt(pop, anchor);
    };

    var cached = cacheGet(text.toLowerCase());
    if (cached) {
      render({ vi: cached.vi, src: cached.src }, { ipa: cached.ipa, audio: cached.audio });
      return;
    }

    Promise.all([
      translate(text).catch(function () { return null; }),
      isSingleWord(text) ? fetchIpa(text) : Promise.resolve(null),
    ]).then(function (res) {
      var tr = res[0], ipa = res[1];
      /* cache kể cả khi popup đã đóng — lần tra sau khỏi gọi lại mạng */
      if (tr) {
        cachePut(text.toLowerCase(), { vi: tr.vi, src: tr.src, ipa: ipa && ipa.ipa, audio: ipa && ipa.audio });
      }
      if (pop.hidden || popState.text !== text) return;
      render(tr, ipa);
    });
  }

  /* ---------- theo dõi bôi đen ---------- */
  var debounceTimer = null;
  function readSelection() {
    var sel = document.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    var node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
    if (node && (pop.contains(node) || node.closest("input, textarea"))) return null;
    var range = sel.getRangeAt(0); /* nhiều đoạn (Cmd+kéo): chỉ dùng đoạn đầu, khớp với vị trí nút */
    var text = normText(range.toString());
    if (!isTranslatable(text)) return null;
    var rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) return null;
    return { text: text, rect: rect, node: node };
  }

  document.addEventListener("selectionchange", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var s = readSelection();
      if (!s) { hideBtn(); return; }
      currentText = s.text;
      currentContext = sentenceAround(s.node, s.text);
      returnFocusEl = s.node;
      placeAt(btn, makeAnchor(s.rect));
    }, 250);
  });

  function activateFromButton() {
    /* đọc lại selection TƯƠI: người dùng có thể vừa đổi selection trước khi debounce chạy */
    var s = readSelection();
    var rect;
    if (s) {
      currentText = s.text;
      currentContext = sentenceAround(s.node, s.text);
      returnFocusEl = s.node;
      rect = s.rect;
    } else {
      rect = btn.getBoundingClientRect();
    }
    if (!currentText) return;
    openPopover(rect);
  }

  /* pointerdown giữ selection cho chuột/chạm; click phục vụ bàn phím (Enter/Space).
     Chống mở đôi: click đến ngay sau pointerdown thì bỏ qua. */
  btn.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    activateFromButton();
  });
  btn.addEventListener("click", function () {
    if (Date.now() - openedAt < 400) return;
    activateFromButton();
  });

  document.addEventListener("pointerdown", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && e.target !== btn) hidePop();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { hidePop(); hideBtn(); }
  });
  /* đổi trang hash (bài học/luyện tập): nội dung dưới popup đã thay — đóng lại */
  window.addEventListener("hashchange", function () { hidePop(); hideBtn(); });

  /* cho phép trang khác/console gọi trực tiếp, và để test được */
  window.WordLookup = { translate: translate, fetchIpa: fetchIpa, isTranslatable: isTranslatable };
})();
