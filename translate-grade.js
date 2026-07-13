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

  function span(cls, w) { return '<span class="' + cls + '">' + esc(w) + "</span>"; }

  /* So bản dịch của người dùng với MỘT đáp án mẫu theo CẢ HAI chiều:
     - recall = bao nhiêu từ của bản mẫu được khớp (bạn có thiếu từ không).
     - precision = bao nhiêu từ BẠN viết nằm trong bản mẫu (bạn có viết sai/thừa từ không).
     Nhờ precision mới phân biệt được "thiếu từ" với "dùng SAI từ". */
  function analyzeAnswer(answer, userWords) {
    var model = normWords(answer);
    var modelMatched = lcsMatch(model, userWords); /* index từ MẪU được khớp */
    var userMatched = lcsMatch(userWords, model);   /* index từ NGƯỜI DÙNG có trong mẫu */
    var recall = model.length ? modelMatched.size / model.length : 0;
    var precision = userWords.length ? userMatched.size / userWords.length : 0;
    var f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
    return {
      answer: answer, model: model, recall: recall, precision: precision, f1: f1,
      missed: model.filter(function (w, i) { return !modelMatched.has(i); }),   /* từ mẫu người dùng THIẾU */
      extra: userWords.filter(function (w, i) { return !userMatched.has(i); }),  /* từ người dùng viết SAI/THỪA */
      modelDiff: model.map(function (w, i) { return span(modelMatched.has(i) ? "w-ok" : "w-miss", w); }).join(" "),
      userDiff: userWords.map(function (w, i) { return span(userMatched.has(i) ? "w-ok" : "w-bad", w); }).join(" "),
    };
  }

  /* Từ danh sách thiếu/thừa → mô tả lỗi CỤ THỂ: chia sai dạng, dùng sai từ (ghép
     từ thừa với từ mẫu bị thiếu), thiếu từ. Phân loại lỗi ngữ pháp vs lỗi từ vựng. */
  function describeIssues(a) {
    var missed = a.missed.slice(), issues = [], hasGrammarErr = false, hasWordErr = false;
    a.extra.forEach(function (u) {
      var fi = missed.findIndex(function (m) { return m !== u && stemWord(u).length >= 3 && stemWord(m) === stemWord(u); });
      if (fi >= 0) { issues.push("chia sai dạng: bạn viết “" + u + "”, cần “" + missed[fi] + "”"); missed.splice(fi, 1); hasGrammarErr = true; return; }
      var ci = missed.findIndex(function (m) { return !GRAMMAR_WORDS[m]; });
      if (!GRAMMAR_WORDS[u] && ci >= 0) { issues.push("bạn dùng “" + u + "”, bản mẫu dùng “" + missed[ci] + "”"); missed.splice(ci, 1); hasWordErr = true; return; }
      issues.push("thừa/sai từ “" + u + "”");
      if (GRAMMAR_WORDS[u]) hasGrammarErr = true; else hasWordErr = true;
    });
    missed.forEach(function (m) {
      issues.push("thiếu từ “" + m + "”");
      if (GRAMMAR_WORDS[m]) hasGrammarErr = true;
    });
    return { issues: issues, hasGrammarErr: hasGrammarErr, hasWordErr: hasWordErr };
  }

  /* Chấm gộp với TẤT CẢ đáp án chấp nhận, lấy đáp án khớp nhất (F1 cao nhất).
     ĐẠT khi: khớp tuyệt đối, HOẶC không viết từ nào sai + không thiếu từ ngữ
     pháp + phủ >= ngưỡng (chỉ bỏ bớt từ phụ như trạng từ thì vẫn tính đúng).
     kind: correct | accepted | word | grammar | incomplete | empty. */
  function grade(userText, answers, passPct) {
    passPct = (passPct || 80) / 100;
    var userWords = normWords(userText);
    var model0 = (answers && answers[0]) || "";
    if (!userWords.length)
      return { best: 0, pass: false, kind: "empty", issues: [], modelDiff: "", userDiff: "", model: model0 };

    var best = null;
    (answers || []).forEach(function (ans) {
      var a = analyzeAnswer(ans, userWords);
      if (!best || a.f1 > best.f1) best = a;
    });
    if (!best)
      return { best: 0, pass: false, kind: "empty", issues: [], modelDiff: "", userDiff: "", model: model0 };

    var exact = best.recall === 1 && best.precision === 1;
    var info = describeIssues(best);
    var onlyOptionalOmitted = best.extra.length === 0 &&
      best.missed.every(function (w) { return !GRAMMAR_WORDS[w]; });
    var pass = exact || (onlyOptionalOmitted && best.recall >= passPct);
    var kind = exact ? "correct"
      : pass ? "accepted"
      : info.hasWordErr ? "word"
      : info.hasGrammarErr ? "grammar"
      : "incomplete";
    return {
      best: Math.round(best.f1 * 100), pass: pass, kind: kind, issues: info.issues,
      modelDiff: best.modelDiff, userDiff: best.userDiff, model: best.answer,
      recall: Math.round(best.recall * 100), precision: Math.round(best.precision * 100),
    };
  }

  /* Dựng phần giải thích (nhận xét + diff + bản mẫu) từ kết quả grade(). Dùng
     CHUNG cho câu dịch trong bài học và phần Viết ở trang Luyện kỹ năng. */
  function feedbackHtml(res, modelAnswer, note) {
    /* nhiều lỗi thì chỉ nêu vài lỗi đầu cho dễ đọc, còn lại xem ở bản mẫu */
    var shown = res.issues.slice(0, 4);
    var issueText = shown.map(esc).join("; ") + (res.issues.length > shown.length ? "; …" : "");
    if (!res.issues.length) issueText = "";
    var head;
    if (res.kind === "correct") head = "<b>Chính xác.</b>";
    else if (res.kind === "accepted")
      head = "<b>Đúng rồi.</b> Bản mẫu đầy đủ hơn — câu của bạn vẫn được chấp nhận" +
        (issueText ? " (chỉ thiếu: " + issueText + ")" : "") + ".";
    else if (res.kind === "word") head = '<b class="grev-bad">Sai/khác từ — chưa đạt.</b> ' + issueText + ".";
    else if (res.kind === "grammar") head = '<b class="grev-bad">Lỗi ngữ pháp — chưa đạt.</b> ' + issueText + ".";
    else if (res.kind === "empty") head = "<b>Bạn bỏ trống câu này.</b>";
    else head = "<b>Chưa đủ ý (khớp " + res.best + "%) — chưa đạt.</b>" + (issueText ? " " + issueText + "." : "");

    var diff = "";
    if ((res.kind === "word" || res.kind === "grammar") && res.userDiff)
      diff = '<p class="wd-label">Câu của bạn</p><p class="word-diff" lang="en">' + res.userDiff + "</p>";
    else if ((res.kind === "accepted" || res.kind === "incomplete") && res.modelDiff)
      diff = '<p class="wd-label">Bản mẫu (gạch đỏ là chỗ bạn thiếu)</p><p class="word-diff" lang="en">' + res.modelDiff + "</p>";

    var model = res.kind === "correct" ? "" :
      '<div class="model-answer"><p class="panel-label">Bản mẫu</p><p lang="en">' + esc(modelAnswer) + "</p>" +
      (note ? '<p class="exercise-hint">' + esc(note) + "</p>" : "") + "</div>";
    return head + diff + model;
  }

  window.TranslateGrade = {
    normWords: normWords,
    compare: compare,
    grammarIssues: grammarIssues,
    grade: grade,
    feedbackHtml: feedbackHtml,
  };
})();
