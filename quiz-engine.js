/* Quiz engine dùng chung cho: kiểm tra đầu vào (stepper), bài tập trong bài học
   và bài kiểm tra cuối chặng (list). Không phụ thuộc dữ liệu — chỉ nhận mảng câu hỏi
   dạng { question, options[4], answer, explain_vi } và callback kết quả. */

(function () {
  "use strict";

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

  /* Một card câu hỏi. name phải duy nhất trong trang.
     Cấu trúc: div.quiz-q > [div.q-passage (đoạn đọc, nếu có)] + fieldset > legend (chỉ câu hỏi) + options.
     Đoạn đọc để NGOÀI legend (nối bằng aria-describedby) để screen reader
     không phải đọc cả đoạn văn làm tên của radio group. */
  function questionCard(q, name, number) {
    var card = el("div", "quiz-q");
    var parts = String(q.question).split(/\n\n+/);
    var main = esc(parts.pop()).replace(/\n/g, "<br>");

    var fs = el("fieldset", "quiz-fieldset");
    if (parts.length) {
      var passage = el("div", "q-passage",
        parts.map(function (p) { return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>"; }).join(""));
      passage.id = name + "-passage";
      card.appendChild(passage);
      fs.setAttribute("aria-describedby", passage.id);
    }
    fs.innerHTML =
      '<legend class="quiz-q-legend"><span class="quiz-q-num">' + number + "</span>" +
      '<span class="quiz-q-text">' + main + "</span></legend>";

    var opts = el("div", "quiz-options");
    q.options.forEach(function (opt, oi) {
      var id = name + "-o" + oi;
      var label = el("label", "quiz-option");
      label.innerHTML =
        '<input type="radio" name="' + esc(name) + '" id="' + esc(id) + '" value="' + oi + '">' +
        '<span class="quiz-option-key" aria-hidden="true">' + "ABCD"[oi] + "</span>" +
        '<span class="quiz-option-text">' + esc(opt) + "</span>";
      opts.appendChild(label);
    });
    fs.appendChild(opts);
    card.appendChild(fs);
    return card;
  }

  function selectedIndex(card) {
    var input = card.querySelector("input:checked");
    return input ? Number(input.value) : null;
  }

  /* Khoá card sau khi chấm và tô đúng/sai + giải thích.
     Đúng/sai được đánh dấu bằng cả màu, ký hiệu ✓/✗ lẫn text ẩn cho screen reader. */
  function markCard(card, q, picked) {
    card.classList.add("is-graded");
    var labels = card.querySelectorAll(".quiz-option");
    labels.forEach(function (label, oi) {
      var input = label.querySelector("input");
      var key = label.querySelector(".quiz-option-key");
      input.disabled = true;
      if (oi === q.answer) {
        label.classList.add("is-correct");
        key.textContent = "✓";
        label.insertAdjacentHTML("beforeend", '<span class="sr-only"> — đáp án đúng</span>');
      }
      if (picked === oi && oi !== q.answer) {
        label.classList.add("is-wrong");
        key.textContent = "✗";
        label.insertAdjacentHTML("beforeend", '<span class="sr-only"> — bạn đã chọn, chưa đúng</span>');
      }
    });
    var verdict = picked === q.answer;
    var expl = el("div", "quiz-explain " + (verdict ? "ok" : "no"),
      "<b>" + (verdict ? "Chính xác." : picked == null ? "Bạn bỏ trống câu này." : "Chưa đúng.") + "</b> " + esc(q.explain_vi));
    card.appendChild(expl);
    return verdict;
  }

  /* ===== Chế độ LIST: hiện tất cả câu + nút nộp bài (bài tập, kiểm tra cuối chặng) ===== */
  function renderList(container, questions, opts) {
    opts = opts || {};
    container.innerHTML = "";
    var form = el("form", "quiz-list");
    form.setAttribute("novalidate", "");
    var uid = "q" + Math.random().toString(36).slice(2, 8);
    var cards = questions.map(function (q, i) {
      var card = questionCard(q, uid + "-" + i, i + 1);
      form.appendChild(card);
      return card;
    });

    var footer = el("div", "quiz-footer");
    var status = el("p", "quiz-status", "");
    status.setAttribute("role", "status"); /* screen reader nghe được cảnh báo câu bỏ trống */
    var submit = el("button", "btn btn-primary", esc(opts.submitLabel || "Nộp bài"));
    submit.type = "submit";
    footer.appendChild(status);
    footer.appendChild(submit);
    form.appendChild(footer);

    /* người dùng đổi câu trả lời → cảnh báo bỏ trống cũ hết hiệu lực */
    form.addEventListener("change", function () {
      delete form.dataset.confirmedBlank;
      status.textContent = "";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var unanswered = cards.filter(function (c) { return selectedIndex(c) == null; }).length;
      if (unanswered > 0 && !form.dataset.confirmedBlank) {
        status.textContent = "Còn " + unanswered + " câu chưa trả lời — bấm Nộp bài lần nữa nếu muốn nộp luôn.";
        form.dataset.confirmedBlank = "1";
        return;
      }
      var correct = 0;
      cards.forEach(function (card, i) {
        if (markCard(card, questions[i], selectedIndex(card))) correct++;
      });
      submit.remove();
      status.textContent = "";
      if (opts.onComplete) opts.onComplete({ correct: correct, total: questions.length });
    });

    container.appendChild(form);
  }

  /* ===== Chế độ STEPPER: từng câu một (kiểm tra đầu vào) ===== */
  function renderStepper(container, questions, opts) {
    opts = opts || {};
    container.innerHTML = "";
    var answers = new Array(questions.length).fill(null);
    var idx = 0;

    var head = el("div", "quiz-stepper-head");
    var counter = el("p", "quiz-counter", "");
    var bar = el("div", "quiz-stepper-bar", '<div class="quiz-stepper-fill"></div>');
    head.appendChild(counter);
    head.appendChild(bar);
    var body = el("div", "quiz-stepper-body");
    var nav = el("div", "quiz-footer");
    var back = el("button", "btn btn-ghost", "← Câu trước");
    var next = el("button", "btn btn-primary", "Câu tiếp →");
    back.type = "button";
    next.type = "button";
    nav.appendChild(back);
    nav.appendChild(next);
    container.appendChild(head);
    container.appendChild(body);
    container.appendChild(nav);

    function show(i, moveFocus) {
      idx = i;
      counter.textContent = "Câu " + (i + 1) + " / " + questions.length;
      bar.querySelector(".quiz-stepper-fill").style.width = (((i + 1) / questions.length) * 100) + "%";
      body.innerHTML = "";
      var card = questionCard(questions[i], "step-" + i, i + 1);
      if (answers[i] != null) {
        card.querySelectorAll("input")[answers[i]].checked = true;
      }
      card.addEventListener("change", function () {
        answers[i] = selectedIndex(card);
        next.disabled = false;
      });
      body.appendChild(card);
      back.disabled = i === 0;
      next.disabled = answers[i] == null;
      next.textContent = i === questions.length - 1 ? "Xem kết quả" : "Câu tiếp →";
      /* nút Next bị disable khi sang câu mới → chuyển focus vào card
         để bàn phím/screen reader không bị rơi về <body> */
      if (moveFocus) {
        card.setAttribute("tabindex", "-1");
        card.focus();
      }
    }

    back.addEventListener("click", function () { if (idx > 0) show(idx - 1, true); });
    next.addEventListener("click", function () {
      if (idx < questions.length - 1) show(idx + 1, true);
      else if (opts.onComplete) opts.onComplete({ answers: answers.slice() });
    });

    show(0, false);
  }

  /* Danh sách xem lại đáp án sau khi có answers[] */
  function renderReview(container, questions, answers) {
    container.innerHTML = "";
    questions.forEach(function (q, i) {
      var card = questionCard(q, "rv-" + i, i + 1);
      if (answers[i] != null) card.querySelectorAll("input")[answers[i]].checked = true;
      markCard(card, q, answers[i]);
      container.appendChild(card);
    });
  }

  /* Rút ngẫu nhiên n phần tử (Fisher–Yates trên bản sao) — dùng cho ngân hàng đề */
  function sample(arr, n) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, Math.min(n, a.length));
  }

  /* Xáo thứ tự 4 lựa chọn của từng câu (trả về bản sao, answer được ánh xạ lại)
     — người làm lại đề không thể nhớ vị trí đáp án. explain_vi không tham chiếu
     chữ cái A/B/C/D nên an toàn. */
  function shuffleOptions(questions) {
    return questions.map(function (q) {
      var order = [0, 1, 2, 3];
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      var copy = {};
      Object.keys(q).forEach(function (k) { copy[k] = q[k]; });
      copy.options = order.map(function (oi) { return q.options[oi]; });
      copy.answer = order.indexOf(q.answer);
      return copy;
    });
  }

  window.QuizEngine = {
    renderList: renderList,
    renderStepper: renderStepper,
    renderReview: renderReview,
    sample: sample,
    shuffleOptions: shuffleOptions,
  };
})();
