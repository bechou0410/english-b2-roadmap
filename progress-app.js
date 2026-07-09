/* Bảng thành tích: tổng hợp mọi store học tập trên trình duyệt.
   Chỉ ĐỌC dữ liệu — không ghi gì (trừ khi người dùng không có gì thì cũng
   chẳng có gì để ghi). Nguồn: b2-streak-v1, b2-lessons-v1, b2-srs-v1,
   b2-practice-v1, b2-roadmap-progress-v1, b2-placement-v1, b2-ipa-v1. */

(function () {
  "use strict";

  var root = document.getElementById("progress-root");
  var STAGE_TITLES = ["Giai đoạn 1 · 0→A1", "Giai đoạn 2 · A1→A2", "Giai đoạn 3 · A2→B1", "Giai đoạn 4 · B1→B2"];
  var LESSON_PASS = 4, TEST_NEED = 10;

  function loadObj(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function dayKey(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  /* số ngày → chuỗi thời lượng dễ đọc */
  function fmtDuration(days) {
    if (days < 21) return days + " ngày";
    if (days < 70) return Math.round(days / 7) + " tuần";
    if (days < 365) return Math.round(days / 30) + " tháng";
    var y = Math.floor(days / 365), m = Math.round((days % 365) / 30);
    return y + " năm" + (m ? " " + m + " tháng" : "");
  }

  var scores = loadObj("b2-lessons-v1");
  var srs = loadObj("b2-srs-v1");
  var practice = loadObj("b2-practice-v1");
  var milestones = loadObj("b2-roadmap-progress-v1");
  var ipaStore = loadObj("b2-ipa-v1");
  var streakDays = (loadObj("b2-streak-v1").days) || {};
  var placement = null;
  try { placement = JSON.parse(localStorage.getItem("b2-placement-v1") || "null"); } catch (e) { /* ignore */ }

  /* ---------- số liệu tổng ---------- */
  function currentStreak() {
    var d = new Date(), n = 0;
    if (!streakDays[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (streakDays[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function longestStreak() {
    /* quét 400 ngày gần nhất là quá đủ cho v1 */
    var best = 0, run = 0, d = new Date();
    for (var i = 0; i < 400; i++) {
      if (streakDays[dayKey(d)]) { run++; best = Math.max(best, run); }
      else run = 0;
      d.setDate(d.getDate() - 1);
    }
    return best;
  }
  var totalDays = Object.keys(streakDays).length;

  var srsCounts = { learning: 0, mastered: 0 };
  Object.keys(srs).forEach(function (k) {
    if (srs[k] && srs[k].box >= 4) srsCounts.mastered++;
    else srsCounts.learning++;
  });

  var lessonsDone = 0, lessonsTotal = 0, testsPassed = 0;
  if (window.LESSONS) {
    window.LESSONS.forEach(function (s) {
      lessonsTotal += s.lessons.length;
      s.lessons.forEach(function (l) {
        var sc = scores[l.id];
        if (sc && Number(sc.best) >= LESSON_PASS) lessonsDone++;
      });
      var t = scores["test:" + s.stage_id];
      if (t && Number(t.best) >= TEST_NEED) testsPassed++;
    });
  }

  var milestonesDone = Object.keys(milestones).length;
  var milestonesTotal = window.ROADMAP
    ? window.ROADMAP.stages.reduce(function (a, s) { return a + s.milestones_vi.length; }, 0)
    : 0;

  var practiceDone = Object.keys(practice).filter(function (k) {
    /* kỷ lục game (blitz/order/match) không phải bài luyện — loại khỏi bộ đếm */
    if (/^(blitz|order|match):/.test(k)) return false;
    var v = practice[k];
    if (!v || typeof v !== "object") return false;
    return Number(v.best) >= 80 || v.done || (k.indexOf("read:") === 0 && Number(v.best) >= 3) || v.self;
  }).length;

  /* ---------- render ---------- */
  root.innerHTML = "";

  /* thẻ số liệu lớn */
  var stats = el("div", "panel-card");
  stats.innerHTML =
    '<div class="flash-stats achievement-stats">' +
    "<div><b>🔥 " + currentStreak() + "</b><span>chuỗi hiện tại</span></div>" +
    "<div><b>" + longestStreak() + "</b><span>chuỗi dài nhất</span></div>" +
    "<div><b>" + totalDays + "</b><span>tổng ngày đã học</span></div>" +
    "<div><b>" + srsCounts.mastered + "</b><span>từ đã thuộc</span></div>" +
    "<div><b>" + srsCounts.learning + "</b><span>từ đang học</span></div>" +
    "<div><b>" + lessonsDone + "/" + lessonsTotal + "</b><span>bài học đạt ≥4/5</span></div>" +
    "<div><b>" + testsPassed + "/4</b><span>bài test chặng đạt</span></div>" +
    "<div><b>" + practiceDone + "</b><span>bài luyện đã đạt</span></div>" +
    "</div>";
  root.appendChild(stats);

  /* ---------- bộ đếm: bắt đầu học từ khi nào + ước lượng tới B2 ---------- */
  var started = loadObj("b2-started-v1");
  var journey = el("div", "panel-card journey-card");
  journey.style.marginTop = "1.2rem";
  if (started && started.ts) {
    var startDate = new Date(Number(started.ts));
    var daysSince = Math.max(1, Math.floor((Date.now() - Number(started.ts)) / 86400000) + 1);
    /* mức hoàn thành tổng thể = 60% bài học + 40% test chặng */
    var completion = lessonsTotal
      ? (lessonsDone / lessonsTotal) * 0.6 + (testsPassed / 4) * 0.4
      : 0;
    var pct = Math.round(completion * 100);
    /* ước lượng: theo NHỊP thực (số ngày đã học), chiếu tới 100% */
    var estText;
    if (completion >= 1) {
      estText = "Bạn đã hoàn thành phần lộ trình trên web — giờ là lúc luyện đề B2 thật. 🎉";
    } else if (completion > 0.02 && totalDays >= 3) {
      var perActiveDay = completion / totalDays;           // tiến độ mỗi ngày CÓ học
      var activeDaysLeft = Math.ceil((1 - completion) / perActiveDay);
      /* quy ra ngày lịch theo tần suất học hiện tại (ngày học / ngày trôi qua) */
      var freq = Math.min(1, totalDays / daysSince);
      var calDaysLeft = Math.ceil(activeDaysLeft / Math.max(freq, 0.15));
      estText = "Theo nhịp hiện tại, dự kiến đạt B2 sau khoảng <b>" + fmtDuration(calDaysLeft) +
        "</b> nữa. Học đều hơn thì tới đích nhanh hơn.";
    } else {
      estText = "Theo lộ trình chuẩn (học đều 9–12 giờ/tuần): khoảng <b>58–74 tuần</b>. Cứ giữ chuỗi mỗi ngày.";
    }
    journey.innerHTML =
      '<p class="panel-label">Hành trình của bạn</p>' +
      "<p>Bắt đầu học từ <b>" + startDate.toLocaleDateString("vi-VN") + "</b> — đã <b>" + daysSince +
      " ngày</b> (học thật <b>" + totalDays + " ngày</b>).</p>" +
      '<div class="stage-progress" style="margin:0.8rem 0;">' +
      '<div class="stage-progress-bar"><div class="stage-progress-fill" style="width:' + pct + '%;background:var(--s4);"></div></div>' +
      '<span class="stage-progress-num">' + pct + "%</span></div>" +
      '<p class="exercise-hint" style="font-size:0.95rem;">' + estText + "</p>";
  } else {
    journey.innerHTML =
      '<p class="panel-label">Hành trình của bạn</p>' +
      '<p class="exercise-hint">Bạn chưa bắt đầu. Hoàn thành bài học đầu tiên để bắt đầu đếm ngày và ước lượng thời gian đạt B2. ' +
      '<a href="lessons.html#next">Học ngay bài đầu tiên →</a></p>';
  }
  root.appendChild(journey);

  /* lịch hoạt động 12 tuần (kiểu GitHub) */
  var heat = el("div", "panel-card");
  heat.style.marginTop = "1.2rem";
  var weeks = 12;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  /* thứ 2 của tuần hiện tại theo ISO (Chủ nhật getDay()=0 thuộc về tuần TRƯỚC đó) */
  var start = new Date(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (weeks - 1) * 7);
  var cells = "";
  for (var w = 0; w < weeks; w++) {
    cells += '<div class="heat-col">';
    for (var dow = 0; dow < 7; dow++) {
      var d = new Date(start);
      d.setDate(start.getDate() + w * 7 + dow);
      if (d > today) { cells += '<span class="heat-cell is-future"></span>'; continue; }
      var on = !!streakDays[dayKey(d)];
      cells += '<span class="heat-cell' + (on ? " is-on" : "") + '" title="' +
        d.getDate() + "/" + (d.getMonth() + 1) + (on ? " — có học" : " — nghỉ") + '"></span>';
    }
    cells += "</div>";
  }
  heat.innerHTML =
    '<p class="panel-label">Lịch học 12 tuần gần nhất · mỗi cột là một tuần (T2 → CN)</p>' +
    '<div class="heat-grid">' + cells + "</div>";
  root.appendChild(heat);

  /* tiến độ từng chặng */
  var stagesBox = el("div", "panel-card");
  stagesBox.style.marginTop = "1.2rem";
  var rows = "";
  if (window.LESSONS && window.ROADMAP) {
    window.LESSONS.forEach(function (s, i) {
      var ld = 0;
      s.lessons.forEach(function (l) {
        var sc = scores[l.id];
        if (sc && Number(sc.best) >= LESSON_PASS) ld++;
      });
      var t = scores["test:" + s.stage_id];
      var testBest = t ? Number(t.best) : null;
      var mTotal = window.ROADMAP.stages[i].milestones_vi.length;
      var mDone = Object.keys(milestones).filter(function (k) { return k.indexOf(s.stage_id + ":") === 0; }).length;
      var unlocked = window.Progression ? Progression.isUnlocked(i + 1) : true;
      var completed = window.Progression ? Progression.stageCompleted(i) : false;
      var pct = Math.round(((ld / s.lessons.length) * 0.6 + (testBest != null && testBest >= TEST_NEED ? 0.4 : 0)) * 100);
      rows +=
        '<div class="stage-progress-row' + (unlocked ? "" : " is-locked") + '" style="--stage-c: var(--s' + (i + 1) + '); --stage-ink: var(--s' + (i + 1) + '-ink);">' +
        '<div class="spr-head"><b>' + (unlocked ? "" : "🔒 ") + esc(STAGE_TITLES[i]) + "</b>" +
        (completed ? '<span class="badge badge-free">Hoàn thành</span>' : "") + "</div>" +
        '<div class="stage-progress"><div class="stage-progress-bar"><div class="stage-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="stage-progress-num">' + pct + "%</span></div>" +
        '<p class="exercise-hint">Bài học đạt: ' + ld + "/" + s.lessons.length +
        " · Test chặng: " + (testBest != null ? testBest + "/12" + (testBest >= TEST_NEED ? " ✓" : " (cần 10)") : "chưa làm") +
        " · Cột mốc lộ trình: " + mDone + "/" + mTotal + "</p>" +
        "</div>";
    });
  }
  stagesBox.innerHTML = '<p class="panel-label">Tiến độ từng chặng · 60% bài học + 40% bài test</p>' + rows;
  root.appendChild(stagesBox);

  /* kỷ lục trò chơi + cặp âm */
  var games = el("div", "panel-card");
  games.style.marginTop = "1.2rem";
  var gameRows = "";
  if (window.LESSONS) {
    window.LESSONS.forEach(function (s, i) {
      var b = practice["blitz:" + s.stage_id];
      var o = practice["order:" + s.stage_id];
      var m = practice["match:" + s.stage_id];
      if (!b && !o && !m) return;
      gameRows += "<tr><td>" + esc(STAGE_TITLES[i]) + "</td>" +
        '<td class="benchmark-score">' + (b ? Number(b.best) + " điểm" : "—") + "</td>" +
        '<td class="benchmark-score">' + (o ? Number(o.best) + "/8" : "—") + "</td>" +
        '<td class="benchmark-score">' + (m && isFinite(Number(m.timeMs)) ? (Number(m.timeMs) / 1000).toFixed(1) + "s · " + Number(m.mistakes) + " lỗi" : "—") + "</td></tr>";
    });
  }
  var pairRows = Object.keys(ipaStore)
    .filter(function (k) { return k.indexOf("pair:") === 0 && ipaStore[k] && typeof ipaStore[k] === "object"; })
    .map(function (k) {
      return '<span class="chip">' + esc(k.replace("pair:", "")) + " · " + (Number(ipaStore[k].best) || 0) + "/10</span>";
    }).join(" ");
  games.innerHTML =
    '<p class="panel-label">Kỷ lục trò chơi</p>' +
    (gameRows
      ? '<div class="benchmark-table-wrap" style="box-shadow:none;"><table class="benchmark-table"><thead><tr><th>Chặng</th><th>⚡ Blitz</th><th>🧩 Xếp câu</th><th>🃏 Nối từ</th></tr></thead><tbody>' + gameRows + "</tbody></table></div>"
      : '<p class="exercise-hint">Chưa có kỷ lục nào — vào <a href="practice.html">Luyện kỹ năng</a> chơi ván đầu tiên đi!</p>') +
    (pairRows ? '<p class="panel-label" style="margin-top:1rem;">Luyện tai cặp âm</p><div class="stage-meta">' + pairRows + "</div>" : "");
  root.appendChild(games);

  /* điểm test đầu vào */
  if (placement && placement.byLevel) {
    var pl = el("div", "panel-card");
    pl.style.marginTop = "1.2rem";
    pl.innerHTML =
      '<p class="panel-label">Kiểm tra đầu vào gần nhất · ' + esc(placement.date || "") + "</p>" +
      "<p>Trình độ ước lượng: <b>" + esc(placement.level || "?") + "</b>" +
      (placement.recommendStage ? " — điểm xuất phát: giai đoạn " + Number(placement.recommendStage) : " — đã vững đến B2") + ".</p>" +
      '<div class="band-bars">' +
      ["A1", "A2", "B1", "B2"].map(function (l) {
        var b = placement.byLevel[l] || {};
        /* ép số — dữ liệu store có thể hỏng, không chèn thẳng vào HTML */
        var correct = Number(b.correct) || 0;
        var total = Number(b.total) || 6;
        var pct = Math.max(0, Math.min(100, total ? Math.round((correct / total) * 100) : 0));
        return '<div class="band-row"><span class="band-label">' + l + "</span>" +
          '<div class="band-track"><div class="band-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="band-score">' + correct + "/" + total + "</span></div>";
      }).join("") + "</div>";
    root.appendChild(pl);
  }
})();
