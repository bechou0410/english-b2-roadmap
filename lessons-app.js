/* Trang bài học: 4 chặng × (6 bài học + 1 bài kiểm tra cuối chặng).
   Điều hướng bằng hash (#stage-2, #stage-2/lesson-xxx, #stage-2/test)
   để có thể chia sẻ link và dùng nút Back. Điểm lưu localStorage. */

(function () {
  "use strict";

  var STAGES = window.LESSONS;
  var root = document.getElementById("lessons-root");
  if (!STAGES || !STAGES.length) {
    root.innerHTML = "<p>Không tải được dữ liệu bài học. Hãy kiểm tra file <code>lessons-data.js</code>.</p>";
    return;
  }

  var STORE_KEY = "b2-lessons-v1";
  var TEST_SIZE = 12; /* mỗi lần thi rút ngẫu nhiên 12 câu từ ngân hàng đề của chặng */
  var STAGE_TITLES = ["Giai đoạn 1 · 0 → A1", "Giai đoạn 2 · A1 → A2", "Giai đoạn 3 · A2 → B1", "Giai đoạn 4 · B1 → B2"];

  function loadScores() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      /* dữ liệu hỏng/không phải object → coi như chưa có điểm */
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function saveScores(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
  }
  var scores = loadScores();

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
  function recordScore(key, correct, total) {
    /* đọc lại store trước khi ghi để không đè mất điểm tab khác vừa lưu */
    scores = loadScores();
    var prev = scores[key];
    if (!prev || correct > Number(prev.best)) scores[key] = { best: correct, total: total };
    saveScores(scores);
    if (window.FocusTools) FocusTools.recordActivity(); /* giữ chuỗi ngày học */
  }
  function scoreLabel(sc) {
    return "tốt nhất " + (Number(sc.best) || 0) + "/" + (Number(sc.total) || 0);
  }

  /* ---------- hash routing ---------- */
  function parseHash() {
    var m = location.hash.replace(/^#/, "").split("/");
    var si = parseInt((m[0] || "").replace("stage-", ""), 10);
    if (!(si >= 1 && si <= STAGES.length)) si = 1;
    return { stage: si, sub: m[1] || null };
  }
  function nav(hash) { location.hash = hash; }

  /* ---------- stage switcher ---------- */
  var switchBox = document.getElementById("stage-switch");
  function maxUnlocked() {
    return window.Progression ? Progression.unlockedStage() : STAGES.length;
  }
  function renderSwitch(active) {
    /* chỉ tạo nút một lần; các lần sau cập nhật aria-pressed/khoá tại chỗ
       để nút đang giữ focus không bị thay thế */
    if (!switchBox.childNodes.length) {
      STAGES.forEach(function (s, i) {
        var b = el("button", null, "");
        b.type = "button";
        b.style.setProperty("--sw-c", "var(--s" + (i + 1) + ")");
        b.style.setProperty("--sw-ink", "var(--s" + (i + 1) + "-ink)");
        b.addEventListener("click", function () { nav("stage-" + (i + 1)); });
        switchBox.appendChild(b);
      });
    }
    var unlocked = maxUnlocked();
    Array.prototype.forEach.call(switchBox.children, function (b, i) {
      var locked = i + 1 > unlocked;
      b.setAttribute("aria-pressed", i + 1 === active ? "true" : "false");
      b.disabled = locked;
      b.innerHTML = (locked ? "🔒 " : "") + esc(STAGE_TITLES[i]);
      b.title = locked && window.Progression ? Progression.lockHint(i + 1) : "";
    });
  }

  /* ---------- danh sách bài học của một chặng ---------- */
  function renderStageList(si) {
    var stage = STAGES[si - 1];
    root.innerHTML = "";
    var wrap = el("div", null);
    wrap.style.setProperty("--sw-c", "var(--s" + si + ")");
    wrap.style.setProperty("--sw-ink", "var(--s" + si + "-ink)");

    var list = el("div", "lesson-list");
    stage.lessons.forEach(function (lesson, li) {
      var sc = scores[lesson.id];
      /* dùng <a> thay vì <button>: mở tab mới / copy link hoạt động đúng với hash router */
      var row = el("a", "lesson-row" + (sc ? " is-done" : ""));
      row.href = "#stage-" + si + "/" + lesson.id;
      row.innerHTML =
        '<span class="lesson-row-num">' + (sc ? "✓" : li + 1) + "</span>" +
        '<span><span class="lesson-row-title">' + esc(lesson.title_vi) + "</span>" +
        '<span class="lesson-row-sub">' + esc(lesson.objective_vi) + "</span></span>" +
        '<span class="lesson-row-score">' + (sc ? scoreLabel(sc) : "~" + Number(lesson.minutes) + " phút") + "</span>";
      list.appendChild(row);
    });

    /* hàng bài kiểm tra cuối chặng */
    var tKey = "test:" + stage.stage_id;
    var tSc = scores[tKey];
    var passNeed = Math.ceil((stage.stage_test.pass_pct / 100) * TEST_SIZE);
    var passed = tSc && Number(tSc.best) >= passNeed;
    var testRow = el("a", "lesson-row is-test" + (passed ? " is-done" : ""));
    testRow.href = "#stage-" + si + "/test";
    testRow.innerHTML =
      '<span class="lesson-row-num">' + (passed ? "✓" : "★") + "</span>" +
      '<span><span class="lesson-row-title">Bài kiểm tra cuối chặng</span>' +
      '<span class="lesson-row-sub">Mỗi lần thi rút ngẫu nhiên ' + TEST_SIZE + " câu từ ngân hàng " + stage.stage_test.questions.length + " câu — đạt từ " + stage.stage_test.pass_pct + "% (" + passNeed + "/" + TEST_SIZE + ") là sẵn sàng sang chặng tiếp theo.</span></span>" +
      '<span class="lesson-row-score">' + (tSc ? "tốt nhất " + (Number(tSc.best) || 0) + "/12" + (passed ? " · đạt" : "") : "12 câu") + "</span>";
    list.appendChild(testRow);

    wrap.appendChild(list);
    root.appendChild(wrap);
  }

  /* ---------- một bài học ---------- */
  function renderLesson(si, lesson) {
    root.innerHTML = "";
    var wrap = el("article", "lesson-article");
    wrap.style.setProperty("--stage-c", "var(--s" + si + ")");
    wrap.style.setProperty("--stage-ink", "var(--s" + si + "-ink)");

    var back = el("a", "btn btn-ghost lesson-back", "← Danh sách bài học");
    back.href = "#stage-" + si;
    wrap.appendChild(back);

    wrap.appendChild(el("p", "eyebrow", esc(STAGE_TITLES[si - 1]) + " · ~" + lesson.minutes + " phút"));
    wrap.appendChild(el("h1", null, esc(lesson.title_vi)));
    wrap.appendChild(el("p", "lesson-objective", esc(lesson.objective_vi)));

    lesson.theory.forEach(function (t) {
      var block = el("section", "theory-block");
      block.appendChild(el("h3", null, esc(t.heading_vi)));
      block.appendChild(el("p", "body", esc(t.body_vi)));
      var ex = el("ul", "example-list");
      t.examples.forEach(function (e) {
        ex.appendChild(el("li", null,
          '<span class="example-en">' + esc(e.en) + "</span>" +
          '<span class="example-vi">' + esc(e.vi) + "</span>"));
      });
      block.appendChild(ex);
      wrap.appendChild(block);
    });

    var head = el("div", "practice-head");
    head.appendChild(el("h2", null, "Luyện tập nhanh"));
    head.appendChild(el("p", "section-lede", "5 câu áp dụng đúng nội dung vừa học — gồm trắc nghiệm và <b>dịch câu Việt → Anh</b> (tự gõ, máy chấm ngay). Sai cũng không sao — phần giải thích mới là thứ đáng đọc nhất."));
    wrap.appendChild(head);

    var quizBox = el("div");
    wrap.appendChild(quizBox);
    var after = el("div");
    wrap.appendChild(after);

    /* xáo vị trí đáp án để lần làm lại không nhớ tủ theo vị trí */
    QuizEngine.renderList(quizBox, QuizEngine.shuffleOptions(lesson.practice), {
      submitLabel: "Chấm điểm",
      onComplete: function (res) {
        recordScore(lesson.id, res.correct, res.total);
        var good = res.correct >= 4;
        after.innerHTML =
          '<div class="score-banner ' + (good ? "pass" : "fail") + '" role="status" tabindex="-1"><b>' + res.correct + "/" + res.total + " câu đúng.</b> " +
          (good
            ? "Bạn nắm được bài này rồi — sang bài tiếp theo thôi."
            : "Đọc lại phần giải thích ở các câu sai rồi làm lại; nắm chắc bài này trước khi đi tiếp.") +
          "</div>" +
          '<div class="result-actions">' +
          '<a class="btn btn-ghost" href="#stage-' + si + '">← Danh sách bài học</a>' +
          nextLessonLink(si, lesson) +
          "</div>";
        after.querySelector(".score-banner").focus({ preventScroll: true });
        after.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest" });
        if (good && window.FocusTools) FocusTools.celebrate(after);
      },
    });

    root.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  function nextLessonLink(si, lesson) {
    var stage = STAGES[si - 1];
    var idx = stage.lessons.indexOf(lesson);
    if (idx < stage.lessons.length - 1) {
      return '<a class="btn btn-primary" href="#stage-' + si + "/" + esc(stage.lessons[idx + 1].id) + '">Bài tiếp theo →</a>';
    }
    return '<a class="btn btn-primary" href="#stage-' + si + '/test">Làm bài kiểm tra cuối chặng →</a>';
  }

  /* ---------- bài kiểm tra cuối chặng ---------- */
  function renderStageTest(si) {
    var stage = STAGES[si - 1];
    var test = stage.stage_test;
    /* chống nhớ tủ: mỗi lượt thi rút ngẫu nhiên từ ngân hàng đề + xáo vị trí đáp án */
    var questions = QuizEngine.shuffleOptions(QuizEngine.sample(test.questions, TEST_SIZE));
    var passNeed = Math.ceil((test.pass_pct / 100) * questions.length);
    root.innerHTML = "";
    var wrap = el("article", "lesson-article");
    wrap.style.setProperty("--stage-c", "var(--s" + si + ")");
    wrap.style.setProperty("--stage-ink", "var(--s" + si + "-ink)");

    var back = el("a", "btn btn-ghost lesson-back", "← Danh sách bài học");
    back.href = "#stage-" + si;
    wrap.appendChild(back);
    wrap.appendChild(el("p", "eyebrow", esc(STAGE_TITLES[si - 1]) + " · bài kiểm tra cuối chặng"));
    wrap.appendChild(el("h1", null, "Kiểm tra cuối chặng " + si));
    wrap.appendChild(el("p", "lesson-objective", esc(test.intro_vi) + " Đề rút ngẫu nhiên " + questions.length + " câu từ ngân hàng " + test.questions.length + " câu — đạt từ " + passNeed + "/" + questions.length + " là bạn sẵn sàng cho chặng tiếp theo."));

    var quizBox = el("div");
    wrap.appendChild(quizBox);
    var after = el("div");
    wrap.appendChild(after);

    QuizEngine.renderList(quizBox, questions, {
      submitLabel: "Nộp bài",
      onComplete: function (res) {
        recordScore("test:" + stage.stage_id, res.correct, res.total);
        var passed = res.correct >= passNeed;
        var nextStage = si < STAGES.length ? si + 1 : null;
        after.innerHTML =
          '<div class="score-banner ' + (passed ? "pass" : "fail") + '" role="status" tabindex="-1"><b>' + res.correct + "/" + res.total + " câu đúng" +
          (passed ? " — đạt." : " — chưa đạt (" + passNeed + "/" + res.total + ").") + "</b> " +
          (passed
            ? (nextStage
              ? "Chúc mừng, bạn đã sẵn sàng cho chặng " + nextStage + "."
              : "Bạn đã hoàn thành phần bài học của lộ trình — giờ là lúc luyện đề B2 First/IELTS thật.")
            : "Xem lại các câu sai bên trên, học lại bài tương ứng rồi quay lại — bài kiểm tra làm lại bao nhiêu lần cũng được.") +
          "</div>" +
          '<div class="result-actions">' +
          '<a class="btn btn-ghost" href="#stage-' + si + '">← Danh sách bài học</a>' +
          (passed && nextStage ? '<a class="btn btn-primary" href="#stage-' + nextStage + '">Sang chặng ' + nextStage + " →</a>" : "") +
          '<button class="btn btn-ghost" id="btn-retry-test" type="button">Làm lại</button>' +
          "</div>";
        var retry = document.getElementById("btn-retry-test");
        if (retry) retry.addEventListener("click", function () { renderStageTest(si); });
        after.querySelector(".score-banner").focus({ preventScroll: true });
        after.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest" });
        renderSwitch(si); /* đậu test có thể vừa mở khoá chặng mới — gỡ 🔒 ngay */
        if (passed && window.FocusTools) FocusTools.celebrate(after);
      },
    });

    root.appendChild(wrap);
    window.scrollTo(0, 0);
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- "học ngay": tìm bài kế tiếp chưa xong (chống tê liệt lựa chọn) ---------- */
  function computeNext() {
    scores = loadScores();
    /* bắt đầu từ điểm xuất phát placement — không bắt người B1 học lại chặng 1.
       Tiêu chí "xong" phải TRÙNG với điều kiện mở khoá (progression.js):
       bài học best >= 4/5, test chặng >= 80% của 12 câu MỖI LƯỢT (không phải
       cả ngân hàng đề) — lệch tiêu chí làm nút Học ngay kẹt hoặc bỏ sót bài dở. */
    var from = window.Progression ? Progression.placementBase() - 1 : 0;
    var limit = maxUnlocked();
    for (var si = from; si < STAGES.length && si < limit; si++) {
      var stage = STAGES[si];
      for (var li = 0; li < stage.lessons.length; li++) {
        var sc = scores[stage.lessons[li].id];
        if (!sc || Number(sc.best) < 4) return "stage-" + (si + 1) + "/" + stage.lessons[li].id;
      }
      var passNeed = Math.ceil((stage.stage_test.pass_pct / 100) * TEST_SIZE);
      var tSc = scores["test:" + stage.stage_id];
      if (!tSc || Number(tSc.best) < passNeed) return "stage-" + (si + 1) + "/test";
    }
    return "stage-" + limit; /* mọi thứ trong vùng mở đã đạt: về danh sách chặng mở cao nhất */
  }

  /* ---------- router ---------- */
  function route() {
    if (location.hash.replace(/^#/, "") === "next") {
      location.replace("#" + computeNext());
      return; /* hashchange sẽ gọi route() lần nữa với đích thật */
    }
    var r = parseHash();
    /* chống nhảy cóc: chặng khoá thì đưa về chặng mở cao nhất */
    if (r.stage > maxUnlocked()) {
      location.replace("#stage-" + maxUnlocked());
      return;
    }
    renderSwitch(r.stage);
    if (r.sub === "test") {
      renderStageTest(r.stage);
    } else if (r.sub) {
      var stage = STAGES[r.stage - 1];
      var lesson = stage.lessons.find(function (l) { return l.id === r.sub; });
      if (lesson) renderLesson(r.stage, lesson);
      else renderStageList(r.stage);
    } else {
      renderStageList(r.stage);
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();
