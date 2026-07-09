/* Bài kiểm tra đầu vào: 24 câu (6 câu mỗi mức A1-B2) chạy dạng stepper,
   chấm theo band để gợi ý giai đoạn xuất phát. Kết quả lưu localStorage. */

(function () {
  "use strict";

  var DATA = window.PLACEMENT;
  var root = document.getElementById("test-root");
  if (!DATA || !DATA.questions || !DATA.questions.length) {
    root.innerHTML = "<p>Không tải được dữ liệu bài kiểm tra. Hãy kiểm tra file <code>placement-data.js</code>.</p>";
    return;
  }

  var STORE_KEY = "b2-placement-v1";
  var LEVELS = ["A1", "A2", "B1", "B2"];
  var PASS_PER_BAND = 4; /* đúng >=4/6 câu của band coi như vững mức đó */
  var PER_BAND = 6;      /* mỗi lượt thi rút 6 câu/mức từ ngân hàng đề */

  /* đề của lượt thi hiện tại: rút ngẫu nhiên từ ngân hàng, giữ thứ tự mức
     dễ → khó, xáo vị trí đáp án — làm lại là gặp đề khác */
  var sessionQuestions = [];
  function buildExam() {
    sessionQuestions = [];
    LEVELS.forEach(function (level) {
      var pool = DATA.questions.filter(function (q) { return q.level === level; });
      sessionQuestions = sessionQuestions.concat(
        QuizEngine.shuffleOptions(QuizEngine.sample(pool, PER_BAND))
      );
    });
    return sessionQuestions;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function save(result) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(result)); } catch (e) { /* private mode */ }
  }

  document.getElementById("test-intro").textContent = DATA.intro_vi;

  /* Trả về { byLevel: {A1:{correct,total}...}, recommendStage, label } */
  function grade(answers) {
    var byLevel = {};
    LEVELS.forEach(function (l) { byLevel[l] = { correct: 0, total: 0 }; });
    sessionQuestions.forEach(function (q, i) {
      byLevel[q.level].total++;
      if (answers[i] === q.answer) byLevel[q.level].correct++;
    });
    var recommendStage = null;
    for (var i = 0; i < LEVELS.length; i++) {
      if (byLevel[LEVELS[i]].correct < PASS_PER_BAND) { recommendStage = i + 1; break; }
    }
    return { byLevel: byLevel, recommendStage: recommendStage };
  }

  var STAGE_NAMES = {
    1: "Giai đoạn 1 — Xây nền tảng (mất gốc → A1)",
    2: "Giai đoạn 2 — Giao tiếp cơ bản (A1 → A2)",
    3: "Giai đoạn 3 — Độc lập hóa (A2 → B1)",
    4: "Giai đoạn 4 — Chinh phục B2 (B1 → B2)",
  };
  /* mức cao nhất mà người học còn vững, dùng cho tiêu đề kết quả */
  function estimateLevel(r) {
    if (r.recommendStage === null) return "B2";
    if (r.recommendStage === 1) return "Mới bắt đầu";
    return LEVELS[r.recommendStage - 2];
  }

  function renderIntro() {
    var card = document.createElement("div");
    card.className = "panel-card";
    card.innerHTML =
      "<h2>Trước khi bắt đầu</h2>" +
      '<ul class="goal-list">' +
      "<li>24 câu trắc nghiệm: ngữ pháp, từ vựng và đọc hiểu, xếp từ dễ đến khó — khoảng " + esc(DATA.duration_min) + " phút.</li>" +
      "<li>Làm một mình, không tra từ điển, không đoán bừa: câu nào không biết cứ chọn theo cảm nhận đầu tiên rồi đi tiếp.</li>" +
      "<li>Mỗi lượt làm là một đề khác nhau (rút ngẫu nhiên từ ngân hàng câu hỏi) — làm lại bao nhiêu lần cũng không bị \"nhớ tủ\".</li>" +
      "<li>Kết quả chỉ lưu trên trình duyệt của bạn và có thể làm lại bất cứ lúc nào.</li>" +
      "</ul>" +
      '<div class="result-actions"><button class="btn btn-primary" id="btn-start" type="button">Bắt đầu làm bài</button></div>';
    root.innerHTML = "";
    root.appendChild(card);
    document.getElementById("btn-start").addEventListener("click", startTest);
  }

  function startTest() {
    root.innerHTML = "";
    var box = document.createElement("div");
    box.className = "panel-card";
    root.appendChild(box);
    QuizEngine.renderStepper(box, buildExam(), {
      onComplete: function (res) { showResult(res.answers); },
    });
  }

  function showResult(answers) {
    var r = grade(answers);
    var level = estimateLevel(r);
    var correctTotal = LEVELS.reduce(function (a, l) { return a + r.byLevel[l].correct; }, 0);

    save({
      date: new Date().toLocaleDateString("vi-VN"),
      byLevel: r.byLevel,
      recommendStage: r.recommendStage,
      level: level,
    });

    var bandHtml = LEVELS.map(function (l) {
      var b = r.byLevel[l];
      var pct = b.total ? Math.round((b.correct / b.total) * 100) : 0;
      return '<div class="band-row"><span class="band-label">' + l + "</span>" +
        '<div class="band-track"><div class="band-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="band-score">' + b.correct + "/" + b.total + "</span></div>";
    }).join("");

    var recoHtml;
    if (r.recommendStage === null) {
      recoHtml =
        "<p><b>Bạn đã vững nền tảng đến B2.</b></p>" +
        "<p>Bài test ngắn không thay được kỳ thi thật — hãy làm một đề B2 First hoặc IELTS đầy đủ để xác nhận, và dùng Giai đoạn 4 của lộ trình để mài giũa kỹ năng viết luận và nói học thuật.</p>";
    } else {
      recoHtml =
        "<p><b>Điểm xuất phát phù hợp: " + esc(STAGE_NAMES[r.recommendStage]) + ".</b></p>" +
        "<p>Đây là mức đầu tiên bạn chưa vững (đúng dưới " + PASS_PER_BAND + "/6 câu của band này). Bắt đầu thấp hơn một chút luôn tốt hơn bắt đầu quá cao.</p>";
    }

    root.innerHTML = "";
    var card = document.createElement("div");
    card.className = "panel-card";
    card.innerHTML =
      '<p class="eyebrow">Kết quả</p>' +
      '<p class="result-level">' + esc(level) + "</p>" +
      "<p>Bạn trả lời đúng <b>" + correctTotal + "/" + sessionQuestions.length + "</b> câu. Kết quả theo từng mức:</p>" +
      '<div class="band-bars">' + bandHtml + "</div>" +
      '<div class="result-reco">' + recoHtml + "</div>" +
      '<div class="result-actions">' +
      (r.recommendStage !== null
        ? '<a class="btn btn-primary" href="index.html#stage-anchor-' + r.recommendStage + '">Vào giai đoạn ' + r.recommendStage + " →</a>"
        : '<a class="btn btn-primary" href="index.html#stage-anchor-4">Vào giai đoạn 4 →</a>') +
      '<button class="btn btn-ghost" id="btn-review" type="button">Xem lại đáp án</button>' +
      '<button class="btn btn-ghost" id="btn-retake" type="button">Làm lại bài test</button>' +
      "</div>" +
      '<div id="review-root" style="margin-top:1.8rem;"></div>';
    card.setAttribute("tabindex", "-1");
    root.appendChild(card);
    card.focus({ preventScroll: true }); /* đưa screen reader/bàn phím vào phần kết quả */
    if (window.FocusTools) FocusTools.recordActivity(); /* làm bài test cũng tính là có học */

    document.getElementById("btn-retake").addEventListener("click", startTest);
    document.getElementById("btn-review").addEventListener("click", function () {
      var rv = document.getElementById("review-root");
      if (rv.childNodes.length) { rv.innerHTML = ""; return; }
      QuizEngine.renderReview(rv, sessionQuestions, answers);
    });
    window.scrollTo(0, 0);
  }

  renderIntro();
})();
