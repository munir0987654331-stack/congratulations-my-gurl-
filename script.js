/* =========================================================
   For Ayesha — behaviour
   1) password lock  2) envelope  3) site reveal, petals, lightbox
   ========================================================= */
(function () {
  "use strict";

  /* ---- Password -------------------------------------------------
     The password is stored as a hash, not as plain text.
     To change it: open the browser console, run  hashPw("newword")
     and paste the number into PASSWORD_HASH below.
     NOTE: this is a gentle lock for a personal gift, not real security.
  -------------------------------------------------------------- */
  var PASSWORD_HASH = 2784970435010517; // "ayesha"

  function cyrb53(str, seed) {
    seed = seed || 0;
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  // keep only plain letters/digits, lowercase (ignores spaces, capitals, hidden keyboard characters)
  function clean(str) {
    try { str = String(str).normalize("NFKC"); } catch (e) { str = String(str); }
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  window.hashPw = function (s) { return cyrb53(clean(s)); };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var body = document.body;
  var lock = $("#lock"), intro = $("#intro"), site = $("#site");
  var form = $("#lockForm"), pw = $("#pw"), msg = $("#lockMsg"), card = $(".lock-card");
  var envelope = $("#envelope"), enterBtn = $("#enterBtn"), tapHint = $("#tapHint");

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(get, k, v) {
    try { return get ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- falling petals & hearts ---------- */
  var petalsBox = $("#petals");
  var petalColors = ["#f6b8c6", "#f9cdd7", "#ee9db1", "#fbe0e5", "#f3a9bb"];
  function makePetal(initial) {
    if (!petalsBox || reduced) return;
    var el = document.createElement("div");
    el.className = "petal";
    var size = 12 + Math.random() * 16;
    var heart = Math.random() < 0.28;
    el.style.width = size + "px";
    el.style.height = size * (heart ? 0.9 : 1.2) + "px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.color = petalColors[(Math.random() * petalColors.length) | 0];
    el.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    var dur = 9 + Math.random() * 9;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = (initial ? -Math.random() * dur : 0) + "s";
    el.innerHTML = heart
      ? '<svg viewBox="0 0 32 29"><use href="#heart"/></svg>'
      : '<svg viewBox="0 0 60 100"><use href="#leaf"/></svg>';
    petalsBox.appendChild(el);
    setTimeout(function () { el.remove(); }, (dur + 1) * 1000);
  }
  function startPetals() {
    if (reduced) return;
    var count = window.innerWidth < 600 ? 10 : 18;
    for (var i = 0; i < count; i++) makePetal(true);
    setInterval(function () { if (!document.hidden) makePetal(false); }, window.innerWidth < 600 ? 1100 : 700);
  }
  startPetals();

  /* ---------- 1) LOCK ---------- */
  function showIntro(fromLock) {
    lock.hidden = true;
    intro.hidden = false;
    body.classList.remove("is-locked");
    body.classList.add("is-intro");
    envelope.classList.remove("open");
    enterBtn.hidden = true;
    tapHint.style.visibility = "visible";
    if (fromLock) window.scrollTo(0, 0);
  }

  if (store(true, "ayesha-unlocked") === "yes") {
    showIntro(false);
  } else {
    setTimeout(function () { try { pw.focus({ preventScroll: true }); } catch (e) {} }, 700);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = clean(pw.value);
    if (val && cyrb53(val) === PASSWORD_HASH) {
      msg.textContent = "Welcome, Ayesha 🤍";
      store(false, "ayesha-unlocked", "yes");
      setTimeout(function () { showIntro(true); }, 650);
    } else {
      msg.textContent = "Hmm, not quite… try again 🌸";
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      pw.select();
    }
  });

  $("#pwToggle").addEventListener("click", function () {
    var show = pw.type === "password";
    pw.type = show ? "text" : "password";
    this.setAttribute("aria-label", show ? "Hide password" : "Show password");
    this.textContent = show ? "🙈" : "👁️";
    pw.focus();
  });

  /* ---------- 2) ENVELOPE ---------- */
  var opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    envelope.setAttribute("aria-label", "Envelope opened");
    burstHearts();
    setTimeout(function () {
      enterBtn.hidden = false;
      try { enterBtn.focus({ preventScroll: true }); } catch (e) {}
    }, reduced ? 100 : 1500);
  }
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });

  function burstHearts() {
    if (reduced) return;
    var r = envelope.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
    for (var i = 0; i < 16; i++) {
      var h = document.createElement("span");
      h.textContent = ["💗", "🌸", "💞", "✨", "🤍"][i % 5];
      h.style.cssText =
        "position:fixed;z-index:120;pointer-events:none;font-size:" + (16 + Math.random() * 16) +
        "px;left:" + cx + "px;top:" + cy + "px;transition:transform 1.5s cubic-bezier(.1,.8,.3,1),opacity 1.5s;opacity:1";
      document.body.appendChild(h);
      (function (el) {
        var a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 150;
        requestAnimationFrame(function () {
          el.style.transform = "translate(" + Math.cos(a) * d + "px," + (Math.sin(a) * d - 60) + "px) rotate(" + (Math.random() * 120 - 60) + "deg)";
          el.style.opacity = "0";
        });
        setTimeout(function () { el.remove(); }, 1600);
      })(h);
    }
  }

  enterBtn.addEventListener("click", function () {
    intro.style.transition = "opacity .8s ease, transform .8s ease";
    intro.style.opacity = "0";
    intro.style.transform = "scale(1.05)";
    setTimeout(function () {
      intro.hidden = true;
      intro.style.opacity = ""; intro.style.transform = ""; intro.style.transition = "";
      site.hidden = false;
      body.classList.remove("is-intro");
      window.scrollTo(0, 0);
      initSite();
    }, reduced ? 0 : 750);
  });

  $("#replay").addEventListener("click", function () {
    site.hidden = true;
    opened = false;
    intro.hidden = false;
    envelope.classList.remove("open");
    enterBtn.hidden = true;
    tapHint.style.visibility = "visible";
    body.classList.add("is-intro");
    window.scrollTo(0, 0);
  });

  /* ---------- 3) SITE ---------- */
  var siteReady = false;
  var io;
  function initSite() {
    // reveal on scroll
    var items = $$(".reveal");
    if (!siteReady) {
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              var el = en.target;
              var sibs = el.parentElement ? $$(".reveal", el.parentElement) : [];
              var idx = Math.max(0, sibs.indexOf(el));
              el.style.transitionDelay = Math.min(idx * 0.12, 0.4) + "s";
              el.classList.add("in");
              io.unobserve(el);
            }
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      }
    }
    items.forEach(function (el) {
      if (io) { if (!el.classList.contains("in")) io.observe(el); }
      else el.classList.add("in");
    });

    if (siteReady) return;
    siteReady = true;

    // nav show/hide + active chapter
    var nav = $("#nav");
    var links = $$("a", nav);
    var sections = links.map(function (a) { return document.getElementById(a.dataset.target); });
    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle("show", y > window.innerHeight * 0.6);
      var current = null;
      sections.forEach(function (s) {
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
      });
      var fin = document.getElementById("finale");
      if (fin && fin.getBoundingClientRect().top < window.innerHeight * 0.4) current = null;
      links.forEach(function (a) { a.classList.toggle("active", a.dataset.target === current); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // photo fallback (if a picture is missing)
    $$(".polaroid img").forEach(function (img) {
      img.addEventListener("error", function () { img.style.visibility = "hidden"; img.alt = ""; });
    });

    // lightbox
    var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
    function openLb(fig) {
      var img = $("img", fig);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = fig.dataset.caption || "";
      lb.hidden = false;
      body.classList.add("lb-open");
      $("#lbClose").focus();
    }
    function closeLb() { lb.hidden = true; body.classList.remove("lb-open"); lbImg.src = ""; }
    $$(".polaroid").forEach(function (fig) {
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.addEventListener("click", function () { openLb(fig); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(fig); }
      });
    });
    $("#lbClose").addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLb(); });
  }
})();
