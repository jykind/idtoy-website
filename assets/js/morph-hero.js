/* =====================================================
   ID TOY — scroll-morph hero (vanilla port)
   scatter → line → circle → bottom-arc morph
   ported from a React/framer-motion component
   ===================================================== */
(function () {
  "use strict";

  var stage = document.getElementById("morphStage");
  var hero = document.getElementById("morphHero");
  if (!stage || !hero) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- config ---------- */
  var IMAGES = [
    "id-toy-final-12/01-main-hero-4-animals.jpg",
    "id-toy-final-12/02-teddy-bear-product.jpg",
    "id-toy-final-12/03-eight-animal-flatlay.jpg",
    "id-toy-final-12/04-bedroom-puppy-lifestyle.jpg",
    "id-toy-final-12/05-livingroom-kitten-lamb.jpg",
    "id-toy-final-12/06-child-hugging-bunny.jpg",
    "id-toy-final-12/07-material-touch-detail.jpg",
    "id-toy-final-12/08-duckling-unboxing.jpg",
    "id-toy-final-12/09-spring-picnic.jpg",
    "id-toy-final-12/10-winter-fox-panda.jpg",
    "id-toy-final-12/11-bedtime-dream-collection.jpg",
    "id-toy-final-12/12-section-background.jpg",
    "id-toy-final-12/call_hwpdAY2jxfANV6KZo9Xs2ohj.jpg",
    "id-toy-final-12/call_mxeBLB8DGnqqtyknURKY2fgf.jpg",
    "id-toy-final-12/call_7xHAWEFsqONMUTgUj09n9TZE.jpg",
    "id-toy-final-12/call_cxj4Ps3hF5ms17TulMpXM9rh.jpg"
  ];
  var TOTAL = IMAGES.length;
  var MORPH_END = 600;    // virtual scroll where circle → arc morph completes
  var MAX_SCROLL = 3000;  // virtual scroll range end (arc shuffle)

  var introEl = document.getElementById("morphIntro");
  var activeEl = document.getElementById("morphActive");

  /* ---------- build cards ---------- */
  var cards = [];
  IMAGES.forEach(function (src, i) {
    var card = document.createElement("a");
    card.className = "mcard";
    card.href = "contact.html";
    card.setAttribute("aria-label", "견적 문의 페이지로 이동");
    card.tabIndex = -1; // keep 16 cards out of the tab order; CTA button covers keyboard users
    card.innerHTML =
      '<span class="mcard__inner">' +
        '<span class="mcard__face mcard__face--front"><img src="' + src + '" alt="" loading="eager"></span>' +
        '<span class="mcard__face mcard__face--back"><span class="mcard__back-inner"><em>ID TOY</em><strong>견적 문의 →</strong></span></span>' +
      "</span>";
    stage.appendChild(card);
    cards.push({
      el: card,
      // current animated values
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      r: (Math.random() - 0.5) * 180,
      s: 0.6,
      o: 0
    });
  });

  /* ---------- state ---------- */
  var phase = "scatter";              // scatter → line → circle
  var vw = hero.clientWidth, vh = hero.clientHeight;
  var virtualScroll = 0;              // raw
  var morph = 0, rotateP = 0, parallax = 0;         // smoothed values
  var morphT = 0, rotatePT = 0, parallaxT = 0;      // targets

  window.addEventListener("resize", function () {
    vw = hero.clientWidth; vh = hero.clientHeight;
  });

  /* ---------- intro sequence ---------- */
  if (prefersReduced) {
    phase = "circle";
    virtualScroll = MORPH_END;   // start with the arc already formed
    morph = morphT = 1;
  } else {
    setTimeout(function () { phase = "line"; }, 500);
    setTimeout(function () { phase = "circle"; }, 2500);
  }

  /* ---------- virtual scroll (wheel / touch) ---------- */
  function heroDominant() {
    var r = hero.getBoundingClientRect();
    return r.top > -40 && r.bottom > vh * 0.6;
  }

  function applyDelta(delta) {
    var next = Math.min(Math.max(virtualScroll + delta, 0), MAX_SCROLL);
    var consumed = next !== virtualScroll;
    virtualScroll = next;
    morphT = Math.min(Math.max(virtualScroll / MORPH_END, 0), 1);
    rotatePT = Math.min(Math.max((virtualScroll - MORPH_END) / (MAX_SCROLL - MORPH_END), 0), 1);
    return consumed;
  }

  if (!prefersReduced) {
    hero.addEventListener("wheel", function (e) {
      if (!heroDominant()) return;               // hero out of view → normal page scroll
      if (phase !== "circle") { e.preventDefault(); return; } // hold page during intro
      if (applyDelta(e.deltaY)) e.preventDefault();
      // else: virtual range exhausted → let the page scroll on
    }, { passive: false });

    var touchY = 0;
    hero.addEventListener("touchstart", function (e) {
      touchY = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener("touchmove", function (e) {
      if (!heroDominant() || phase !== "circle") return;
      var y = e.touches[0].clientY;
      var delta = touchY - y;
      touchY = y;
      if (applyDelta(delta * 2)) e.preventDefault();
    }, { passive: false });
  }

  /* ---------- mouse parallax ---------- */
  hero.addEventListener("mousemove", function (e) {
    var rect = hero.getBoundingClientRect();
    var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 … 1
    parallaxT = nx * 100;
  });

  /* ---------- helpers ---------- */
  function lerp(a, b, t) { return a * (1 - t) + b * t; }

  function targetFor(i) {
    if (phase === "scatter") {
      return null; // keep initial scatter values, invisible
    }
    if (phase === "line") {
      var spacing = Math.min(74, (vw - 80) / TOTAL);
      return { x: i * spacing - (TOTAL * spacing) / 2 + spacing / 2, y: 0, r: 0, s: 1, o: 1 };
    }

    // circle ↔ bottom-arc morph
    var isMobile = vw < 768;
    var minDim = Math.min(vw, vh);

    // A. circle
    var circleRadius = Math.min(minDim * 0.35, 330);
    var cAng = (i / TOTAL) * 360;
    var cRad = (cAng * Math.PI) / 180;
    var cx = Math.cos(cRad) * circleRadius;
    var cy = Math.sin(cRad) * circleRadius;
    var cr = cAng + 90;

    // B. bottom arc ("rainbow", convex up)
    var baseRadius = Math.min(vw, vh * 1.5);
    var arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
    var arcApexY = vh * (isMobile ? 0.35 : 0.25) - vh / 2; // stage centre origin
    var arcCenterY = arcApexY + arcRadius;

    var spread = isMobile ? 100 : 130;
    var startAngle = -90 - spread / 2;
    var step = spread / (TOTAL - 1);
    var maxRotation = spread * 0.8;
    var bounded = -rotateP * maxRotation;

    var aAng = startAngle + i * step + bounded;
    var aRad = (aAng * Math.PI) / 180;
    var ax = Math.cos(aRad) * arcRadius + parallax;
    var ay = Math.sin(aRad) * arcRadius + arcCenterY;
    var ar = aAng + 90;
    var as = isMobile ? 1.4 : 1.8;

    return {
      x: lerp(cx, ax, morph),
      y: lerp(cy, ay, morph),
      r: lerp(cr, ar, morph),
      s: lerp(1, as, morph),
      o: 1
    };
  }

  /* ---------- render loop ---------- */
  var last = performance.now();
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // spring-ish smoothing (exponential approach)
    var kSlow = 1 - Math.pow(0.002, dt);   // cards, morph
    var kFast = 1 - Math.pow(0.0005, dt);  // parallax

    morph += (morphT - morph) * kSlow;
    rotateP += (rotatePT - rotateP) * kSlow;
    parallax += (parallaxT - parallax) * kFast;

    for (var i = 0; i < TOTAL; i++) {
      var c = cards[i];
      var t = targetFor(i);
      if (t) {
        c.x += (t.x - c.x) * kSlow;
        c.y += (t.y - c.y) * kSlow;
        c.r += (t.r - c.r) * kSlow;
        c.s += (t.s - c.s) * kSlow;
        c.o += (t.o - c.o) * kSlow;
      }
      c.el.style.transform =
        "translate(-50%,-50%) translate(" + c.x.toFixed(2) + "px," + c.y.toFixed(2) + "px) " +
        "rotate(" + c.r.toFixed(2) + "deg) scale(" + c.s.toFixed(3) + ")";
      c.el.style.opacity = c.o.toFixed(3);
    }

    // intro text: visible in circle phase, fades as morph starts
    if (introEl) {
      var introO = phase === "circle" ? Math.max(0, 1 - morph * 2) : (phase === "line" ? 0.9 : 0);
      introEl.style.opacity = introO.toFixed(3);
      introEl.style.filter = "blur(" + ((1 - introO) * 6).toFixed(1) + "px)";
    }
    // arc-active content: fades in for morph 0.8 → 1
    if (activeEl) {
      var actO = Math.min(Math.max((morph - 0.8) / 0.2, 0), 1);
      activeEl.style.opacity = actO.toFixed(3);
      activeEl.style.transform = "translateY(" + ((1 - actO) * 20).toFixed(1) + "px)";
      activeEl.style.pointerEvents = actO > 0.6 ? "auto" : "none";
    }

    requestAnimationFrame(frame);
  }

  if (prefersReduced) {
    // single static layout pass, no continuous loop
    rotateP = 0; parallax = 0;
    for (var i = 0; i < TOTAL; i++) {
      var t = targetFor(i);
      var c = cards[i];
      c.x = t.x; c.y = t.y; c.r = t.r; c.s = t.s; c.o = 1;
      c.el.style.transform =
        "translate(-50%,-50%) translate(" + c.x + "px," + c.y + "px) rotate(" + c.r + "deg) scale(" + c.s + ")";
      c.el.style.opacity = "1";
    }
    if (introEl) introEl.style.opacity = "0";
    if (activeEl) { activeEl.style.opacity = "1"; activeEl.style.pointerEvents = "auto"; }
  } else {
    requestAnimationFrame(frame);
  }
})();
