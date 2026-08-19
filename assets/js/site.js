/* =====================================================
   I.D. Toys — shared site interactions (all pages)
   every block guards for element existence
   ===================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- language (set by i18n.js on previous load; read from storage) ---------- */
  var LANG = localStorage.getItem("idtoy-lang") || "ko";
  if (LANG !== "en" && LANG !== "th") LANG = "ko";
  var MSG = {
    ko: {
      empty: "이름을 지어주세요",
      reqErr: "필수 항목을 확인해 주세요.",
      reqAgreeErr: "필수 항목과 개인정보 동의를 확인해 주세요.",
      rsvThanks: function (g) { return g + "님, 소중한 예약 감사합니다. "; },
      rsvUndecided: "어떤 친구가 좋을지 함께 고민해 드릴게요. ",
      rsvNamed: function (n, f) { return "‘" + n + "’(이)라는 이름의 " + f + " 친구를 정성껏 지어 보내드릴게요. "; },
      rsvPlain: function (f) { return f + " 친구를 정성껏 지어 보내드릴게요. "; },
      rsvTail: "하루 안에 제작 일정과 입금 안내를 문자로 드리겠습니다.",
      qThanks: function (c, m) { return c + " " + m + "님, 문의 감사합니다. 영업일 기준 24시간 안에 한국어 담당자가 회신드리겠습니다. 시안이나 참고 자료가 있다면 회신 메일에 첨부해 주세요."; },
      sending: "전송 중…",
      sendBtn: "견적 문의 보내기",
      sendFail: "전송에 실패했어요. lifeyes1002@gmail.com 으로 직접 보내주세요."
    },
    en: {
      empty: "Give them a name",
      reqErr: "Please check the required fields.",
      reqAgreeErr: "Please check the required fields and the consent box.",
      rsvThanks: function (g) { return g + ", thank you for your reservation. "; },
      rsvUndecided: "We'll help you find the right friend together. ",
      rsvNamed: function (n, f) { return "We'll lovingly craft your " + f + " named ‘" + n + "’. "; },
      rsvPlain: function (f) { return "We'll lovingly craft your " + f + ". "; },
      rsvTail: "We'll text the crafting schedule and payment details within a day.",
      qThanks: function (c, m) { return "Thank you, " + m + " of " + c + ". A manager will reply within 24 business hours. If you have sketches or references, attach them to our reply email."; },
      sending: "Sending…",
      sendBtn: "Send Quote Request",
      sendFail: "Sending failed. Please email us directly at lifeyes1002@gmail.com."
    },
    th: {
      empty: "ตั้งชื่อให้หน่อยนะ",
      reqErr: "กรุณาตรวจสอบช่องที่จำเป็น",
      reqAgreeErr: "กรุณาตรวจสอบช่องที่จำเป็นและช่องยินยอม",
      rsvThanks: function (g) { return "คุณ" + g + " ขอบคุณสำหรับการจองค่ะ "; },
      rsvUndecided: "เราจะช่วยเลือกเพื่อนที่เหมาะที่สุดไปด้วยกันนะคะ ",
      rsvNamed: function (n, f) { return "เราจะตั้งใจผลิต" + f + "ชื่อ ‘" + n + "’ ให้อย่างดีค่ะ "; },
      rsvPlain: function (f) { return "เราจะตั้งใจผลิต" + f + "ให้อย่างดีค่ะ "; },
      rsvTail: "จะส่งตารางผลิตและวิธีชำระเงินให้ภายในหนึ่งวันค่ะ",
      qThanks: function (c, m) { return "ขอบคุณค่ะ คุณ" + m + " จาก " + c + " ผู้ดูแลจะตอบกลับภายใน 24 ชั่วโมงทำการ ถ้ามีแบบหรือภาพอ้างอิง แนบมากับอีเมลตอบกลับได้เลยค่ะ"; },
      sending: "กำลังส่ง…",
      sendBtn: "ส่งคำขอใบเสนอราคา",
      sendFail: "ส่งไม่สำเร็จ กรุณาอีเมลตรงมาที่ lifeyes1002@gmail.com"
    }
  }[LANG];
  function trFriend(f) {
    var w = window.IDTOY_I18N;
    return w && w.t ? w.t(f) : f;
  }

  /* ---------- header scroll state ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      reveals.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------- pause videos if reduced motion ---------- */
  if (prefersReduced) {
    document.querySelectorAll("video").forEach(function (v) {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }

  /* ---------- founders lookbook marquee (duplicate track for seamless loop) ---------- */
  var duoTrack = document.querySelector(".duo__track");
  if (duoTrack && !prefersReduced) {
    Array.prototype.slice.call(duoTrack.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      duoTrack.appendChild(clone);
    });
  }

  /* ---------- moments gallery nav ---------- */
  var gallery = document.getElementById("gallery");
  var galPrev = document.getElementById("galPrev");
  var galNext = document.getElementById("galNext");
  if (gallery && galPrev && galNext) {
    var galStep = function () {
      var card = gallery.querySelector(".gallery__card");
      return card ? card.getBoundingClientRect().width + 22 : 360;
    };
    galPrev.addEventListener("click", function () {
      gallery.scrollBy({ left: -galStep(), behavior: prefersReduced ? "auto" : "smooth" });
    });
    galNext.addEventListener("click", function () {
      gallery.scrollBy({ left: galStep(), behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- live name tag ---------- */
  var nameInput = document.getElementById("fName");
  var tagName = document.getElementById("nametagName");
  var syncTag = null;
  if (nameInput && tagName) {
    var EMPTY_TEXT = MSG.empty;
    syncTag = function () {
      var v = nameInput.value.trim();
      tagName.textContent = v || EMPTY_TEXT;
      tagName.classList.toggle("is-empty", !v);
    };
    nameInput.addEventListener("input", syncTag);
    syncTag();
  }

  /* ---------- "이 몸판으로 견적 문의" → contact page ---------- */
  document.querySelectorAll(".friend__adopt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "contact.html";
    });
  });

  /* ---------- order page: preselect friend from URL ---------- */
  var friendSelect = document.getElementById("fFriend");
  if (friendSelect) {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("friend");
    if (wanted) {
      var opt = Array.prototype.find.call(friendSelect.options, function (o) {
        return o.value === wanted;
      });
      if (opt) friendSelect.value = wanted;
    }
  }

  /* ---------- consumer reservation form ---------- */
  var reserveForm = document.getElementById("reserveForm");
  if (reserveForm) {
    var rError = document.getElementById("formError");
    var rDone = document.getElementById("formDone");
    var rDoneBody = document.getElementById("formDoneBody");
    var rReset = document.getElementById("formReset");

    reserveForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      ["fFriend", "fGuardian", "fPhone"].forEach(function (id) {
        var field = document.getElementById(id);
        var ok = field.value.trim() !== "";
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      rError.hidden = valid;
      if (!valid) return;

      var friend = friendSelect.value;
      var toyName = nameInput ? nameInput.value.trim() : "";
      var guardian = document.getElementById("fGuardian").value.trim();
      var line = MSG.rsvThanks(guardian);
      if (friend === "아직 고민 중이에요") {
        line += MSG.rsvUndecided;
      } else if (toyName) {
        line += MSG.rsvNamed(toyName, trFriend(friend));
      } else {
        line += MSG.rsvPlain(trFriend(friend));
      }
      line += MSG.rsvTail;
      rDoneBody.textContent = line;

      reserveForm.hidden = true;
      rDone.hidden = false;
      rDone.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    });

    reserveForm.addEventListener("input", function (e) {
      if (e.target.classList.contains("is-invalid") && e.target.value.trim() !== "") {
        e.target.classList.remove("is-invalid");
      }
    });

    if (rReset) {
      rReset.addEventListener("click", function () {
        reserveForm.reset();
        if (syncTag) syncTag();
        reserveForm.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
        rError.hidden = true;
        rDone.hidden = true;
        reserveForm.hidden = false;
        friendSelect.focus();
      });
    }
  }

  /* ---------- B2B quote form ---------- */
  var quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    var qError = document.getElementById("formError");
    var qDone = document.getElementById("formDone");
    var qDoneBody = document.getElementById("formDoneBody");
    var qReset = document.getElementById("formReset");

    var isValidEmail = function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    };

    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      ["qCompany", "qManager", "qType", "qQty"].forEach(function (id) {
        var field = document.getElementById(id);
        var ok = field.value.trim() !== "";
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      var email = document.getElementById("qEmail");
      var emailOk = isValidEmail(email.value.trim());
      email.classList.toggle("is-invalid", !emailOk);
      if (!emailOk) valid = false;

      var agree = document.getElementById("qAgree");
      if (!agree.checked) valid = false;

      qError.hidden = valid;
      if (!valid) {
        qError.textContent = agree.checked ? MSG.reqErr : MSG.reqAgreeErr;
        return;
      }

      var company = document.getElementById("qCompany").value.trim();
      var manager = document.getElementById("qManager").value.trim();

      /* --- send to Google Sheets via Apps Script web app --- */
      var QUOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbxPisXkHeibBTehckqepbP5nANBM1yaDTbmfYxukWwduS3h2kJv6teX6nizTxZVhg/exec";

      var submitBtn = quoteForm.querySelector(".form__submit");

      if (!QUOTE_ENDPOINT) {
        qError.hidden = false;
        qError.textContent = MSG.sendFail;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = MSG.sending;

      var body = new URLSearchParams({
        company: company,
        manager: manager,
        email: email.value.trim(),
        phone: document.getElementById("qPhone").value.trim(),
        type: document.getElementById("qType").value,
        qty: document.getElementById("qQty").value,
        when: document.getElementById("qWhen").value,
        message: document.getElementById("qMsg").value.trim(),
        lang: LANG
      });

      fetch(QUOTE_ENDPOINT, { method: "POST", body: body })
        .then(function (res) {
          if (!res.ok) throw new Error("send failed");
          return res.json();
        }).then(function (data) {
          if (!data || data.result !== "success") throw new Error(data && data.message ? data.message : "send failed");
          qDoneBody.textContent = MSG.qThanks(company, manager);
          quoteForm.hidden = true;
          qDone.hidden = false;
          qDone.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
        }).catch(function () {
          qError.hidden = false;
          qError.textContent = MSG.sendFail;
        }).finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = MSG.sendBtn;
        });
    });

    quoteForm.addEventListener("input", function (e) {
      if (e.target.classList.contains("is-invalid") && e.target.value.trim() !== "") {
        e.target.classList.remove("is-invalid");
      }
    });

    if (qReset) {
      qReset.addEventListener("click", function () {
        quoteForm.reset();
        quoteForm.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
        qError.hidden = true;
        qDone.hidden = true;
        quoteForm.hidden = false;
        document.getElementById("qCompany").focus();
      });
    }
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
