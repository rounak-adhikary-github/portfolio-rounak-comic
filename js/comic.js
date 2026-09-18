/* ============================================================
   Rounak Adhikary — comic book portfolio behaviour
   ------------------------------------------------------------
   Progressive enhancement throughout: with JavaScript off the page
   still reads, the links still work, and the résumé still downloads.
   Nothing is fetched from a third party, and nothing is stored
   anywhere except this browser's localStorage.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------------- footer year ---------------- */
  var yearEl = $("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- live Kolkata clock ---------------- */
  var clockEl = $("statusClock");
  if (clockEl) {
    var tick = function () {
      try {
        clockEl.textContent = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        }).format(new Date());
      } catch (err) {
        clockEl.textContent = new Date().toLocaleTimeString();
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- rotating subtitle ---------------- */
  var typed = $("typedRole");
  if (typed) {
    var words = ["Core Java", "Spring Boot", "REST APIs", "Microservices", "JAX-RS · JPA", "Migrations", "AI-assisted dev"];
    if (reduceMotion) {
      typed.textContent = words[0];
    } else {
      var w = 0, c = 0, deleting = false;
      (function loop() {
        var word = words[w];
        typed.textContent = word.slice(0, c);
        if (!deleting && c < word.length) { c++; setTimeout(loop, 62); }
        else if (!deleting && c === word.length) { deleting = true; setTimeout(loop, 1500); }
        else if (deleting && c > 0) { c--; setTimeout(loop, 28); }
        else { deleting = false; w = (w + 1) % words.length; setTimeout(loop, 220); }
      })();
    }
  }

  /* ---------------- reading progress ---------------- */
  var fill = $("progressFill");
  if (fill) {
    var paint = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = Math.max(0, Math.min(100, pct)).toFixed(2) + "%";
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
  }

  /* ---------------- panels fly in ---------------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  if (!("IntersectionObserver" in window) || reduceMotion) {
    panels.forEach(function (el) { el.classList.add("in"); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        seen.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    panels.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min((i % 6) * 45, 220) + "ms";
      seen.observe(el);
    });
  }

  /* ---------------- current section tab ---------------- */
  var tabLinks = Array.prototype.slice.call(document.querySelectorAll(".tabs a"));
  var sections = tabLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var mark = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { mark.observe(s); });
  }

  /* ---------------- stat counters ---------------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, ms = 900;
    var step = function (now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / ms);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + (t === 1 ? suffix : "");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(runCounter);
  } else {
    var counted = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        counted.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counted.observe(el); });
  }

  /* ---------------- skill filters ---------------- */
  var grid = $("skillGrid");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  if (grid && chips.length) {
    var apply = function (want) {
      Array.prototype.slice.call(grid.querySelectorAll(".skill")).forEach(function (card) {
        var show = want === "all" || card.getAttribute("data-cat") === want;
        card.classList.toggle("is-hidden", !show);
      });
      chips.forEach(function (b) {
        var on = b.getAttribute("data-filter") === want;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };
    chips.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
    });
  }

  /* ---------------- caption toast ---------------- */
  var toast = document.createElement("p");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var toastTimer = null;
  var say = function (msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2600);
  };

  /* ---------------- sound-effect pops (opt in) ---------------- */
  var SFX = ["POW!", "BAM!", "ZAP!", "BOOM!", "WHAM!", "KRAK!", "THWIP!", "KAPOW!", "BIF!", "SOCK!"];
  var SFX_COLORS = ["#ffd400", "#e62429", "#17b8d8", "#ffffff", "#7a3ff2"];
  var sfxOn = false;
  var lastPop = 0;

  var pop = function (x, y, word) {
    var el = document.createElement("span");
    el.className = "sfx-pop";
    el.setAttribute("aria-hidden", "true");
    el.textContent = word || SFX[(Math.random() * SFX.length) | 0];
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.color = SFX_COLORS[(Math.random() * SFX_COLORS.length) | 0];
    el.style.setProperty("--rot", (Math.random() * 26 - 13).toFixed(1) + "deg");
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 900);
  };

  var onPagePointerDown = function (e) {
    if (!sfxOn) return;
    var now = Date.now();
    if (now - lastPop < 110) return;         // one pop per click, not per pixel
    lastPop = now;
    pop(e.clientX, e.clientY);
  };
  document.addEventListener("pointerdown", onPagePointerDown, { passive: true });

  var sfxBtn = $("sfxToggle");
  if (sfxBtn) {
    var setSfx = function (on) {
      sfxOn = on && !reduceMotion;
      sfxBtn.setAttribute("aria-pressed", on ? "true" : "false");
    };
    setSfx(store.get("ra-sfx") === "on");
    sfxBtn.addEventListener("click", function () {
      var next = !sfxOn;
      setSfx(next);
      store.set("ra-sfx", next ? "on" : "off");
      say(next ? "Sound effects on — try clicking around" : "Sound effects off");
    });
  }

  /* ---------------- ink screen toggle ---------------- */
  var inkBtn = $("inkToggle");
  if (inkBtn) {
    var setInk = function (on) {
      document.body.classList.toggle("ink-off", !on);
      inkBtn.setAttribute("aria-pressed", on ? "true" : "false");
    };
    setInk(store.get("ra-ink") !== "off");
    inkBtn.addEventListener("click", function () {
      var on = document.body.classList.contains("ink-off");   // was off -> turn it on
      setInk(on);
      store.set("ra-ink", on ? "on" : "off");
      say(on ? "Halftone screen on" : "Halftone screen off");
    });
  }

  /* ---------------- copy email ---------------- */
  var EMAIL = "write2r.adhikary@gmail.com";
  var copyBtn = $("copyMail");
  var note = $("formNote");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var announce = function (msg) {
        if (note) note.textContent = msg;
        say(msg);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () {
          announce("Copied — " + EMAIL);
        }, function () { announce(EMAIL); });
      } else {
        announce(EMAIL);
      }
    });
  }

  /* ---------------- contact form -> mail client ---------------- */
  var form = $("contactForm");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = ($("cName") || {}).value || "";
      var from = ($("cEmail") || {}).value || "";
      var msg = ($("cMsg") || {}).value || "";
      var live = $("formNote");

      if (!name.trim() || !from.trim() || !msg.trim()) {
        if (live) live.textContent = "Please fill in your name, email and a message.";
        say("Please fill in every field.");
        var firstEmpty = [!name.trim() && $("cName"), !from.trim() && $("cEmail"), !msg.trim() && $("cMsg")]
          .filter(Boolean)[0];
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      var subject = "Portfolio enquiry from " + name;
      var body = msg + "\n\n—\n" + name + "\n" + from;
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (live) live.textContent = "Opening your mail app…";
      say("Opening your mail app…");
    });
  }

  /* ---------------- reader counter (cosmetic, this browser only) ---------------- */
  var hits = $("hitCount");
  if (hits) {
    var KEY = "ra-readers";
    var n = parseInt(store.get(KEY) || "0", 10) || 0;
    n += 1;
    store.set(KEY, String(n));
    hits.textContent = String(100000 + n).padStart(6, "0");
  }

  /* ---------------- konami code: a page-wide special ---------------- */
  (function () {
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var at = 0;
    var burst = function () {
      say("★ ISSUE #07 — 1999 called, and it wants its website back ★");
      var spots = [[50, 34], [22, 26], [78, 24], [34, 58], [66, 62], [50, 76], [14, 68], [86, 44]];
      spots.forEach(function (s, i) {
        setTimeout(function () {
          pop((s[0] / 100) * window.innerWidth, (s[1] / 100) * window.innerHeight);
        }, i * 70);
      });
      if (!reduceMotion) {
        var stage = document.querySelector("main") || document.body;
        stage.classList.add("shake");
        setTimeout(function () { stage.classList.remove("shake"); }, 520);
      }
    };
    document.addEventListener("keydown", function (e) {
      // never swallow arrow keys or letters while someone is typing a message
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[at]) {
        at++;
        if (at === seq.length) { at = 0; burst(); }
      } else {
        at = key === seq[0] ? 1 : 0;
      }
    });
  })();
})();
