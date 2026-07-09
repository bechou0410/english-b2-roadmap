/* Sao lưu & đồng bộ tiến trình học.
   - Sao lưu/khôi phục bằng FILE JSON: luôn dùng được, không cần tài khoản.
   - Đăng ký/đăng nhập + đồng bộ đa thiết bị qua Supabase: bật khi sync-config.js
     có supabaseUrl + supabaseKey.
   Hợp nhất dữ liệu theo TỪNG KHO với quy tắc riêng (không ghi đè mất tiến độ):
   điểm lấy cao nhất, thẻ SRS lấy hộp cao hơn, chuỗi ngày & cột mốc hợp nhất...
*/
(function () {
  "use strict";

  var CFG = window.B2_SYNC || {};

  /* CHỐT CHẶN: khoá phải là "anon" (JWT claim role). Nếu ai đó lỡ dán khoá
     "service_role" (toàn quyền, bỏ qua RLS) vào file công khai → CHẶN, không
     khởi tạo client, cảnh báo — biến sai lầm thảm hoạ thành lỗi bắt được. */
  function keyRole(jwt) {
    try {
      var p = String(jwt).split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      p += "===".slice((p.length + 3) % 4);
      return JSON.parse(atob(p)).role;
    } catch (e) { return null; }
  }
  var CONFIGURED = !!(CFG.supabaseUrl && CFG.supabaseKey);
  var CLOUD = CONFIGURED;
  if (CONFIGURED) {
    var k = String(CFG.supabaseKey);
    /* chặn khoá bí mật ở cả 2 định dạng: JWT role=service_role, và định dạng
       mới sb_secret_... (đều toàn quyền, bỏ qua RLS — không được để ở client) */
    if (keyRole(k) === "service_role" || /^sb_secret_/.test(k)) {
      CLOUD = false;
      console.error("[B2Sync] Khoá trong sync-config.js là khoá BÍ MẬT (service_role / sb_secret) — TUYỆT ĐỐI KHÔNG dùng ở client. Đã chặn. Hãy thay bằng khoá anon public / sb_publishable.");
      window.__B2_KEY_DANGER = true;
    }
  }
  var META_KEY = "b2-sync-meta-v1";
  /* các kho KHÔNG đồng bộ: cache dịch (nặng, tái tạo được) + timer (tạm thời) */
  var SKIP = { "b2-dict-cache-v1": 1, "b2-timer-v1": 1, "b2-sync-meta-v1": 1 };

  function isSyncKey(k) { return k && k.indexOf("b2-") === 0 && !SKIP[k]; }

  /* ---------- gom & ghi localStorage ---------- */
  function parse(v) { try { return JSON.parse(v); } catch (e) { return v; } }
  function collectLocal() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (isSyncKey(k)) out[k] = parse(localStorage.getItem(k));
    }
    return out;
  }
  function writeStore(k, val) {
    try {
      localStorage.setItem(k, typeof val === "object" && val !== null ? JSON.stringify(val) : String(val));
    } catch (e) { /* quota/private */ }
  }
  function applyStores(map) {
    Object.keys(map).forEach(function (k) { if (isSyncKey(k)) writeStore(k, map[k]); });
  }

  /* ---------- hợp nhất theo từng kho ---------- */
  function num(x) { return Number(x) || 0; }
  function unionKeys(a, b) {
    var s = {}, out = [];
    [a, b].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { if (!s[k]) { s[k] = 1; out.push(k); } }); });
    return out;
  }
  function mergeBoolMap(a, b) { return Object.assign({}, a || {}, b || {}); }
  function mergeStreak(a, b) {
    return { days: Object.assign({}, (a && a.days) || {}, (b && b.days) || {}) };
  }
  function mergeBestMap(a, b) {
    a = a || {}; b = b || {}; var out = {};
    unionKeys(a, b).forEach(function (k) {
      var x = a[k], y = b[k];
      if (!x) out[k] = y; else if (!y) out[k] = x;
      else out[k] = num(y.best) > num(x.best) ? y : x;
    });
    return out;
  }
  function mergeSrs(a, b) {
    a = a || {}; b = b || {}; var out = {};
    unionKeys(a, b).forEach(function (k) {
      var x = a[k], y = b[k];
      if (!x) { out[k] = y; return; } if (!y) { out[k] = x; return; }
      var xb = num(x.box), yb = num(y.box);
      out[k] = yb > xb || (yb === xb && num(y.due) > num(x.due)) ? y : x;
    });
    return out;
  }
  function mergeCustomCards(a, b) {
    var seen = {}, out = [];
    [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : []).forEach(function (c) {
      var id = String(c && c.en || "").toLowerCase();
      if (id && !seen[id]) { seen[id] = 1; out.push(c); }
    });
    return out;
  }
  /* record của b2-practice-v1: best→max, mistakes/timeMs→min, bool→OR, chuỗi→dài hơn, mảng→OR theo vị trí */
  function mergeRecord(x, y) {
    if (x == null) return y; if (y == null) return x;
    if (typeof x !== "object" || typeof y !== "object") {
      if (typeof x === "number" && typeof y === "number") return Math.max(x, y);
      if (typeof x === "boolean" || typeof y === "boolean") return !!x || !!y;
      if (typeof x === "string" && typeof y === "string") return x.length >= y.length ? x : y;
      return y;
    }
    if (Array.isArray(x) || Array.isArray(y)) {
      var xa = Array.isArray(x) ? x : [], ya = Array.isArray(y) ? y : [], n = Math.max(xa.length, ya.length), r = [];
      for (var i = 0; i < n; i++) r[i] = mergeRecord(xa[i], ya[i]);
      return r;
    }
    var o = {};
    unionKeys(x, y).forEach(function (f) {
      var xv = x[f], yv = y[f];
      if (f === "mistakes" || f === "timeMs") o[f] = Math.min(num(xv == null ? Infinity : xv), num(yv == null ? Infinity : yv));
      else o[f] = mergeRecord(xv, yv);
    });
    return o;
  }
  function mergePractice(a, b) {
    a = a || {}; b = b || {}; var out = {};
    unionKeys(a, b).forEach(function (k) { out[k] = mergeRecord(a[k], b[k]); });
    return out;
  }
  function mergeByTs(a, b) {
    if (!a) return b; if (!b) return a;
    /* mới hơn thắng; hoà (kể cả cả hai thiếu ts, =0) thì GIỮ LOCAL — nhất quán
       với các merger khác và tránh âm thầm nuốt kết quả tại chỗ bằng bản remote */
    return num(b.ts) > num(a.ts) ? b : a;
  }
  function mergeMaxNum(a, b) { return Math.max(num(a), num(b)); }

  var MERGERS = {
    "b2-streak-v1": mergeStreak,
    "b2-roadmap-progress-v1": mergeBoolMap,
    "b2-lessons-v1": mergeBestMap,
    "b2-ipa-v1": mergeBestMap,
    "b2-srs-v1": mergeSrs,
    "b2-flashcards-custom-v1": mergeCustomCards,
    "b2-practice-v1": mergePractice,
    "b2-placement-v1": mergeByTs,
    "b2-progression-floor-v1": mergeMaxNum,
    "b2-flash-stage": mergeMaxNum,
  };
  function mergeStores(local, remote) {
    local = local || {}; remote = remote || {}; var out = {};
    unionKeys(local, remote).filter(isSyncKey).forEach(function (k) {
      var m = MERGERS[k];
      if (m) out[k] = m(local[k], remote[k]);
      else out[k] = local[k] != null ? local[k] : remote[k]; /* kho lạ: giữ local nếu có */
    });
    return out;
  }
  /* stringify chuẩn hoá: sắp khoá để so sánh KHÔNG phụ thuộc thứ tự khoá
     (merged dựng theo thứ tự chèn local, remote về theo thứ tự khác → tránh
     coi là "đã đổi" rồi push thừa / reload giả) */
  function stable(v) {
    if (v === null || typeof v !== "object") return v;
    if (Array.isArray(v)) return v.map(stable);
    var o = {};
    Object.keys(v).sort().forEach(function (k) { o[k] = stable(v[k]); });
    return o;
  }
  function sameJson(a, b) { return JSON.stringify(stable(a)) === JSON.stringify(stable(b)); }

  /* ---------- sao lưu / khôi phục file ---------- */
  function exportFile() {
    var blob = new Blob([JSON.stringify({ app: "lo-trinh-b2", exportedAt: new Date().toISOString(), stores: collectLocal() }, null, 2)],
      { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "lo-trinh-b2-tien-trinh.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importFile(file, done) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var stores = data && data.stores ? data.stores : data;
        if (!stores || typeof stores !== "object") throw new Error("format");
        var merged = mergeStores(collectLocal(), stores); /* hợp nhất, không xoá tiến độ đang có */
        applyStores(merged);
        done(null);
      } catch (e) { done(e); }
    };
    reader.onerror = function () { done(reader.error || new Error("read")); };
    reader.readAsText(file);
  }

  /* ---------- Supabase ---------- */
  var sb = null, sbLoading = null;
  function loadSupabase() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (sbLoading) return sbLoading;
    sbLoading = new Promise(function (res, rej) {
      var s = document.createElement("script");
      /* PIN version chính xác + SRI: trình duyệt từ chối chạy nếu file CDN bị
         đổi/hỏng (chống supply-chain trên trang xử lý email/mật khẩu/token) */
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.1/dist/umd/supabase.min.js";
      s.integrity = "sha384-fx4y4cDx8NYfissnVzdGJY3yVXWY3rn5ab5HTUjpvgT35oDiyAbjjqnLhnRmESNE";
      s.crossOrigin = "anonymous";
      s.onload = res;
      s.onerror = function () { rej(new Error("Không tải được thư viện Supabase — kiểm tra mạng hoặc bộ chặn quảng cáo.")); };
      document.head.appendChild(s);
    });
    return sbLoading;
  }
  function client() {
    return loadSupabase().then(function () {
      if (!sb) sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
      return sb;
    });
  }
  function currentUser() {
    return client().then(function (c) { return c.auth.getUser(); })
      .then(function (r) { return r.data && r.data.user; });
  }
  function pullRemote(c, uid) {
    return c.from("progress").select("data").eq("user_id", uid).maybeSingle()
      .then(function (r) { if (r.error) throw r.error; return r.data ? r.data.data : null; });
  }
  function pushRemote(c, uid, stores) {
    return c.from("progress").upsert({ user_id: uid, data: stores, updated_at: new Date().toISOString() })
      .then(function (r) { if (r.error) throw r.error; });
  }

  var syncing = false, pending = false;
  function fullSync(opts) {
    opts = opts || {};
    if (!CLOUD) return Promise.resolve({ skipped: true });
    if (syncing) { pending = true; return Promise.resolve({ busy: true }); }
    syncing = true;
    var cRef;
    return client().then(function (c) { cRef = c; return c.auth.getUser(); })
      .then(function (r) {
        var user = r.data && r.data.user;
        if (!user) throw new Error("Chưa đăng nhập.");
        var local = collectLocal();
        return pullRemote(cRef, user.id).then(function (remote) {
          var merged = mergeStores(local, remote || {});
          var changedLocal = !sameJson(merged, local);
          if (changedLocal) applyStores(merged);
          var changedRemote = !sameJson(merged, remote || {});
          var p = changedRemote ? pushRemote(cRef, user.id, merged) : Promise.resolve();
          return p.then(function () {
            try { localStorage.setItem(META_KEY, JSON.stringify({ at: Date.now(), email: user.email })); } catch (e) {}
            return { changedLocal: changedLocal };
          });
        });
      })
      .then(function (res) {
        syncing = false;
        if (pending) { pending = false; scheduleSync(); }
        if (res.changedLocal && opts.reloadOnChange) location.reload();
        return res;
      })
      .catch(function (e) { syncing = false; throw e; });
  }

  var syncTimer = null;
  function scheduleSync() {
    if (!CLOUD) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      isLoggedIn().then(function (yes) { if (yes) fullSync().then(refreshBadge).catch(function () {}); });
    }, 2500);
  }
  var loggedInCache = null;
  function isLoggedIn() {
    if (!CLOUD) return Promise.resolve(false);
    return currentUser().then(function (u) { loggedInCache = !!u; return !!u; }).catch(function () { return false; });
  }

  /* ---------- theo dõi thay đổi để tự đẩy lên ---------- */
  if (CLOUD) {
    var _set = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (k, v) {
      _set(k, v);
      if (isSyncKey(k)) scheduleSync();
    };
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) isLoggedIn().then(function (yes) { if (yes) fullSync().then(refreshBadge).catch(function () {}); });
    });
  }

  /* ---------- giao diện: nút tài khoản + hộp thoại ---------- */
  /* icon nét mảnh dùng currentColor — khớp phong cách line-icon của trang */
  function svg(paths) {
    return '<svg class="btn-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }
  var ICONS = {
    sync: svg('<path d="M20 11a8 8 0 0 0-14-4.9L3 8"/><path d="M3 3v5h5"/><path d="M4 13a8 8 0 0 0 14 4.9L21 16"/><path d="M21 21v-5h-5"/>'),
    download: svg('<path d="M12 3v11"/><path d="M8 10l4 4 4-4"/><path d="M5 20h14"/>'),
    upload: svg('<path d="M12 21V10"/><path d="M8 14l4-4 4 4"/><path d="M5 4h14"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>'),
  };
  var modal, statusEl, toastEl;
  function toast(msg, bad) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "sync-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.setAttribute("role", bad ? "alert" : "status");
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-bad", !!bad);
    toastEl.classList.add("is-show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-show"); }, 3000);
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lastSyncText() {
    try {
      var m = JSON.parse(localStorage.getItem(META_KEY) || "null");
      if (m && m.at) return "Đồng bộ lần cuối: " + new Date(m.at).toLocaleString("vi-VN");
    } catch (e) {}
    return "";
  }

  var modalTrigger = null;
  function bgEls() {
    return [document.querySelector(".site-header"), document.querySelector("main"), document.querySelector(".footer, .site-footer")]
      .filter(Boolean);
  }
  function openModal() {
    if (!modal) buildModal();
    modalTrigger = document.activeElement && document.activeElement.focus ? document.activeElement : accountBtn;
    modal.hidden = false;
    document.documentElement.classList.add("sync-lock"); /* khoá cuộn nền */
    bgEls().forEach(function (el) { el.setAttribute("aria-hidden", "true"); });
    renderModal();
    modal.querySelector(".sync-card").focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove("sync-lock");
    bgEls().forEach(function (el) { el.removeAttribute("aria-hidden"); });
    if (modalTrigger && document.contains(modalTrigger)) modalTrigger.focus();
    else if (accountBtn) accountBtn.focus();
  }
  /* bẫy Tab trong hộp thoại — không cho focus trốn ra header/nav phía sau */
  function trapTab(e) {
    if (e.key !== "Tab" || !modal || modal.hidden) return;
    var f = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "sync-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="sync-backdrop" data-close></div>' +
      '<div class="sync-card panel-card" role="dialog" aria-modal="true" aria-label="Tài khoản và sao lưu" tabindex="-1">' +
      '<button class="lookup-close sync-x" type="button" aria-label="Đóng" data-close>×</button>' +
      '<div class="sync-body"></div>' +
      "</div>";
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
    modal.addEventListener("keydown", trapTab);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal && !modal.hidden) closeModal(); });
  }

  function renderModal() {
    var body = modal.querySelector(".sync-body");
    var cloudSection;
    if (!CLOUD) {
      cloudSection = window.__B2_KEY_DANGER
        ? '<p class="eyebrow">Đồng bộ đám mây</p>' +
          '<p class="sync-msg"><b>⚠️ Khoá cấu hình sai (service_role) — đã chặn vì lý do an toàn.</b> Hãy thay bằng khoá <b>anon public</b> trong <code>sync-config.js</code>.</p>'
        : '<p class="eyebrow">Đồng bộ đám mây</p>' +
          '<p class="exercise-hint">Chưa bật. Người quản trị cần điền khoá Supabase trong <code>sync-config.js</code> (xem <code>SYNC-SETUP.md</code>). Trong lúc đó bạn vẫn sao lưu/khôi phục bằng file bên dưới.</p>';
      body.innerHTML = wrap(cloudSection);
      wireFileButtons();
      return;
    }
    body.innerHTML = wrap('<p class="eyebrow">Tài khoản</p><p class="exercise-hint">Đang kiểm tra…</p>');
    wireFileButtons();
    currentUser().then(function (user) {
      if (user) renderLoggedIn(user); else renderLoggedOut();
    }).catch(function () { renderLoggedOut(); });
  }
  function wrap(cloudHtml) {
    return (
      '<h2 style="margin-top:0;">Tài khoản &amp; sao lưu</h2>' +
      '<div class="sync-cloud">' + cloudHtml + "</div>" +
      '<hr style="border:none;border-top:1px solid var(--line);margin:1.4rem 0;">' +
      '<p class="eyebrow">Sao lưu bằng file (không cần tài khoản)</p>' +
      '<p class="exercise-hint">Tải toàn bộ tiến trình thành 1 file, mở trên máy/điện thoại khác rồi Khôi phục. Khôi phục sẽ HỢP NHẤT, không xoá tiến độ đang có.</p>' +
      '<div class="result-actions">' +
      '<button class="btn btn-ghost" data-act="export" type="button">' + ICONS.download + " Tải file sao lưu</button>" +
      '<button class="btn btn-ghost" data-act="import" type="button">' + ICONS.upload + " Khôi phục từ file</button>" +
      '<input type="file" accept="application/json,.json" hidden data-file>' +
      "</div>"
    );
  }
  function wireFileButtons() {
    var body = modal.querySelector(".sync-body");
    var fileInput = body.querySelector("[data-file]");
    body.querySelector('[data-act="export"]').addEventListener("click", function () {
      exportFile(); toast("Đã tải file sao lưu.");
    });
    body.querySelector('[data-act="import"]').addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () {
      if (!fileInput.files[0]) return;
      importFile(fileInput.files[0], function (err) {
        if (err) { toast("File không hợp lệ.", true); return; }
        toast("Đã khôi phục — đang tải lại…");
        if (CLOUD) isLoggedIn().then(function (y) { if (y) scheduleSync(); });
        setTimeout(function () { location.reload(); }, 800);
      });
      fileInput.value = "";
    });
  }
  function renderLoggedOut() {
    modal.querySelector(".sync-cloud").innerHTML =
      '<p class="eyebrow">Đăng nhập để đồng bộ đa thiết bị</p>' +
      '<div class="sync-form">' +
      '<input type="email" class="sync-input" data-email placeholder="Email" autocomplete="email">' +
      '<input type="password" class="sync-input" data-pass placeholder="Mật khẩu (≥ 6 ký tự)" autocomplete="current-password">' +
      '<div class="result-actions">' +
      '<button class="btn btn-primary" data-act="login" type="button">Đăng nhập</button>' +
      '<button class="btn btn-ghost" data-act="register" type="button">Đăng ký</button>' +
      "</div>" +
      '<p class="sync-msg" role="status"></p>' +
      "</div>";
    var body = modal.querySelector(".sync-cloud");
    var email = body.querySelector("[data-email]"), pass = body.querySelector("[data-pass]");
    var msg = body.querySelector(".sync-msg");
    function creds() { return { email: (email.value || "").trim(), password: pass.value || "" }; }
    function busy(on, label) {
      body.querySelectorAll("button").forEach(function (b) { b.disabled = on; });
      msg.textContent = on ? label : "";
    }
    body.querySelector('[data-act="login"]').addEventListener("click", function () {
      var c = creds();
      if (!c.email || c.password.length < 6) { msg.textContent = "Nhập email và mật khẩu ≥ 6 ký tự."; return; }
      busy(true, "Đang đăng nhập…");
      client().then(function (cl) { return cl.auth.signInWithPassword(c); })
        .then(function (r) {
          if (r.error) throw r.error;
          return fullSync({ reloadOnChange: false });
        })
        .then(function () { toast("Đã đăng nhập & đồng bộ."); renderModal(); refreshBadge(); setTimeout(function () { location.reload(); }, 600); })
        .catch(function (e) { busy(false); msg.textContent = authError(e); });
    });
    body.querySelector('[data-act="register"]').addEventListener("click", function () {
      var c = creds();
      if (!c.email || c.password.length < 6) { msg.textContent = "Nhập email và mật khẩu ≥ 6 ký tự."; return; }
      busy(true, "Đang tạo tài khoản…");
      client().then(function (cl) { return cl.auth.signUp(c); })
        .then(function (r) {
          if (r.error) throw r.error;
          if (r.data && r.data.session) { /* đăng nhập luôn (đã tắt confirm email) */
            return fullSync({ reloadOnChange: false }).then(function () {
              toast("Đã tạo tài khoản & lưu tiến trình."); renderModal(); refreshBadge(); setTimeout(function () { location.reload(); }, 600);
            });
          }
          busy(false);
          msg.textContent = "Đã gửi email xác nhận. Xác nhận xong hãy đăng nhập. (Quản trị có thể tắt xác nhận email để đăng nhập ngay.)";
        })
        .catch(function (e) { busy(false); msg.textContent = authError(e); });
    });
  }
  function renderLoggedIn(user) {
    modal.querySelector(".sync-cloud").innerHTML =
      '<p class="eyebrow">Đã đăng nhập</p>' +
      '<p><b>' + esc(user.email) + "</b></p>" +
      '<p class="exercise-hint sync-last">' + esc(lastSyncText()) + "</p>" +
      '<div class="result-actions">' +
      '<button class="btn btn-primary" data-act="syncnow" type="button">' + ICONS.sync + " Đồng bộ ngay</button>" +
      '<button class="btn btn-ghost" data-act="logout" type="button">Đăng xuất</button>' +
      "</div>";
    var body = modal.querySelector(".sync-cloud");
    body.querySelector('[data-act="syncnow"]').addEventListener("click", function () {
      var btn = this; btn.disabled = true; btn.textContent = "Đang đồng bộ…";
      fullSync({ reloadOnChange: true }).then(function (res) {
        btn.disabled = false; btn.innerHTML = ICONS.sync + " Đồng bộ ngay";
        body.querySelector(".sync-last").textContent = lastSyncText();
        toast(res.changedLocal ? "Đã đồng bộ (có cập nhật)." : "Đã đồng bộ.");
        refreshBadge();
      }).catch(function (e) { btn.disabled = false; btn.innerHTML = ICONS.sync + " Đồng bộ ngay"; toast(authError(e), true); });
    });
    body.querySelector('[data-act="logout"]').addEventListener("click", function () {
      client().then(function (cl) { return cl.auth.signOut(); }).then(function () {
        toast("Đã đăng xuất (tiến trình vẫn còn trên máy này)."); renderModal(); refreshBadge();
      });
    });
  }
  function authError(e) {
    var m = (e && e.message) || "Có lỗi xảy ra.";
    if (/Invalid login/i.test(m)) return "Sai email hoặc mật khẩu.";
    if (/already registered|already exists/i.test(m)) return "Email này đã có tài khoản — hãy đăng nhập.";
    if (/Email not confirmed/i.test(m)) return "Email chưa được xác nhận.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Lỗi mạng — kiểm tra kết nối.";
    return m;
  }

  /* ---------- nút tài khoản trên header ---------- */
  var accountBtn, navAccount;
  function makeTrigger(cls, withText) {
    var b = document.createElement("button");
    b.className = cls;
    b.type = "button";
    b.setAttribute("aria-label", "Tài khoản và sao lưu");
    b.innerHTML = ICONS.user + (withText ? " <span>Tài khoản</span>" : "");
    b.addEventListener("click", openModal);
    return b;
  }
  function injectAccountButton() {
    var header = document.querySelector(".header-inner");
    if (!header) return;
    /* bản icon trên header (chỉ hiện desktop) */
    accountBtn = makeTrigger("account-btn", false);
    var ring = header.querySelector(".header-progress");
    var toggle = header.querySelector(".nav-toggle");
    header.insertBefore(accountBtn, ring || toggle || null);
    /* bản trong menu (chỉ hiện mobile) — đặt cuối danh sách nav */
    var nav = document.querySelector(".site-nav");
    if (nav) { navAccount = makeTrigger("nav-account", true); nav.appendChild(navAccount); }
    refreshBadge();
  }
  function refreshBadge() {
    function apply(yes) {
      [accountBtn, navAccount].forEach(function (b) {
        if (!b) return;
        b.classList.toggle("is-in", yes);
        b.title = yes ? "Đã đăng nhập — nhấn để đồng bộ/đăng xuất" : "Đăng nhập để đồng bộ đa thiết bị";
        var t = b.querySelector("span");
        if (t) t.textContent = yes ? "Tài khoản · đã đăng nhập" : "Tài khoản";
      });
    }
    if (!CLOUD) { apply(false); return; }
    isLoggedIn().then(apply);
  }

  /* ---------- khởi động ---------- */
  function init() {
    injectAccountButton();
    if (CLOUD) isLoggedIn().then(function (yes) { if (yes) fullSync().then(refreshBadge).catch(function () {}); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.B2Sync = {
    export: exportFile,
    sync: function () { return fullSync({ reloadOnChange: true }); },
    open: openModal,
    merge: mergeStores, /* dùng cho kiểm thử hợp nhất */
  };
})();
