/* Nhúng thẳng styles.css (đã minify) vào <head> của từng trang HTML.
   Chạy trong CI trước khi upload artifact — file NGUỒN trong repo không đổi.
   Mục đích: bỏ request stylesheet CHẶN RENDER (Lighthouse: render-blocking
   resources). Sau bước này không trang nào còn <link rel=stylesheet href=styles.css>. */
const fs = require("fs");
const path = require("path");

const dir = process.argv[2] || ".";
const cssPath = path.join(dir, "styles.css");
const css = fs.readFileSync(cssPath, "utf8");

if (css.includes("</style")) {
  console.error("styles.css chứa '</style' — không thể nhúng an toàn.");
  process.exit(1);
}

const LINK = /[ \t]*<link rel="stylesheet" href="styles\.css">\r?\n/;
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
let done = 0;
const missed = [];

for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, "utf8");
  if (!LINK.test(s)) { missed.push(f); continue; }
  /* dùng hàm thay thế: chuỗi CSS có thể chứa $ (ký tự đặc biệt của replace) */
  s = s.replace(LINK, () => "  <style>" + css + "</style>\n");
  fs.writeFileSync(p, s);
  done++;
}

console.log(`inline-css: nhúng vào ${done}/${files.length} trang (${(css.length / 1024).toFixed(1)}KB CSS)`);
if (missed.length) {
  console.error("KHÔNG khớp <link styles.css> ở:", missed.join(", "));
  process.exit(1); /* thà fail build còn hơn deploy trang mất CSS */
}
