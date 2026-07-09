/* Nút chuyển giao diện Sáng ⇄ Tối.
   - Lựa chọn lưu ở localStorage "b2-theme" (KHÔNG đồng bộ — thiết lập của từng
     máy). Chưa chọn → theo hệ thống (prefers-color-scheme).
   - data-theme trên <html> đã được script inline trong <head> đặt SỚM để tránh
     nhấp nháy; file này chỉ dựng nút + xử lý khi bấm / khi hệ thống đổi. */
(function () {
  "use strict";

  var KEY = "b2-theme";
  var META = { dark: "#121212", light: "#f2f5f0" }; /* khớp --bg mỗi theme */
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try { var v = localStorage.getItem(KEY); return v === "dark" || v === "light" ? v : null; }
    catch (e) { return null; }
  }
  function systemTheme() { return mq && mq.matches ? "dark" : "light"; }
  function current() {
    return document.documentElement.getAttribute("data-theme") || stored() || systemTheme();
  }

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>';

  var btn = null;
  function updateBtn(theme) {
    if (!btn) return;
    var dark = theme === "dark";
    btn.innerHTML = dark ? SUN : MOON; /* đang tối → hiện mặt trời (bấm để sang sáng) */
    var label = dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-pressed", String(dark));
    btn.title = label;
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", META[theme] || META.light);
    updateBtn(theme);
  }

  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  function inject() {
    var header = document.querySelector(".header-inner");
    if (!header || header.querySelector(".theme-toggle")) return;
    btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.addEventListener("click", toggle);
    /* đặt trước cụm nút điều khiển bên phải (tài khoản / vòng % / hamburger) */
    var ref = header.querySelector(".account-btn, .header-progress, .nav-toggle");
    header.insertBefore(btn, ref || null);
    updateBtn(current());
  }

  /* theo hệ thống khi người dùng CHƯA chọn thủ công */
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function () { if (!stored()) apply(systemTheme()); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
