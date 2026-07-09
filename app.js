/* Lộ trình B2 — renderer.
   Toàn bộ nội dung đến từ window.ROADMAP (roadmap-data.js).
   Tiến độ cột mốc lưu trong localStorage, chỉ trên trình duyệt của người học. */

(function () {
  "use strict";

  var DATA = window.ROADMAP;
  if (!DATA || !DATA.stages || !DATA.stages.length) {
    document.getElementById("stages").innerHTML =
      "<p>Không tải được dữ liệu lộ trình. Hãy kiểm tra file <code>roadmap-data.js</code>.</p>";
    return;
  }

  var STORE_KEY = "b2-roadmap-progress-v1";

  /* ---------- storage (an toàn khi localStorage bị chặn) ---------- */
  function loadProgress() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      /* dữ liệu hỏng/không phải object → coi như chưa có tiến độ */
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(p));
    } catch (e) {
      /* chế độ riêng tư: tiến độ chỉ sống trong phiên này */
    }
  }
  var progress = loadProgress();

  /* ---------- helpers ---------- */
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
  function milestoneId(stage, idx) {
    return stage.id + ":" + idx;
  }
  function stageDone(stage) {
    var total = stage.milestones_vi.length;
    var done = 0;
    stage.milestones_vi.forEach(function (_, i) {
      if (progress[milestoneId(stage, i)]) done++;
    });
    return { done: done, total: total, ratio: total ? done / total : 0 };
  }
  function overallRatio() {
    var sum = 0;
    DATA.stages.forEach(function (s) { sum += stageDone(s).ratio; });
    return sum / DATA.stages.length;
  }

  var SKILL_LABELS = { listening: "Nghe", speaking: "Nói", reading: "Đọc", writing: "Viết" };
  var SKILL_ICONS = {
    listening:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2z"/><path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"/></svg>',
    speaking:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M9 11h.01M13 11h.01M17 11h.01"/></svg>',
    reading:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-1.5-1.6-3.7-2.5-6-2.5H4V19h2c2.3 0 4.5.9 6 2.5 1.5-1.6 3.7-2.5 6-2.5h2V3.5h-2c-2.3 0-4.5.9-6 2.5z"/><path d="M12 6v15.5"/></svg>',
    writing:
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3.5l3.5 3.5L8 19.5 3.5 20.5 4.5 16 17 3.5z"/><path d="M14.5 6l3.5 3.5"/></svg>',
  };
  var KIND_LABELS = {
    app: "App", website: "Web", video: "Video", podcast: "Podcast",
    book: "Sách", course: "Khóa học", tool: "Công cụ",
  };

  /* ---------- hero stats ---------- */
  function renderHeroStats() {
    var wMin = 0, wMax = 0, hours = 0;
    DATA.stages.forEach(function (s) {
      wMin += s.duration_weeks_min;
      wMax += s.duration_weeks_max;
      hours += ((s.duration_weeks_min + s.duration_weeks_max) / 2) * s.hours_per_week;
    });
    hours = Math.round(hours / 10) * 10;
    var stats = [
      { dd: wMin + "–" + wMax + " tuần", dt: "tổng lộ trình" },
      { dd: "~" + hours.toLocaleString("vi-VN") + " giờ", dt: "khối lượng học" },
      { dd: String(DATA.stages.length) + " chặng", dt: "0 → A1 → A2 → B1 → B2" },
    ];
    document.getElementById("hero-stats").innerHTML = stats
      .map(function (s) { return "<div><dt>" + esc(s.dt) + "</dt><dd>" + esc(s.dd) + "</dd></div>"; })
      .join("");
  }

  /* ---------- hero trail map ---------- */
  var trailProgressPath = null;
  var trailLength = 0;
  var trailNodes = [];

  function renderTrail() {
    var svg = document.getElementById("hero-trail");
    var d =
      "M 50 400 C 200 425, 330 395, 330 340 C 330 280, 120 305, 90 248 C 62 195, 300 218, 330 158 C 352 112, 268 62, 178 60";
    var nodes = [
      { x: 50, y: 400, lvl: "0", label: "Xuất phát" },
      { x: 330, y: 340, lvl: "A1", label: "Chặng 1" },
      { x: 90, y: 248, lvl: "A2", label: "Chặng 2" },
      { x: 330, y: 158, lvl: "B1", label: "Chặng 3" },
      { x: 178, y: 60, lvl: "B2", label: "Đích" },
    ];
    var ns = "http://www.w3.org/2000/svg";

    var track = document.createElementNS(ns, "path");
    track.setAttribute("d", d);
    track.setAttribute("class", "trail-track");
    svg.appendChild(track);

    trailProgressPath = document.createElementNS(ns, "path");
    trailProgressPath.setAttribute("d", d);
    trailProgressPath.setAttribute("class", "trail-done");
    svg.appendChild(trailProgressPath);
    trailLength = trailProgressPath.getTotalLength();
    trailProgressPath.setAttribute("stroke-dasharray", String(trailLength));
    trailProgressPath.setAttribute("stroke-dashoffset", String(trailLength));

    var stageColors = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)"];
    nodes.forEach(function (n, i) {
      var g = document.createElementNS(ns, "g");
      g.setAttribute("class", "trail-node");
      var color = i === 0 ? "var(--ink-faint)" : stageColors[i - 1];

      var c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", n.x);
      c.setAttribute("cy", n.y);
      c.setAttribute("r", i === nodes.length - 1 ? 15 : 11);
      c.setAttribute("stroke", color);
      g.appendChild(c);

      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", n.x);
      t.setAttribute("y", n.y + (i % 2 === 0 ? 34 : -22));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("class", "trail-lvl");
      t.textContent = n.lvl;
      g.appendChild(t);

      var sub = document.createElementNS(ns, "text");
      sub.setAttribute("x", n.x);
      sub.setAttribute("y", n.y + (i % 2 === 0 ? 50 : -38));
      sub.setAttribute("text-anchor", "middle");
      sub.textContent = n.label;
      g.appendChild(sub);

      if (i === nodes.length - 1) {
        var flag = document.createElementNS(ns, "text");
        flag.setAttribute("x", n.x + 14);
        flag.setAttribute("y", n.y - 18);
        flag.setAttribute("class", "trail-flag");
        flag.textContent = "⛳";
        g.appendChild(flag);
      }
      svg.appendChild(g);
      trailNodes.push({ circle: c, color: color, stageIndex: i - 1 });
    });
  }

  function updateTrail() {
    if (!trailProgressPath) return;
    var offset = trailLength * (1 - overallRatio());
    trailProgressPath.setAttribute("stroke-dashoffset", String(offset));
    trailNodes.forEach(function (n) {
      /* inline style để thắng rule .trail-node circle trong stylesheet */
      if (n.stageIndex < 0) {
        n.circle.style.fill = "var(--surface)";
        return;
      }
      var st = DATA.stages[n.stageIndex];
      var full = st && stageDone(st).ratio >= 1;
      n.circle.style.fill = full ? n.color : "var(--surface)";
    });
  }

  /* ---------- placement ---------- */
  function renderPlacement() {
    var box = document.getElementById("placement-list");
    DATA.method.placement_guide.forEach(function (p) {
      var row = el("div", "placement-row reveal");
      row.appendChild(el("div", "placement-level",
        esc(p.level) + "<small>" + esc(p.label_vi) + "</small>"));
      row.appendChild(el("ul", "placement-signs",
        p.signs_vi.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("")));
      var btn = el("button", "placement-cta", "Vào giai đoạn " + p.start_stage + " →");
      btn.type = "button";
      btn.addEventListener("click", function () {
        var target = document.getElementById("stage-anchor-" + p.start_stage);
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
      row.appendChild(btn);
      box.appendChild(row);
    });
    renderSavedPlacement();
  }

  /* kết quả bài test đầu vào gần nhất (nếu người học đã làm) */
  function renderSavedPlacement() {
    var box = document.getElementById("placement-saved");
    if (!box) return;
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem("b2-placement-v1") || "null"); } catch (e) { /* ignore */ }
    if (!saved || !saved.date) return;
    var reco = saved.recommendStage
      ? 'gợi ý bắt đầu từ <b>giai đoạn ' + Number(saved.recommendStage) + "</b>"
      : "bạn đã vững đến <b>B2</b> — hãy thi thử để xác nhận";
    box.innerHTML =
      "<span>Bài test đầu vào gần nhất (" + esc(saved.date) + "): trình độ <b>" + esc(saved.level) + "</b>, " + reco + ".</span>" +
      '<a class="btn btn-ghost" href="placement-test.html">Làm lại bài test</a>';
    box.hidden = false;
  }

  /* ---------- method ---------- */
  function renderMethod() {
    var grid = document.getElementById("principles-grid");
    DATA.method.principles_vi.forEach(function (p) {
      grid.appendChild(el("article", "principle reveal",
        '<span class="principle-icon" aria-hidden="true">' + esc(p.icon) + "</span>" +
        "<h3>" + esc(p.title_vi) + "</h3><p>" + esc(p.desc_vi) + "</p>"));
    });
    document.getElementById("habits-list").innerHTML = DATA.method.habits_vi
      .map(function (h) { return "<li>" + esc(h) + "</li>"; })
      .join("");
  }

  /* ---------- stages ---------- */
  var TABS = [
    { key: "overview", label: "Tổng quan" },
    { key: "skills", label: "Kỹ năng" },
    { key: "week", label: "Lịch tuần" },
    { key: "milestones", label: "Cột mốc" },
    { key: "resources", label: "Tài nguyên" },
  ];

  function stageNumber(stage) {
    return DATA.stages.indexOf(stage) + 1;
  }

  function panelOverview(stage) {
    var groups = {};
    stage.can_do.forEach(function (c) {
      (groups[c.skill] = groups[c.skill] || []).push(c.text_vi);
    });
    var candoHtml = Object.keys(SKILL_LABELS)
      .filter(function (k) { return groups[k]; })
      .map(function (k) {
        return '<div class="cando-group"><h4>' + SKILL_ICONS[k] + esc(SKILL_LABELS[k]) + "</h4><ul>" +
          groups[k].map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
          "</ul></div>";
      }).join("");
    return (
      '<p class="panel-label">Mục tiêu giai đoạn</p>' +
      '<ul class="goal-list">' + stage.goals_vi.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul>" +
      '<p class="panel-label">Hoàn thành giai đoạn, bạn có thể…</p>' +
      '<div class="cando-grid">' + candoHtml + "</div>" +
      '<div class="exit-test"><p class="panel-label">Bài kiểm tra ra chặng</p><p>' + esc(stage.exit_test_vi) + "</p>" +
      '<div class="result-actions">' +
      '<a class="btn btn-ghost" href="lessons.html#stage-' + stageNumber(stage) + '">6 bài học của chặng này →</a>' +
      '<a class="btn btn-ghost" href="lessons.html#stage-' + stageNumber(stage) + '/test">Kiểm tra cuối chặng (12 câu) →</a>' +
      "</div></div>"
    );
  }

  function panelSkills(stage) {
    return '<div class="skill-acc">' + stage.skills.map(function (sk, i) {
      return "<details" + (i === 0 ? " open" : "") + "><summary>" +
        '<span class="skill-dot" aria-hidden="true"></span>' + esc(sk.skill_label_vi) +
        "</summary>" +
        '<div class="skill-body"><p class="skill-focus">' + esc(sk.focus_vi) + "</p><ul>" +
        sk.activities_vi.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") +
        "</ul></div></details>";
    }).join("") + "</div>";
  }

  function panelWeek(stage) {
    return (
      '<p class="panel-label">Lịch mẫu một tuần · điều chỉnh theo quỹ thời gian của bạn</p>' +
      '<div class="week-table-wrap"><table class="week-table">' +
      "<thead><tr><th scope=\"col\">Ngày</th><th scope=\"col\">Thời lượng</th><th scope=\"col\">Nội dung</th></tr></thead><tbody>" +
      stage.weekly_plan.map(function (d, i) {
        var isReview = i === stage.weekly_plan.length - 1;
        return "<tr" + (isReview ? ' class="is-review"' : "") + ">" +
          '<td class="week-day">' + esc(d.day_vi) + "</td>" +
          '<td class="week-min">' + d.duration_min + " phút</td>" +
          "<td><ul>" + d.tasks_vi.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></td></tr>";
      }).join("") +
      "</tbody></table></div>"
    );
  }

  function panelMilestones(stage) {
    return (
      '<p class="panel-label">Tick khi đạt được — tiến độ lưu trên trình duyệt này</p>' +
      '<ul class="milestone-list">' +
      stage.milestones_vi.map(function (m, i) {
        var id = milestoneId(stage, i);
        var checked = progress[id] ? " checked" : "";
        return '<li><label class="milestone"><input type="checkbox" data-mid="' + esc(id) + '"' + checked + ">" +
          "<span>" + esc(m) + "</span></label></li>";
      }).join("") +
      "</ul>"
    );
  }

  function panelResources(stage) {
    return (
      '<p class="panel-label">Dùng đúng tài nguyên cho đúng việc — ghi chú bên cạnh</p>' +
      '<ul class="resource-list">' +
      stage.resources.map(function (r) {
        return "<li><div>" +
          '<div class="resource-name"><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.name) + "</a></div>" +
          '<div class="resource-badges"><span class="badge">' + esc(KIND_LABELS[r.kind] || r.kind) + "</span>" +
          (r.free ? '<span class="badge badge-free">Miễn phí</span>' : '<span class="badge">Trả phí</span>') +
          "</div></div>" +
          '<div class="resource-note">' + esc(r.note_vi) + "</div></li>";
      }).join("") +
      "</ul>"
    );
  }

  var PANEL_RENDERERS = {
    overview: panelOverview,
    skills: panelSkills,
    week: panelWeek,
    milestones: panelMilestones,
    resources: panelResources,
  };

  function renderStages() {
    var box = document.getElementById("stages");
    DATA.stages.forEach(function (stage, si) {
      var article = el("article", "stage reveal");
      article.id = "stage-anchor-" + (si + 1);
      article.style.setProperty("--stage-c", "var(--s" + (si + 1) + ")");
      article.style.setProperty("--stage-ink", "var(--s" + (si + 1) + "-ink)");

      article.appendChild(el("div", "stage-marker", String(si + 1)));

      var card = el("div", "stage-card");

      var head = el("header", "stage-head");
      head.innerHTML =
        '<p class="stage-eyebrow">' + esc(stage.stage_label) + " · " + esc(stage.cefr_from) + " → " + esc(stage.cefr_to) + "</p>" +
        "<h3>" + esc(stage.title_vi) + "</h3>" +
        '<p class="stage-tagline">' + esc(stage.tagline_vi) + "</p>" +
        '<div class="stage-meta">' +
        '<span class="chip chip-level">Đích: ' + esc(stage.cefr_to) + "</span>" +
        '<span class="chip">' + stage.duration_weeks_min + "–" + stage.duration_weeks_max + " tuần</span>" +
        '<span class="chip">~' + String(stage.hours_per_week).replace(".", ",") + " giờ/tuần</span>" +
        "</div>" +
        '<div class="stage-progress">' +
        '<div class="stage-progress-bar"><div class="stage-progress-fill" data-fill="' + esc(stage.id) + '"></div></div>' +
        '<span class="stage-progress-num" data-num="' + esc(stage.id) + '">0/0</span>' +
        "</div>";
      card.appendChild(head);

      /* tabs */
      var tablist = el("div", "tabs");
      tablist.setAttribute("role", "tablist");
      tablist.setAttribute("aria-label", "Nội dung " + stage.stage_label);
      var panels = [];
      TABS.forEach(function (t, ti) {
        var tabId = stage.id + "-tab-" + t.key;
        var panelId = stage.id + "-panel-" + t.key;
        var btn = el("button", "tab");
        btn.type = "button";
        btn.id = tabId;
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-controls", panelId);
        btn.setAttribute("aria-selected", ti === 0 ? "true" : "false");
        btn.tabIndex = ti === 0 ? 0 : -1;
        btn.innerHTML = esc(t.label) +
          (t.key === "milestones" ? ' <span class="tab-count" data-count="' + esc(stage.id) + '"></span>' : "");
        tablist.appendChild(btn);

        var panel = el("div", "stage-panel", PANEL_RENDERERS[t.key](stage));
        panel.id = panelId;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tabId);
        panel.tabIndex = 0;
        if (ti !== 0) panel.hidden = true;
        panels.push(panel);
      });
      card.appendChild(tablist);
      panels.forEach(function (p) { card.appendChild(p); });

      /* tab behavior + arrow keys */
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll(".tab"));
      function selectTab(idx) {
        tabs.forEach(function (tb, i) {
          tb.setAttribute("aria-selected", i === idx ? "true" : "false");
          tb.tabIndex = i === idx ? 0 : -1;
          panels[i].hidden = i !== idx;
        });
        tabs[idx].focus({ preventScroll: true });
      }
      tabs.forEach(function (tb, i) {
        tb.addEventListener("click", function () { selectTab(i); });
        tb.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") next = 0;
          if (e.key === "End") next = tabs.length - 1;
          if (next !== null) { e.preventDefault(); selectTab(next); }
        });
      });

      article.appendChild(card);
      box.appendChild(article);
    });

    /* milestone checkboxes (event delegation) */
    box.addEventListener("change", function (e) {
      var input = e.target;
      if (!input.matches || !input.matches("input[data-mid]")) return;
      var id = input.getAttribute("data-mid");
      /* đọc lại store trước khi ghi để không đè mất tick từ tab khác */
      progress = loadProgress();
      if (input.checked) progress[id] = true;
      else delete progress[id];
      saveProgress(progress);
      updateAllProgress();
      if (input.checked && window.FocusTools) FocusTools.recordActivity();
    });
  }

  /* ---------- progress sync ---------- */
  function updateAllProgress() {
    DATA.stages.forEach(function (stage) {
      var s = stageDone(stage);
      var fill = document.querySelector('[data-fill="' + stage.id + '"]');
      var num = document.querySelector('[data-num="' + stage.id + '"]');
      var count = document.querySelector('[data-count="' + stage.id + '"]');
      if (fill) fill.style.width = Math.round(s.ratio * 100) + "%";
      if (num) num.textContent = s.done + "/" + s.total;
      if (count) count.textContent = s.done + "/" + s.total;
    });

    /* chặng hiện tại = chặng đầu tiên chưa xong */
    var currentSet = false;
    DATA.stages.forEach(function (stage, si) {
      var article = document.getElementById("stage-anchor-" + (si + 1));
      if (!article) return;
      var full = stageDone(stage).ratio >= 1;
      var isCurrent = !full && !currentSet;
      if (isCurrent) currentSet = true;
      article.classList.toggle("is-current", isCurrent);
    });

    var ratio = overallRatio();
    var pct = Math.round(ratio * 100);
    document.getElementById("spine-fill").style.height = pct + "%";
    var ring = document.querySelector("#header-progress .ring-fill");
    if (ring) ring.style.setProperty("--p", String(ratio));
    document.getElementById("header-progress-num").textContent = pct + "%";
    document.getElementById("header-progress")
      .setAttribute("aria-label", "Tiến độ toàn lộ trình: " + pct + "%");
    updateTrail();
  }

  /* ---------- benchmarks & FAQ ---------- */
  function renderBenchmarks() {
    document.querySelector("#benchmark-table tbody").innerHTML = DATA.method.b2_benchmarks
      .map(function (b) {
        return '<tr><td class="benchmark-exam">' + esc(b.exam) + "</td>" +
          '<td class="benchmark-score">' + esc(b.score) + "</td>" +
          '<td class="benchmark-note">' + esc(b.note_vi) + "</td></tr>";
      }).join("");
  }

  function renderFaq() {
    var box = document.getElementById("faq-list");
    DATA.method.faq.forEach(function (f) {
      box.appendChild(el("details", "reveal",
        "<summary>" + esc(f.q_vi) + "</summary>" +
        '<div class="faq-answer"><p>' + esc(f.a_vi) + "</p></div>"));
    });
  }

  /* ---------- reveal on scroll ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (n, i) {
      n.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(n);
    });
  }

  /* ---------- reset ---------- */
  document.getElementById("btn-reset-progress").addEventListener("click", function () {
    if (!confirm("Xoá toàn bộ tiến độ đã tick trên trình duyệt này?")) return;
    progress = {};
    saveProgress(progress);
    document.querySelectorAll("input[data-mid]").forEach(function (i) { i.checked = false; });
    updateAllProgress();
  });

  /* ---------- init ---------- */
  renderHeroStats();
  renderTrail();
  renderPlacement();
  renderMethod();
  renderStages();
  renderBenchmarks();
  renderFaq();
  updateAllProgress();
  setupReveal();
})();
