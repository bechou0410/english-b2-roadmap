/* Công cụ tập trung cho người học (thiết kế ưu tiên ADHD):
   - Chuỗi ngày học 🔥: học bất cứ thứ gì mỗi ngày để giữ chuỗi — phần thưởng
     tức thì, nhìn thấy được, không cần ý chí "học nhiều".
   - Timer tập trung kiểu Pomodoro (15/25 phút + nghỉ 5): phiên ngắn có giới hạn
     rõ ràng dễ bắt đầu hơn "học đến khi xong". Có chuông báo, tự gợi ý nghỉ.
   - celebrate(): pháo giấy nhỏ khi hoàn thành — dopamine ngay lập tức.
   Các trang gọi FocusTools.recordActivity() khi người học hoàn thành một việc.
   Trạng thái lưu localStorage; timer sống sót qua reload/điều hướng hash. */

(function () {
  "use strict";

  var STREAK_KEY = "b2-streak-v1";
  var TIMER_KEY = "b2-timer-v1";
  var FOCUS_PRESETS = [15, 25]; /* phút */
  var BREAK_MIN = 5;

  function loadJson(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "null");
      return v && typeof v === "object" && !Array.isArray(v) ? v : null;
    } catch (e) { return null; }
  }
  function saveJson(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ }
  }
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- chuỗi ngày học ---------- */
  function dayKey(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function getDays() {
    var s = loadJson(STREAK_KEY);
    return (s && s.days) || {};
  }
  function currentStreak() {
    var days = getDays();
    var d = new Date();
    var n = 0;
    if (!days[dayKey(d)]) d.setDate(d.getDate() - 1); /* hôm nay chưa học vẫn giữ chuỗi tới hết ngày */
    while (days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function todayDone() {
    return !!getDays()[dayKey(new Date())];
  }

  var streakChip = null;
  function renderStreak() {
    if (!streakChip) return;
    var n = currentStreak();
    streakChip.innerHTML =
      '<span aria-hidden="true">🔥</span> ' + n + ' <span class="streak-note">' +
      (todayDone() ? "· hôm nay ✓" : "ngày") + "</span>";
    streakChip.setAttribute("aria-label",
      "Chuỗi " + n + " ngày học liên tiếp" + (todayDone() ? ", hôm nay đã học" : ", hôm nay chưa học") + " — mở trang thành tích");
    streakChip.title = "Xem bảng thành tích — hoàn thành bất kỳ bài nào mỗi ngày để giữ chuỗi";
  }
  function injectStreakChip() {
    var header = document.querySelector(".header-inner");
    if (!header) return;
    /* chip là LINK tới trang thành tích — thay cho mục menu "Thành tích" */
    streakChip = document.createElement("a");
    streakChip.className = "streak-chip";
    streakChip.href = "progress.html";
    var ring = header.querySelector(".header-progress");
    if (ring) header.insertBefore(streakChip, ring);
    else header.appendChild(streakChip);
    renderStreak();
  }

  /* Đánh dấu "hôm nay có học". Gọi từ mọi hành động hoàn thành trên site. */
  function recordActivity() {
    var s = loadJson(STREAK_KEY) || { days: {} };
    if (!s.days || typeof s.days !== "object") s.days = {};
    var key = dayKey(new Date());
    var firstToday = !s.days[key];
    s.days[key] = true;
    saveJson(STREAK_KEY, s);
    renderStreak();
    if (firstToday) celebrate(); /* lần đầu trong ngày: thưởng ngay */
  }

  /* ---------- pháo giấy ---------- */
  function celebrate(originEl) {
    if (reducedMotion()) return;
    var rect = originEl && originEl.getBoundingClientRect
      ? originEl.getBoundingClientRect()
      : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var colors = ["#c2460f", "#679a58", "#2f6f50", "#175843", "#e9b44c"];
    var box = document.createElement("div");
    box.className = "confetti-box";
    box.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 22; i++) {
      var p = document.createElement("i");
      var ang = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 90;
      p.style.background = colors[i % colors.length];
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", Math.sin(ang) * dist - 40 + "px");
      p.style.setProperty("--rot", Math.random() * 540 - 270 + "deg");
      p.style.animationDelay = Math.random() * 80 + "ms";
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 1200);
  }

  /* ---------- chuông báo (WebAudio, không cần file) ---------- */
  var audioCtx = null;
  /* mở khoá AudioContext trong user gesture mà không phát tiếng */
  function unlockAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch (e) { /* không có audio cũng không sao */ }
  }
  function chime() {
    if (timer.sound === false) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      [0, 0.18].forEach(function (delay, i) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.frequency.value = i === 0 ? 880 : 1320;
        o.type = "sine";
        g.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.5);
        o.connect(g).connect(audioCtx.destination);
        o.start(audioCtx.currentTime + delay);
        o.stop(audioCtx.currentTime + delay + 0.55);
      });
    } catch (e) { /* không có audio cũng không sao */ }
  }

  /* ---------- timer tập trung ----------
     timer.focusMin giữ preset người dùng chọn, không bị phiên nghỉ ghi đè. */
  var timer = { mode: "focus", focusMin: FOCUS_PRESETS[0], endsAt: null, remainingMs: null, sound: true };
  var tickInterval = null;
  var widget, panel, timeEl, stateLabel, toggleBtn, startBtn, statusLive;

  function currentDurationMin() {
    return timer.mode === "break" ? BREAK_MIN : timer.focusMin;
  }
  function timerState() {
    if (timer.endsAt) return "running";
    if (timer.remainingMs != null) return "paused";
    return "idle";
  }
  function persistTimer() { saveJson(TIMER_KEY, timer); }
  function restoreTimer() {
    var t = loadJson(TIMER_KEY);
    if (!t) return;
    timer = {
      mode: t.mode || "focus",
      focusMin: FOCUS_PRESETS.indexOf(t.focusMin) >= 0 ? t.focusMin : FOCUS_PRESETS[0],
      endsAt: t.endsAt || null,
      remainingMs: t.remainingMs != null ? t.remainingMs : null,
      sound: t.sound !== false,
    };
    if (timer.endsAt && timer.endsAt <= Date.now()) {
      /* phiên (kể cả phiên nghỉ) đã kết thúc trong lúc rời trang → về trạng thái sẵn sàng */
      timer.mode = "focus";
      timer.endsAt = null;
      timer.remainingMs = null;
    }
    if (timerState() === "running") startTicking();
  }

  function msLeft() {
    if (timer.endsAt) return Math.max(0, timer.endsAt - Date.now());
    if (timer.remainingMs != null) return timer.remainingMs;
    return currentDurationMin() * 60000;
  }
  function fmt(ms) {
    var s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  function setPanelOpen(open) {
    panel.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", String(open));
  }

  function renderTimer() {
    if (!widget) return;
    var st = timerState();
    widget.dataset.state = st;
    widget.dataset.mode = timer.mode;
    timeEl.textContent = fmt(msLeft());
    stateLabel.textContent =
      timer.mode === "break" ? "Đang nghỉ — rời màn hình đi!" :
      st === "running" ? "Đang tập trung" :
      st === "paused" ? "Tạm dừng" : "Chọn thời lượng rồi bắt đầu";
    startBtn.textContent = st === "running" ? "⏸ Dừng" : "▶ Bắt đầu";
    var icon = timer.mode === "break" ? "☕" : "⏱";
    toggleBtn.innerHTML = st === "running" || st === "paused"
      ? icon + " " + fmt(msLeft())
      : "⏱ <span>Tập trung</span>";
    panel.querySelectorAll(".timer-preset").forEach(function (b) {
      b.setAttribute("aria-pressed", Number(b.dataset.min) === timer.focusMin && timer.mode === "focus" ? "true" : "false");
      /* đổi preset giữa phiên sẽ huỷ phiên im lặng → khoá lại khi đang chạy */
      b.disabled = st === "running";
    });
  }

  function startTicking() {
    clearInterval(tickInterval);
    tickInterval = setInterval(function () {
      if (timerState() !== "running") return;
      if (msLeft() <= 0) onTimerDone();
      renderTimer();
    }, 500);
  }

  function onTimerDone() {
    clearInterval(tickInterval);
    chime();
    celebrate(widget);
    if (timer.mode === "focus") {
      recordActivity(); /* ngồi trọn một phiên cũng tính là có học hôm nay */
      timer.mode = "break";
      timer.endsAt = Date.now() + BREAK_MIN * 60000;
      timer.remainingMs = null;
      statusLive.textContent = "Hết giờ tập trung — bắt đầu nghỉ " + BREAK_MIN + " phút.";
      startTicking();
    } else {
      timer.mode = "focus";
      timer.endsAt = null;
      timer.remainingMs = null;
      statusLive.textContent = "Hết giờ nghỉ — sẵn sàng cho phiên tập trung mới.";
      setPanelOpen(true);
    }
    persistTimer();
    renderTimer();
  }

  function buildTimerWidget() {
    widget = document.createElement("div");
    widget.className = "focus-timer";
    widget.innerHTML =
      '<button class="timer-toggle" type="button" aria-expanded="false">⏱ <span>Tập trung</span></button>' +
      '<div class="timer-panel" hidden>' +
      '<p class="timer-state"></p>' +
      '<p class="timer-time" role="timer"></p>' +
      '<div class="timer-presets">' +
      FOCUS_PRESETS.map(function (m) {
        return '<button class="timer-preset" type="button" data-min="' + m + '">' + m + " phút</button>";
      }).join("") +
      "</div>" +
      '<div class="timer-actions">' +
      '<button class="timer-start" type="button">▶ Bắt đầu</button>' +
      '<button class="timer-reset" type="button" aria-label="Đặt lại">↺</button>' +
      "</div>" +
      '<label class="timer-sound"><input type="checkbox" checked> 🔔 Chuông báo hết giờ</label>' +
      '<p class="timer-hint">Hết giờ tự chuyển nghỉ ' + BREAK_MIN + " phút.</p>" +
      "</div>" +
      '<div class="sr-only" role="status"></div>';
    document.body.appendChild(widget);

    panel = widget.querySelector(".timer-panel");
    timeEl = widget.querySelector(".timer-time");
    stateLabel = widget.querySelector(".timer-state");
    toggleBtn = widget.querySelector(".timer-toggle");
    startBtn = widget.querySelector(".timer-start");
    statusLive = widget.querySelector('[role="status"]');
    var soundCheck = widget.querySelector(".timer-sound input");

    toggleBtn.addEventListener("click", function () {
      setPanelOpen(panel.hidden);
    });
    widget.querySelectorAll(".timer-preset").forEach(function (b) {
      b.addEventListener("click", function () {
        timer.mode = "focus";
        timer.focusMin = Number(b.dataset.min);
        timer.endsAt = null;
        timer.remainingMs = null;
        persistTimer();
        renderTimer();
      });
    });
    startBtn.addEventListener("click", function () {
      var st = timerState();
      if (st === "running") {
        timer.remainingMs = msLeft();
        timer.endsAt = null;
        clearInterval(tickInterval);
      } else {
        timer.endsAt = Date.now() + msLeft();
        timer.remainingMs = null;
        unlockAudio(); /* mở khoá audio trong user gesture, không phát tiếng */
        startTicking();
      }
      persistTimer();
      renderTimer();
    });
    widget.querySelector(".timer-reset").addEventListener("click", function () {
      timer.mode = "focus";
      timer.endsAt = null;
      timer.remainingMs = null;
      clearInterval(tickInterval);
      persistTimer();
      renderTimer();
    });
    soundCheck.addEventListener("change", function () {
      timer.sound = soundCheck.checked;
      persistTimer();
    });

    restoreTimer();
    soundCheck.checked = timer.sound !== false;
    renderTimer();
  }

  /* ---------- thẻ "Hôm nay" (nếu trang có) ---------- */
  function dueFlashcards() {
    var srs = loadJson("b2-srs-v1") || {};
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    var n = 0;
    Object.keys(srs).forEach(function (k) {
      if (srs[k] && srs[k].due <= t.getTime()) n++;
    });
    return n;
  }
  function renderTodayCard() {
    var el = document.getElementById("today-streak");
    if (!el) return;
    var n = currentStreak();
    var msg = todayDone()
      ? "Hôm nay bạn đã học rồi — chuỗi " + n + " ngày. Quay lại là thắng."
      : n > 0
        ? "Chuỗi " + n + " ngày đang chờ — chỉ cần một bài nhỏ hôm nay để giữ lửa."
        : "Không cần nghĩ hôm nay học gì. Bấm nút — 15 phút thôi.";
    var due = dueFlashcards();
    if (due > 0) msg += " Có " + due + " thẻ từ vựng đến hạn ôn.";
    el.textContent = msg;
  }

  /* ---------- nhóm menu thả xuống trên header ---------- */
  function setupNavGroups() {
    var groups = document.querySelectorAll(".nav-group");
    if (!groups.length) return;
    groups.forEach(function (g) {
      var btn = g.querySelector(".nav-group-btn");
      var drop = g.querySelector(".nav-drop");
      if (!btn || !drop) return;
      btn.addEventListener("click", function () {
        var open = drop.hidden;
        /* đóng các nhóm khác trước */
        document.querySelectorAll(".nav-drop").forEach(function (d) { d.hidden = true; });
        document.querySelectorAll(".nav-group-btn").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
        drop.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    function closeAll() {
      document.querySelectorAll(".nav-drop").forEach(function (d) { d.hidden = true; });
      document.querySelectorAll(".nav-group-btn").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }
    /* dùng click (không phải pointerdown): vuốt để cuộn thanh nav trên mobile
       sẽ không đóng nhầm dropdown đang mở */
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".nav-group")) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      /* trả focus về nút nhóm nếu focus đang nằm trong dropdown — không rơi về <body> */
      var openGroup = Array.prototype.find.call(groups, function (g) {
        var d = g.querySelector(".nav-drop");
        return d && !d.hidden;
      });
      if (openGroup && openGroup.contains(document.activeElement)) {
        var b = openGroup.querySelector(".nav-group-btn");
        if (b) b.focus();
      }
      closeAll();
    });
  }

  /* ---------- menu hamburger cho mobile ---------- */
  function setupMobileMenu() {
    var header = document.querySelector(".site-header");
    var nav = document.querySelector(".site-nav");
    if (!header || !nav) return;

    /* nhãn "Học tập" phía trên nhóm link (chỉ hiện trong panel mobile) */
    var group = nav.querySelector(".nav-group");
    if (group && !nav.querySelector(".nav-label-group")) {
      var label = document.createElement("span");
      label.className = "nav-label-group";
      label.textContent = "Học tập";
      group.insertBefore(label, group.firstChild);
    }

    /* nút hamburger đặt cuối header-inner */
    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Mở menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", nav.id || (nav.id = "site-nav"));
    toggle.innerHTML = "<span></span>";
    document.querySelector(".header-inner").appendChild(toggle);

    function setOpen(open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    }
    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });
    /* đóng khi bấm một link / mục tài khoản, bấm ra ngoài, hoặc Escape */
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a, .nav-account")) setOpen(false);
    });
    document.addEventListener("click", function (e) {
      if (header.classList.contains("nav-open") &&
          !e.target.closest(".site-nav") && !e.target.closest(".nav-toggle")) {
        setOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    /* về desktop thì bỏ trạng thái mở để không kẹt */
    var mq = window.matchMedia("(min-width: 681px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () {
      if (mq.matches) setOpen(false);
    });
  }

  injectStreakChip();
  buildTimerWidget();
  renderTodayCard();
  setupNavGroups();
  setupMobileMenu();

  /* chuỗi/thẻ Hôm nay có thể đổi từ tab khác hoặc khi qua ngày mới —
     làm tươi khi tab được nhìn lại hoặc storage thay đổi */
  window.addEventListener("storage", function () {
    renderStreak();
    renderTodayCard();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      renderStreak();
      renderTodayCard();
    }
  });

  window.FocusTools = {
    recordActivity: recordActivity,
    celebrate: celebrate,
    streak: currentStreak,
  };
})();
