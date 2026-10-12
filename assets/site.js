/* Rusumba Bukanga, portfolio. Shared behaviour. No dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Scroll progress line */
  var prog = $("#progress i");
  function onScroll() {
    if (!prog) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var burger = $(".burger"), mnav = $(".mobile-nav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      mnav.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
    });
    $$("a", mnav).forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        mnav.classList.remove("open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* Split headings into words for staggered rise */
  $$(".words").forEach(function (el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement("span");
            s.className = "w"; s.textContent = p;
            s.style.transitionDelay = (0.05 * i++) + "s";
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    }
    walk(el);
  });

  /* Reveal on scroll, counters, timeline, stack bars */
  function count(b) {
    var n = +b.dataset.n, s = b.dataset.s || "", t0 = performance.now();
    if (reduce) { b.textContent = n + s; return; }
    var f = function (t) {
      var p = Math.min((t - t0) / 1400, 1);
      b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s;
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      $$("b[data-n]", e.target).forEach(count);
      if (e.target.matches("b[data-n]")) count(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .words, .timeline, .tl, .stack .row, .stats > div").forEach(function (el) { io.observe(el); });

  /* Card cursor glow */
  $$(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* Page-level cursor glow */
  var glow = $(".cursor-glow");
  if (glow && !reduce && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* Hero constellation field */
  var canvas = $("#hero canvas.field");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d"), pts = [], W, H, mouse = { x: -1e4, y: -1e4 }, raf;
    function size() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = Math.floor(r.width * devicePixelRatio);
      H = canvas.height = Math.floor(r.height * devicePixelRatio);
      var n = Math.min(90, Math.floor((r.width * r.height) / 14000));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio, vy: (Math.random() - 0.5) * 0.18 * devicePixelRatio, r: (Math.random() * 1.2 + 0.6) * devicePixelRatio });
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      var link = 130 * devicePixelRatio;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160 * devicePixelRatio) { p.x += dx / d * 0.6; p.y += dy / d * 0.6; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(237,186,107,0.55)"; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], ex = p.x - q.x, ey = p.y - q.y, e = Math.sqrt(ex * ex + ey * ey);
          if (e < link) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(200,158,93," + (0.22 * (1 - e / link)) + ")";
            ctx.lineWidth = devicePixelRatio * 0.6; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    var hero = canvas.parentElement;
    hero.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio;
    });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -1e4; });
    window.addEventListener("resize", size);
    size(); tick();
    var vis = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { if (!raf) tick(); } else { cancelAnimationFrame(raf); raf = 0; } });
    });
    vis.observe(hero);
  }

  /* Work page filters */
  var filters = $(".filters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", filters).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var f = b.dataset.f;
      $$(".tile[data-cat]").forEach(function (t) {
        var show = f === "all" || t.dataset.cat.split(" ").indexOf(f) > -1;
        t.classList.toggle("hide", !show);
        if (show) { t.classList.remove("in"); requestAnimationFrame(function () { t.classList.add("in"); }); }
      });
    });
  }

  /* Active section links in header and case study table of contents */
  var links = $$("nav.primary a.l[href^='#'], .proj-side .toc a[href^='#']");
  if (links.length) {
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute("href").slice(1); var t = document.getElementById(id); if (t) map[id] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var a = map[e.target.id]; if (a) a.classList.add("active");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { so.observe(document.getElementById(id)); });
  }

  /* Contact form: hands off to the mail client, no backend */
  var form = $("form.cf");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      location.href = "mailto:herij46@gmail.com?subject=" + encodeURIComponent("Enquiry from " + d.get("n")) + "&body=" + encodeURIComponent(d.get("m") + "\n\n" + d.get("n") + " (" + d.get("e") + ")");
    });
  }

  /* Current year */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
