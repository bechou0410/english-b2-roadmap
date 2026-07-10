/* Chấm bản dịch VI→EN bằng so khớp CHUẨN HOÁ (không cần mạng/AI):
   - normWords: hạ chữ thường, bỏ dấu câu, quy số về chữ.
   - compare: khớp từ theo LCS (đúng thứ tự), trả % số từ khớp + diff.
   - grammarIssues: "gần đúng" mà thiếu/sai từ ngữ pháp hoặc chia sai dạng =
     lỗi NGHIÊM TRỌNG (không tính đạt dù khớp 80–99% số từ).
   Dùng chung cho trang Luyện kỹ năng (viết) và câu dịch trong bài học. */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var DIGIT_WORDS = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
    "10": "ten", "11": "eleven", "12": "twelve", "20": "twenty",
    "30": "thirty", "40": "forty", "50": "fifty", "100": "hundred",
  };

  function normWords(s) {
    return String(s).toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-z0-9' ]+/gi, " ")
      .split(/\s+/).filter(Boolean)
      .map(function (w) { return DIGIT_WORDS[w] || w; });
  }

  /* Set các index từ trong target khớp được với got (giữ thứ tự) */
  function lcsMatch(target, got) {
    var m = target.length, n = got.length;
    var dp = [];
    for (var i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    for (i = m - 1; i >= 0; i--)
      for (var j = n - 1; j >= 0; j--)
        dp[i][j] = target[i] === got[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var matched = new Set();
    i = 0; j = 0;
    while (i < m && j < n) {
      if (target[i] === got[j]) { matched.add(i); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return matched;
  }

  function compare(targetText, gotText) {
    var target = normWords(targetText);
    var got = normWords(gotText);
    var matched = lcsMatch(target, got);
    var pct = target.length ? Math.round((matched.size / target.length) * 100) : 0;
    var diffHtml = target.map(function (w, i) {
      return '<span class="' + (matched.has(i) ? "w-ok" : "w-miss") + '">' + esc(w) + "</span>";
    }).join(" ");
    var missed = target.filter(function (w, i) { return !matched.has(i); });
    return { pct: pct, diffHtml: diffHtml, missed: missed };
  }

  var GRAMMAR_WORDS = {};
  ("am is are was were be been being do does did don't doesn't didn't have has had " +
   "haven't hasn't hadn't will would won't wouldn't shall should can could may might must " +
   "a an the to of in on at for with by from since until than as not no isn't aren't wasn't weren't")
    .split(" ").forEach(function (w) { GRAMMAR_WORDS[w] = true; });

  function stemWord(w) {
    return w.replace(/'(s|ll|re|ve|d|m|t)$/, "").replace(/(ies|ied|es|ed|ing|er|est|s)$/, "");
  }

  function grammarIssues(missed, userWords) {
    var issues = [];
    missed.forEach(function (w) {
      if (GRAMMAR_WORDS[w]) { issues.push("thiếu/sai từ ngữ pháp “" + w + "”"); return; }
      var st = stemWord(w);
      if (st.length < 3) return;
      var wrongForm = userWords.find(function (u) { return u !== w && stemWord(u) === st; });
      if (wrongForm) issues.push("chia sai dạng: bạn viết “" + wrongForm + "”, cần “" + w + "”");
    });
    return issues;
  }

  /* Chấm gộp: so bản dịch của người dùng với TẤT CẢ đáp án chấp nhận, lấy kết
     quả tốt nhất. Trả về best% + effective (đã trừ điểm nếu lỗi ngữ pháp) +
     kind ("correct" | "grammar" | "near" | "low") + diff + danh sách lỗi. */
  function grade(userText, answers, passPct) {
    passPct = passPct || 80;
    var mineWords = normWords(userText);
    var mine = mineWords.join(" ");
    var best = 0, bestMissed = [], bestDiff = "";
    (answers || []).forEach(function (ans) {
      var pct, missed, diffHtml;
      if (normWords(ans).join(" ") === mine) { pct = 100; missed = []; diffHtml = ""; }
      else { var r = compare(ans, userText); pct = r.pct; missed = r.missed; diffHtml = r.diffHtml; }
      if (pct > best) { best = pct; bestMissed = missed; bestDiff = diffHtml; }
    });
    var issues = best > 0 && best < 100 ? grammarIssues(bestMissed, mineWords) : [];
    var effective = best, kind;
    if (best === 100) kind = "correct";
    else if (issues.length) { effective = Math.min(best, 60); kind = "grammar"; }
    else if (best >= passPct) kind = "near";
    else kind = "low";
    return { best: best, effective: effective, kind: kind, issues: issues, missed: bestMissed, diffHtml: bestDiff };
  }

  window.TranslateGrade = {
    normWords: normWords,
    compare: compare,
    grammarIssues: grammarIssues,
    grade: grade,
  };
})();
