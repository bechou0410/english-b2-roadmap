/* Khoá chặng tuần tự — chống nhảy cóc.
   Chặng k mở khi: k <= điểm xuất phát (từ bài kiểm tra đầu vào, b2-placement-v1)
   HOẶC mọi chặng từ điểm xuất phát tới k-1 đã HOÀN THÀNH THẬT:
   - cả 6 bài học đạt >= 4/5 ở phần luyện tập, VÀ
   - bài kiểm tra cuối chặng đạt >= 80% (10/12).
   Cần window.LESSONS để biết danh sách bài; trang nào không nạp lessons-data
   thì coi như mở hết (chỉ trang học tập mới khoá). */

(function () {
  "use strict";

  var LESSON_PASS = 4;    /* điểm luyện tập tối thiểu của một bài học (trên 5) */
  var TEST_SIZE = 12;
  var TEST_PASS_PCT = 80;

  function loadObj(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }

  var FLOOR_KEY = "b2-progression-floor-v1";

  /* Sàn mở khoá bền vững: (1) di trú một lần cho người dùng CŨ — chặng cao nhất
     đã có điểm trước khi cơ chế khoá ra đời vẫn được mở; (2) không tụt xuống
     khi thi lại placement bị điểm thấp hơn. */
  function readFloor() {
    try {
      var f = localStorage.getItem(FLOOR_KEY);
      if (f != null) {
        var n = Number(f);
        return n >= 1 && n <= 4 ? n : 1;
      }
      /* di trú: quét điểm bài học/test sẵn có */
      var scores = loadObj("b2-lessons-v1");
      var floor = 1;
      if (window.LESSONS) {
        window.LESSONS.forEach(function (s, i) {
          var has = scores["test:" + s.stage_id] ||
            s.lessons.some(function (l) { return scores[l.id]; });
          if (has) floor = i + 1;
        });
      }
      localStorage.setItem(FLOOR_KEY, String(floor));
      return floor;
    } catch (e) { return 1; }
  }

  function placementBase() {
    var p = 1;
    try {
      var saved = JSON.parse(localStorage.getItem("b2-placement-v1") || "null");
      if (saved) {
        if (saved.recommendStage == null) p = 4; /* vững đến B2 → mở hết */
        else {
          var n = Number(saved.recommendStage);
          p = n >= 1 && n <= 4 ? n : 1;
        }
      }
    } catch (e) { /* ignore */ }
    var floor = readFloor();
    var base = Math.max(p, floor);
    if (base > floor) {
      try { localStorage.setItem(FLOOR_KEY, String(base)); } catch (e) { /* private mode */ }
    }
    return base;
  }

  function stageCompleted(si) {
    /* si: 0-based; cần LESSONS */
    if (!window.LESSONS || !window.LESSONS[si]) return false;
    var scores = loadObj("b2-lessons-v1");
    var stage = window.LESSONS[si];
    var lessonsOk = stage.lessons.every(function (l) {
      var s = scores[l.id];
      return s && Number(s.best) >= LESSON_PASS;
    });
    var passNeed = Math.ceil((TEST_PASS_PCT / 100) * TEST_SIZE);
    var t = scores["test:" + stage.stage_id];
    return lessonsOk && t && Number(t.best) >= passNeed;
  }

  /* chặng mở cao nhất (1-4): đi từ điểm xuất phát, mỗi chặng hoàn thành mở
     thêm chặng kế. Các chặng THẤP HƠN luôn mở để ôn lại. */
  function unlockedStage() {
    if (!window.LESSONS) return 4; /* trang không có dữ liệu bài học: không khoá */
    var n = placementBase();
    while (n < 4 && stageCompleted(n - 1)) n++;
    return n;
  }

  function isUnlocked(stageNumber) {
    return stageNumber <= unlockedStage();
  }

  /* điều kiện còn thiếu của chặng si (0-based) — để hiện lời nhắc */
  function requirements(si) {
    var scores = loadObj("b2-lessons-v1");
    if (!window.LESSONS || !window.LESSONS[si]) return null;
    var stage = window.LESSONS[si];
    var lessonsDone = stage.lessons.filter(function (l) {
      var s = scores[l.id];
      return s && Number(s.best) >= LESSON_PASS;
    }).length;
    var passNeed = Math.ceil((TEST_PASS_PCT / 100) * TEST_SIZE);
    var t = scores["test:" + stage.stage_id];
    return {
      lessonsDone: lessonsDone,
      lessonsTotal: stage.lessons.length,
      testPassed: !!(t && Number(t.best) >= passNeed),
      lessonPass: LESSON_PASS,
    };
  }

  function lockHint(stageNumber) {
    var req = requirements(stageNumber - 2); /* chặng cần hoàn thành là chặng liền trước */
    if (!req) return "Hoàn thành chặng trước để mở khoá.";
    var parts = [];
    if (req.lessonsDone < req.lessonsTotal) {
      parts.push((req.lessonsTotal - req.lessonsDone) + " bài học chặng " + (stageNumber - 1) + " chưa đạt " + req.lessonPass + "/5");
    }
    if (!req.testPassed) parts.push("bài kiểm tra chặng " + (stageNumber - 1) + " chưa đạt 80%");
    return parts.length
      ? "🔒 Còn thiếu: " + parts.join(" và ") + ". Làm bài kiểm tra đầu vào nếu bạn muốn đặt điểm xuất phát cao hơn."
      : "Hoàn thành chặng trước để mở khoá.";
  }

  window.Progression = {
    unlockedStage: unlockedStage,
    isUnlocked: isUnlocked,
    stageCompleted: stageCompleted,
    requirements: requirements,
    lockHint: lockHint,
    placementBase: placementBase,
  };
})();
