/* =====================================================
   I.D. Toys — shared site interactions (all pages)
   every block guards for element existence
   ===================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    var EMPTY_TEXT = "이름을 지어주세요";
    syncTag = function () {
      var v = nameInput.value.trim();
      tagName.textContent = v || EMPTY_TEXT;
      tagName.classList.toggle("is-empty", !v);
    };
    nameInput.addEventListener("input", syncTag);
    syncTag();
  }

  /* ---------- "이 친구 주문하기" → order page ---------- */
  document.querySelectorAll(".friend__adopt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var friend = btn.closest(".friend").dataset.friend;
      window.location.href = "order.html?friend=" + encodeURIComponent(friend);
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
      var line = guardian + "님, 소중한 예약 감사합니다. ";
      if (friend === "아직 고민 중이에요") {
        line += "어떤 친구가 좋을지 함께 고민해 드릴게요. ";
      } else if (toyName) {
        line += "‘" + toyName + "’(이)라는 이름의 " + friend + " 친구를 정성껏 지어 보내드릴게요. ";
      } else {
        line += friend + " 친구를 정성껏 지어 보내드릴게요. ";
      }
      line += "하루 안에 제작 일정과 입금 안내를 문자로 드리겠습니다.";
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
        qError.textContent = agree.checked
          ? "필수 항목을 확인해 주세요."
          : "필수 항목과 개인정보 동의를 확인해 주세요.";
        return;
      }

      var company = document.getElementById("qCompany").value.trim();
      var manager = document.getElementById("qManager").value.trim();
      qDoneBody.textContent =
        company + " " + manager + "님, 문의 감사합니다. " +
        "영업일 기준 24시간 안에 한국어 담당자가 회신드리겠습니다. " +
        "시안이나 참고 자료가 있다면 회신 메일에 첨부해 주세요.";

      quoteForm.hidden = true;
      qDone.hidden = false;
      qDone.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
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
