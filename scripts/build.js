#!/usr/bin/env node
/* Builds index.html, work.html and projects/*.html from scripts/projects.json
   and the templates below. Run: node scripts/build.js  (no dependencies). */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const projects = JSON.parse(fs.readFileSync(path.join(__dirname, "projects.json"), "utf8"));
const SITE = "https://rusumba-portfolio.vercel.app";
const hasPortrait = fs.existsSync(path.join(ROOT, "assets", "portrait.jpg"));

/* ------------------------------------------------------------------------ */
/* Icons (Lucide, ISC licence)                                               */
/* ------------------------------------------------------------------------ */
const ICON = {
  shield: '<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
  github: '<svg viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 3v3"/><path d="m5.6 5.6 2.1 2.1"/><path d="M3 12h3"/><path d="m5.6 18.4 2.1-2.1"/><path d="M12 18v3"/><path d="m18.4 18.4-2.1-2.1"/><path d="M18 12h3"/><path d="m18.4 5.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg>',
  grid: '<svg viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
};
const MARK = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#edba6b"/><stop offset="1" stop-color="#a9803f"/></linearGradient><symbol id="mark" viewBox="0 0 64 64"><g fill="none" stroke="url(#g)" stroke-width="2" stroke-linecap="round"><path d="M32 6l5 14 14 5-14 5-5 14-5-14-14-5 14-5z"/><path d="M32 39v14M12 50l14-9M52 50L38 41"/><circle cx="32" cy="56" r="3"/><circle cx="10" cy="52" r="3"/><circle cx="54" cy="52" r="3"/></g></symbol></defs></svg>';

/* ------------------------------------------------------------------------ */
/* Schematic covers: gold wire diagrams for projects without screenshots      */
/* viewBox 400 x 250. node: {id,x,y,l (label), hub, w}                        */
/* ------------------------------------------------------------------------ */
const SCHEMATICS = {
  "alpha-sso-gateway": {
    nodes: [
      { id: "hub", x: 200, y: 125, l: "SSO Gateway", hub: 1, w: 110 },
      { id: "a", x: 70, y: 48, l: "Underwriting" }, { id: "b", x: 200, y: 38, l: "Client portal" }, { id: "c", x: 330, y: 48, l: "HR portal" },
      { id: "d", x: 70, y: 202, l: "Cognito" }, { id: "e", x: 200, y: 212, l: "KMS tokens" }, { id: "f", x: 330, y: 202, l: "DynamoDB" },
    ],
    edges: [["a", "hub", "solid"], ["b", "hub", "solid"], ["c", "hub", "solid"], ["hub", "d", "flow"], ["hub", "e", "flow"], ["hub", "f", "flow"]],
  },
  "akur8-uat-runner": {
    nodes: [
      { id: "a", x: 58, y: 125, l: "Test cases" }, { id: "b", x: 170, y: 125, l: "UAT Runner", hub: 1, w: 100 }, { id: "c", x: 290, y: 70, l: "Akur8 API" }, { id: "d", x: 290, y: 180, l: "Expected" }, { id: "e", x: 360, y: 125, l: "Diff" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "flow"], ["b", "d", "flow"], ["c", "e", "solid"], ["d", "e", "solid"]],
  },
  "alpha-operations": {
    nodes: [
      { id: "i", x: 60, y: 50, l: "Insurance" }, { id: "r", x: 60, y: 125, l: "Restaurant" }, { id: "g", x: 60, y: 200, l: "Gym" },
      { id: "hub", x: 200, y: 125, l: "Operations layer", hub: 1, w: 120 },
      { id: "c", x: 340, y: 42, l: "CRM" }, { id: "p", x: 340, y: 97, l: "Policies" }, { id: "b", x: 340, y: 152, l: "Bookings" }, { id: "d", x: 340, y: 207, l: "Billing run" },
    ],
    edges: [["i", "hub", "solid"], ["r", "hub", "solid"], ["g", "hub", "solid"], ["hub", "c", "flow"], ["hub", "p", "flow"], ["hub", "b", "flow"], ["hub", "d", "flow"]],
  },
  "claim-forms-modernisation": {
    nodes: [
      { id: "a", x: 55, y: 125, l: "PDF forms" }, { id: "b", x: 150, y: 125, l: "Parser", hub: 1 }, { id: "c", x: 245, y: 125, l: "Web form" }, { id: "d", x: 345, y: 125, l: "E-signature" },
      { id: "e", x: 245, y: 210, l: "Stored record" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "solid"], ["c", "d", "solid"], ["d", "e", "flow"]],
  },
  "tutor-vetting-automation": {
    nodes: [
      { id: "a", x: 50, y: 125, l: "Application" }, { id: "b", x: 140, y: 70, l: "KYC" }, { id: "c", x: 200, y: 180, l: "Biometrics" }, { id: "d", x: 260, y: 70, l: "AML screen" },
      { id: "e", x: 350, y: 125, l: "Approve", hub: 1 },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "solid"], ["c", "d", "solid"], ["d", "e", "flow"], ["a", "e", "dashed"]],
  },
  "utap-campus-commerce": {
    nodes: [
      { id: "a", x: 60, y: 125, l: "Student card" }, { id: "b", x: 165, y: 125, l: "NFC app", hub: 1 }, { id: "c", x: 270, y: 70, l: "Paystack" }, { id: "d", x: 270, y: 180, l: "Supabase" }, { id: "e", x: 355, y: 125, l: "Vendors" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "flow"], ["b", "d", "flow"], ["c", "e", "solid"], ["d", "e", "solid"]],
  },
  "property-portfolio-rebuild": {
    nodes: [
      { id: "a", x: 60, y: 125, l: "Legacy site" }, { id: "b", x: 165, y: 125, l: "Content model", hub: 1, w: 110 }, { id: "c", x: 280, y: 125, l: "Next.js" }, { id: "d", x: 360, y: 125, l: "QA" },
      { id: "e", x: 165, y: 215, l: "Migration" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "solid"], ["c", "d", "flow"], ["e", "b", "dashed"]],
  },
  "cleverly-ai-grading": {
    nodes: [
      { id: "a", x: 55, y: 125, l: "Scripts" }, { id: "b", x: 145, y: 125, l: "OCR tiers" }, { id: "c", x: 240, y: 125, l: "Grader", hub: 1 }, { id: "d", x: 345, y: 70, l: "Rubric" }, { id: "e", x: 345, y: 180, l: "Teacher review" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "solid"], ["d", "c", "dashed"], ["c", "e", "flow"]],
  },
  "123tutors-platform": {
    nodes: [
      { id: "a", x: 60, y: 125, l: "Bubble" }, { id: "b", x: 190, y: 125, l: "Next.js", hub: 1 }, { id: "c", x: 310, y: 60, l: "Supabase" }, { id: "d", x: 310, y: 125, l: "AI tutor" }, { id: "e", x: 310, y: 190, l: "Paystack" },
    ],
    edges: [["a", "b", "solid"], ["b", "c", "flow"], ["b", "d", "flow"], ["b", "e", "flow"]],
  },
  "friends-of-cinema": {
    nodes: [
      { id: "a", x: 90, y: 125, l: "React + Vite", hub: 1 }, { id: "b", x: 220, y: 60, l: "Framer Motion" }, { id: "c", x: 220, y: 190, l: "Supabase" }, { id: "d", x: 340, y: 125, l: "Production" },
    ],
    edges: [["a", "b", "solid"], ["a", "c", "solid"], ["b", "d", "flow"], ["c", "d", "flow"]],
  },
};

function schematic(slug, opts) {
  const s = SCHEMATICS[slug];
  if (!s) return "";
  const byId = {};
  s.nodes.forEach((n) => (byId[n.id] = n));
  const edges = s.edges.map(([a, b, t]) => {
    const A = byId[a], B = byId[b];
    const cls = t === "solid" ? "edge solid" : t === "flow" ? "edge flow" : "edge";
    const mx = (A.x + B.x) / 2;
    return `<path class="${cls}" d="M${A.x} ${A.y} C ${mx} ${A.y}, ${mx} ${B.y}, ${B.x} ${B.y}"/>`;
  }).join("");
  const nodes = s.nodes.map((n) => {
    const w = n.w || Math.max(56, n.l.length * 7.2 + 18), h = 24;
    return `<g><rect class="node${n.hub ? " hub" : ""}" x="${n.x - w / 2}" y="${n.y - h / 2}" width="${w}" height="${h}" rx="12"/><text x="${n.x}" y="${n.y + 3.5}" text-anchor="middle">${n.l}</text>${n.hub ? `<circle class="dot beat" cx="${n.x + w / 2}" cy="${n.y - h / 2}" r="3"/>` : ""}</g>`;
  }).join("");
  const rings = '<circle class="ring" cx="200" cy="125" r="112"/><circle class="ring" cx="200" cy="125" r="160" opacity=".5"/>';
  return `<svg class="schematic" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid ${opts && opts.slice ? "slice" : "meet"}" role="img" aria-label="${esc(opts && opts.label || "System diagram")}">${rings}${edges}${nodes}</svg>`;
}

function esc(s) { return String(s).replace(/&(?!amp;|rarr;|ndash;|copy;|#)/g, "&amp;").replace(/"/g, "&quot;"); }

/* ------------------------------------------------------------------------ */
/* Shared chrome                                                             */
/* ------------------------------------------------------------------------ */
function head({ title, desc, url, rel, extra = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Rusumba Bukanga">
<meta name="theme-color" content="#0f161d">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="${rel}favicon.svg">
<link rel="apple-touch-icon" href="${rel}apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rusumba Bukanga">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/og-image.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${rel}assets/site.css">
${extra}
</head>
<body>
${MARK}
<a class="skip" href="#main">Skip to content</a>
<div id="progress"><i></i></div>
<div class="cursor-glow" aria-hidden="true"></div>`;
}

function header(rel, links) {
  const li = links.map((l) => `<li><a class="l" href="${l.href}">${l.label}</a></li>`).join("");
  const mli = links.map((l) => `<li><a class="l" href="${l.href}">${l.label}</a></li>`).join("");
  return `<header class="site"><div class="wrap">
<a class="brand" href="${rel}index.html"><svg aria-hidden="true"><use href="#mark"/></svg>Rusumba Bukanga</a>
<nav class="primary" aria-label="Primary"><ul>${li}<li><a class="btn btn-primary btn-sm" href="${rel}index.html#contact">Get in touch</a></li></ul></nav>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="mnav"><i></i><i></i><i></i></button>
</div></header>
<div class="mobile-nav" id="mnav"><ul>${mli}</ul><a class="btn btn-primary" href="${rel}index.html#contact">Get in touch</a></div>`;
}

function footer(rel) {
  return `<footer class="site"><div class="wrap">
<a class="brand" href="${rel}index.html"><svg aria-hidden="true"><use href="#mark"/></svg>Rusumba Bukanga</a>
<nav aria-label="Footer"><a href="${rel}work.html">Work</a><a href="${rel}index.html#resources">Resources</a><a href="https://www.linkedin.com/in/rusumba/" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/cicology" target="_blank" rel="noopener">GitHub</a><a href="mailto:herij46@gmail.com">herij46@gmail.com</a></nav>
<span>&copy; 2025&ndash;<span data-year>2026</span> Rusumba Bukanga, Johannesburg</span>
</div></footer>
<script src="${rel}assets/site.js" defer></script>
</body></html>`;
}

/* ------------------------------------------------------------------------ */
/* Tiles                                                                     */
/* ------------------------------------------------------------------------ */
const HOME_ORDER = ["cleverly-ai-grading", "alpha-sso-gateway", "123tutors-platform", "alpha-operations", "akur8-uat-runner", "tutor-vetting-automation", "claim-forms-modernisation", "friends-of-cinema", "utap-campus-commerce", "property-portfolio-rebuild"];
const BLURB = {
  "cleverly-ai-grading": "AI-assisted grading built to be trusted by teachers: rubric-aligned, evidence-linked, with a vendor-neutral provider layer.",
  "alpha-sso-gateway": "One login for every application across an insurance, hospitality and fitness group.",
  "123tutors-platform": "CTO of the tutoring platform: Bubble to Next.js migration, Supabase, and a Claude-powered AI tutor.",
  "alpha-operations": "CRMs, policy portals, bookings and an automated billing run for three very different businesses.",
  "akur8-uat-runner": "Bulk-validates an actuarial motor rating API before it ships. Solo build, in active use.",
  "tutor-vetting-automation": "KYC, biometrics and AML screening that turned a five-day manual review into a two-hour automated one.",
  "claim-forms-modernisation": "Hundreds of PDF claim forms rebuilt as browser-native flows with e-signature.",
  "friends-of-cinema": "A cinematic site for an independent film studio. Solo build, live in production.",
  "utap-campus-commerce": "Student ID cards as tap-to-pay, on React Native, NFC and Paystack.",
  "property-portfolio-rebuild": "A legacy property site migrated to Next.js with full content parity.",
};
const CAT_KEY = (cat) => {
  const c = cat.toLowerCase();
  const k = [];
  if (c.includes("ai")) k.push("ai");
  if (c.includes("identity") || c.includes("platform")) k.push("platform");
  if (c.includes("insur") || c.includes("fintech")) k.push("insurtech");
  if (c.includes("web") || c.includes("creative") || c.includes("mobile")) k.push("web");
  return k.join(" ") || "other";
};

function tile(p, i, rel, featured) {
  const art = p.figure
    ? `<img src="${rel}${p.figure.src}" alt="${esc(p.figure.alt)}" loading="lazy" width="1200" height="750"><div class="shade"></div>`
    : schematic(p.slug, { label: p.title + " system diagram", slice: false });
  const chips = p.stack.slice(0, 4).map((s) => `<span class="chip">${s}</span>`).join("");
  return `<a class="tile reveal${featured ? " featured" : ""}" data-d="${(i % 3) + 1}" data-cat="${CAT_KEY(p.cat)}" href="${rel}projects/${p.slug}.html">
<div class="tile-art">${art}<span class="badge">${p.meta.year}</span></div>
<div class="tile-body"><span class="eyebrow">${p.cat}</span><h3>${p.title}</h3><p>${BLURB[p.slug] || p.desc}</p><div class="chips">${chips}</div><span class="more">View case study <span class="arr">&rarr;</span></span></div></a>`;
}

/* ------------------------------------------------------------------------ */
/* Home                                                                      */
/* ------------------------------------------------------------------------ */
const HOME_LINKS = [
  { label: "What I build", href: "#build" }, { label: "Work", href: "#work" }, { label: "Experience", href: "#experience" }, { label: "Resources", href: "#resources" }, { label: "Contact", href: "#contact" },
];

function home() {
  const title = "Rusumba Bukanga | Full Stack Developer & AI Engineer, Johannesburg";
  const desc = "Rusumba Bukanga is a full stack developer and CTO in Johannesburg building AI products, authentication infrastructure and InsurTech systems for Cleverly AI, 123tutors and Alpha Group. Open to senior, lead and fractional CTO roles, remote or on site.";
  const ld = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Person", name: "Rusumba Bukanga", jobTitle: "Full Stack Developer, AI Engineer and CTO",
    description: desc, url: SITE + "/", image: hasPortrait ? SITE + "/assets/portrait.jpg" : SITE + "/og-image.jpg", email: "mailto:herij46@gmail.com", telephone: "+27799056758",
    address: { "@type": "PostalAddress", addressLocality: "Johannesburg", addressCountry: "ZA" },
    sameAs: ["https://www.linkedin.com/in/rusumba/", "https://github.com/cicology"],
    worksFor: [{ "@type": "Organization", name: "Alpha Insure" }, { "@type": "Organization", name: "123tutors", url: "https://123tutors.co.za" }, { "@type": "Organization", name: "Cleverly AI" }, { "@type": "Organization", name: "Oryares Solutions" }],
    knowsAbout: ["Full Stack Development", "AI Engineering", "LLM Integration", "AWS", "Authentication Systems", "InsurTech", "Application Security"],
  })}</script>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Rusumba Bukanga | Portfolio", url: SITE + "/" })}</script>`;

  const side = hasPortrait
    ? `<div class="orbit"><span class="ring"></span><span class="ring r2"></span><span class="ring r3"></span><img class="portrait" src="assets/portrait.jpg" alt="Rusumba Bukanga" width="320" height="320"><span class="tag t1">Full stack</span><span class="tag t2">AI engineering</span><span class="tag t3">CTO</span></div>`
    : `<div class="orbit"><span class="ring"></span><span class="ring r2"></span><span class="ring r3"></span><svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="url(#g)" stroke-width="1.6" stroke-linecap="round"><path d="M32 6l5 14 14 5-14 5-5 14-5-14-14-5 14-5z"/><path d="M32 39v14M12 50l14-9M52 50L38 41"/><circle cx="32" cy="56" r="3"/><circle cx="10" cy="52" r="3"/><circle cx="54" cy="52" r="3"/></g></svg><span class="tag t1">Full stack</span><span class="tag t2">AI engineering</span><span class="tag t3">CTO</span></div>`;

  const tiles = HOME_ORDER.slice(0, 6).map((slug, i) => tile(projects.find((p) => p.slug === slug), i, "", i === 0)).join("");

  const marquee = ["Next.js", "Node.js", "TypeScript", "Python and FastAPI", "AWS Lambda", "Cognito", "Claude and Bedrock", "RAG pipelines", "PostgreSQL and Supabase", "OAuth2 and SSO", "React Native", "Docker and CI/CD", "POPIA compliance", "InsurTech"];
  const track = marquee.concat(marquee).map((m) => `<span>${m}</span><i></i>`).join("");

  const stack = [
    ["Next.js and React", "4 years", 90], ["Node.js and Express", "3+ years", 85], ["TypeScript", "3 years", 85], ["Python and FastAPI", "4 years", 80],
    ["PostgreSQL and Supabase", "3 years", 80], ["AWS (Lambda, Cognito, KMS)", "2 years", 75], ["LLM integration (Claude, Bedrock)", "2 years", 75], ["Auth and identity (OAuth2, SSO)", "2 years", 75],
    ["Docker, CI/CD, Vercel, Render", "3 years", 75], ["GCP and Terraform", "1 year", 50], ["React Native and Expo", "1 year", 50], ["Security testing (Kali, Burp)", "2 years", 60],
  ].map(([n, y, w], i) => `<div class="row" style="--w:${w}%"><b>${n}</b><span>${y}</span><div class="bar"><i></i></div></div>`).join("");

  return head({ title, desc, url: SITE + "/", rel: "", extra: ld }) + header("", HOME_LINKS) + `
<main id="main">
<section id="hero" class="flush"><div class="bg"></div><canvas class="field" aria-hidden="true"></canvas><div class="wrap">
<div>
<span class="eyebrow hl"><i class="pulse"></i>Johannesburg / Open to senior, lead and fractional CTO roles</span>
<h1 class="hl">I build the systems companies trust with <em>money</em>, <em>students</em> and <em>members.</em></h1>
<p class="lead hl">Full stack engineer and CTO working across InsurTech, EdTech and AI, from centralised authentication to production LLM products. Engineering at Alpha Insure by day, building 123tutors, Cleverly AI and Oryares Solutions on my own.</p>
<div class="ctas hl"><a class="btn btn-primary" href="#work">View my work <span class="arr">&rarr;</span></a><a class="btn btn-ghost" href="Rusumba_Bukanga_2026_CV.pdf">Download CV</a></div>
<div class="hero-meta hl"><div><b>10</b><span>Systems shipped</span></div><div><b>3</b><span>Leadership roles</span></div><div><b>60%</b><span>Faster policy processing</span></div><div><b>2</b><span>Languages, EN and FR</span></div></div>
</div>
<div class="hero-side">${side}</div>
</div></section>

<div class="strip"><div class="wrap"><span class="lbl">Building for</span><span class="logo">Alpha Insure</span><span class="logo">123tutors</span><span class="logo">Cleverly AI</span><span class="logo">The 11th Floor</span><span class="logo">Body Action Gym</span><span class="logo">Oryares Solutions</span></div></div>

<section id="build" class="flush"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">01 / What I build</span><h2 class="words">Three kinds of work, <em>one standard.</em></h2><p>Engage a single discipline or the whole arc. Each is built for real constraints: compliance, tight margins and no room for downtime.</p></div>
<div class="grid3">
<div class="card reveal" data-d="1"><span class="icon">${ICON.shield}</span><span class="num">PILLAR 01</span><h3>Platform and identity</h3><ul><li>Centralised SSO and OAuth2/PKCE gateways</li><li>AWS Lambda, Cognito, KMS-signed tokens</li><li>Security hardening and dependency auditing</li><li>POPIA-aware architecture</li></ul></div>
<div class="card reveal" data-d="2"><span class="icon">${ICON.sparkles}</span><span class="num">PILLAR 02</span><h3>AI products</h3><ul><li>LLM features on Claude and Bedrock</li><li>Rubric-aligned grading with human review</li><li>RAG, embeddings and tiered OCR pipelines</li><li>Vendor-neutral provider layers and cost telemetry</li></ul></div>
<div class="card reveal" data-d="3"><span class="icon">${ICON.layers}</span><span class="num">PILLAR 03</span><h3>InsurTech and operations</h3><ul><li>CRMs, policy portals and booking systems</li><li>Actuarial pricing tooling and UAT automation</li><li>Claims, documents and e-signature flows</li><li>Billing runs and bank reconciliation on AWS</li></ul></div>
</div></div></section>

<section id="work"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">02 / Selected work</span><h2 class="words">A record of what each build <em>had to solve.</em></h2><p>Ten systems, each with the problem, the decisions and the result. Six below, the rest on the work page.</p></div>
<div class="tiles">${tiles}</div>
<div class="reveal" style="margin-top:32px;display:flex;justify-content:center"><a class="btn btn-ghost" href="work.html">All ten case studies <span class="arr">&rarr;</span></a></div>
</div></section>

<div class="marquee" aria-hidden="true"><div class="track">${track}</div></div>

<section id="experience" class="flush"><div class="wrap"><div class="grid2" style="gap:56px;align-items:start">
<div><div class="sec-head reveal"><span class="eyebrow">03 / Experience</span><h2 class="words">One full-time role, <em>three ventures of my own.</em></h2><p>Alpha Insure is my day job. The rest is what I build and own alongside it.</p></div>
<div class="ventures" style="grid-template-columns:1fr 1fr">
<div class="card reveal" data-d="1"><span class="role">Full-time</span><h3>Alpha Insure</h3><p>Full stack developer. SSO, CRMs, policy portals, booking and billing systems for an insurance group and its sister businesses.</p></div>
<div class="card reveal" data-d="2"><span class="role">CTO</span><h3>123tutors</h3><p>A tutoring platform migrated from Bubble to Next.js and extended with an AI tutor.</p></div>
<div class="card reveal" data-d="3"><span class="role">Co-founder and CTO</span><h3>Cleverly AI</h3><p>AI-assisted grading for schools and colleges, in private pilot.</p></div>
<div class="card reveal" data-d="4"><span class="role">Consultancy</span><h3>Oryares Solutions</h3><p>AI implementation, fractional CTO and product engineering, taken on selectively.</p></div>
</div></div>
<div class="timeline reveal"><span class="line"></span>
<div class="tl"><span class="pt"><i></i></span><span class="when">2026 to now</span><div class="body"><h3>Oryares Solutions</h3><div class="org">Founder, consultancy</div><p>AI implementation and fractional CTO work for small teams. Friends of Cinema delivered through the studio.</p></div></div>
<div class="tl"><span class="pt"><i></i></span><span class="when">Oct 2025 to now</span><div class="body"><h3>Cleverly AI</h3><div class="org">Co-founder and CTO</div><p>Architected the grading platform: Next.js, Express, Supabase, Claude with RAG, tiered OCR and cost telemetry. Director at board level.</p></div></div>
<div class="tl"><span class="pt"><i></i></span><span class="when">Aug 2025 to now</span><div class="body"><h3>123tutors</h3><div class="org">Chief Technology Officer</div><p>Led the Bubble to Next.js migration, a security review, and shipped the Claude-powered AI tutor.</p></div></div>
<div class="tl"><span class="pt"><i></i></span><span class="when">2025 to now</span><div class="body"><h3>Alpha Group</h3><div class="org">Full Stack Developer</div><p>SSO gateway, HR portal, underwriting CRMs, booking and membership platforms. Policy processing 60% faster, data-entry errors down 85%.</p></div></div>
<div class="tl"><span class="pt"><i></i></span><span class="when">Dec 2024 to Jul 2025</span><div class="body"><h3>Reflex Solutions</h3><div class="org">NOC Support Engineer, contract</div><p>24/7 enterprise network operations: FortiGate, F5, Cisco, PRTG, and Python automation for diagnostics.</p></div></div>
</div>
</div></div></section>

<section><div class="wrap"><div class="stats">
<div class="reveal" data-d="1"><b data-n="60" data-s="%">0</b><span>Faster policy processing</span><small>Alpha Insure underwriting flow</small></div>
<div class="reveal" data-d="2"><b data-n="85" data-s="%">0</b><span>Fewer data-entry errors</span><small>Alpha Insure CRM and portals</small></div>
<div class="reveal" data-d="3"><b data-n="10" data-s="">0</b><span>Systems shipped</span><small>Documented as case studies</small></div>
<div class="reveal" data-d="4"><b data-n="3" data-s="">0</b><span>Leadership roles</span><small>Two CTO seats and a studio</small></div>
</div></div></section>

<section id="resources"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">04 / Resources</span><h2 class="words">Everything a hiring manager <em>asks for.</em></h2><p>CV, code, profile and the stack, in one place.</p></div>
<div class="resources">
<a class="res reveal" data-d="1" href="Rusumba_Bukanga_2026_CV.pdf"><span class="icon">${ICON.file}</span><span><b>CV, 2026</b><span>PDF, full three-page version</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
<a class="res reveal" data-d="2" href="work.html"><span class="icon">${ICON.grid}</span><span><b>Case studies</b><span>Ten systems with decisions and results</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
<a class="res reveal" data-d="3" href="https://github.com/cicology" target="_blank" rel="noopener"><span class="icon">${ICON.github}</span><span><b>GitHub</b><span>github.com/cicology</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
<a class="res reveal" data-d="4" href="https://www.linkedin.com/in/rusumba/" target="_blank" rel="noopener"><span class="icon">${ICON.linkedin}</span><span><b>LinkedIn</b><span>linkedin.com/in/rusumba</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
<a class="res reveal" data-d="5" href="https://oryares-solutions-oryares.vercel.app/" target="_blank" rel="noopener"><span class="icon">${ICON.star}</span><span><b>Oryares Solutions</b><span>Fractional CTO and AI implementation</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
<a class="res reveal" data-d="6" href="mailto:herij46@gmail.com"><span class="icon">${ICON.mail}</span><span><b>Email</b><span>herij46@gmail.com</span></span><span class="arr">${ICON.arrowUpRight}</span></a>
</div>
<div class="sec-head reveal" style="margin-top:64px"><span class="eyebrow">Stack and years hands-on</span><p>Honest numbers. Where it says one year, it means one year.</p></div>
<div class="stack">${stack}</div>
</div></section>

<section id="contact" class="flush"><div class="wrap contact"><div class="reveal"><span class="eyebrow">05 / Get in touch</span><h2 class="words">Let us build something that has to <em>work.</em></h2>
<p class="lead">Open to senior and lead full stack, AI engineering, platform and identity roles, and fractional CTO engagements, remote or Johannesburg-based. Contract or full-time.</p>
<div class="links"><a class="btn btn-primary" href="mailto:herij46@gmail.com">Email me</a><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://www.linkedin.com/in/rusumba/">LinkedIn</a><a class="btn btn-ghost" target="_blank" rel="noopener" href="https://github.com/cicology">GitHub</a></div>
<p class="muted" style="margin-top:22px;font-size:14px">+27 79 905 6758 / Johannesburg, South Africa / English and French</p></div>
<form class="cf reveal" data-d="2"><label>Name<input name="n" required autocomplete="name"></label><label>Work email<input type="email" name="e" required autocomplete="email"></label><label>What do you need?<textarea name="m" required></textarea></label><button class="btn btn-primary" type="submit">Send message</button></form></div></section>
</main>` + footer("");
}

/* ------------------------------------------------------------------------ */
/* Work                                                                      */
/* ------------------------------------------------------------------------ */
const PAGE_LINKS = [
  { label: "Home", href: "index.html" }, { label: "Work", href: "work.html" }, { label: "Experience", href: "index.html#experience" }, { label: "Resources", href: "index.html#resources" }, { label: "Contact", href: "index.html#contact" },
];
function work() {
  const title = "Work | Rusumba Bukanga | Ten case studies";
  const desc = "Ten systems shipped across AI, platform and identity, InsurTech and web: the problem, the decisions and the result for each.";
  const tiles = HOME_ORDER.map((slug, i) => tile(projects.find((p) => p.slug === slug), i, "", false)).join("");
  return head({ title, desc, url: SITE + "/work.html", rel: "" }) + header("", PAGE_LINKS) + `
<main id="main">
<section id="proj-hero"><div class="wrap">
<a class="proj-back" href="index.html">&larr; Home</a>
<span class="eyebrow" style="display:block;margin-top:24px">The work</span>
<h1 class="proj-title words" style="max-width:22ch">Ten systems shipped, <em>and how each one actually went.</em></h1>
<p class="lead">Not a wall of screenshots. Real problems, real constraints, and what I architected, built, or collaborated on to solve them. Where a build was a team effort, it says so.</p>
</div></section>
<section class="flush" style="padding-top:0"><div class="wrap">
<div class="filters" role="group" aria-label="Filter case studies"><button data-f="all" aria-pressed="true">All work</button><button data-f="ai" aria-pressed="false">AI engineering</button><button data-f="platform" aria-pressed="false">Platform and identity</button><button data-f="insurtech" aria-pressed="false">InsurTech and FinTech</button><button data-f="web" aria-pressed="false">Web and mobile</button></div>
<div class="tiles">${tiles}</div>
</div></section>
<section><div class="wrap proj-next"><div><span class="eyebrow">Next step</span><h2 style="font-size:clamp(30px,4vw,48px);margin-top:12px">Want the full story on one of these?</h2></div><a class="btn btn-primary" href="index.html#contact">Work with me <span class="arr">&rarr;</span></a></div></section>
</main>` + footer("");
}

/* ------------------------------------------------------------------------ */
/* Case studies                                                              */
/* ------------------------------------------------------------------------ */
const PROJ_LINKS = [
  { label: "Home", href: "../index.html" }, { label: "Work", href: "../work.html" }, { label: "Resources", href: "../index.html#resources" }, { label: "Contact", href: "../index.html#contact" },
];
function cleanBody(html) {
  // section ids for the table of contents
  let i = 0;
  const ids = ["project", "what-i-did", "result"];
  return html.replace(/<h2>/g, () => `<h2 id="${ids[i++] || "s" + i}">`)
    .replace(/cleverly\.co\.za/g, "Cleverly")
    .replace(/\s—\s/g, ", ").replace(/—/g, ", ");
}
function project(p) {
  const title = `${p.title} | Case study | Rusumba Bukanga`;
  const desc = p.desc || BLURB[p.slug];
  const nextP = projects.find((x) => x.slug === p.next);
  const meta = Object.entries(p.meta).map(([k, v]) => {
    let val = v;
    if (p.slug === "cleverly-ai-grading" && k === "status") val = "Private pilot";
    return `<div class="meta-block"><span class="meta-label">${k[0].toUpperCase() + k.slice(1)}</span><span class="meta-value">${val}</span></div>`;
  }).join("");
  const cover = p.figure
    ? `<figure class="proj-cover reveal"><div class="bar"><i></i><i></i><i></i><span>${esc(p.figure.caption)}</span></div><img src="../${p.figure.src}" alt="${esc(p.figure.alt)}" loading="eager" width="1200" height="750"></figure>`
    : `<figure class="proj-cover reveal"><div class="bar"><i></i><i></i><i></i><span>System overview</span></div>${schematic(p.slug, { label: p.title + " system diagram", slice: false })}</figure>`;
  const stack = p.stack.map((s) => `<span class="chip">${s}</span>`).join("");
  const ld = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: desc, author: { "@type": "Person", name: "Rusumba Bukanga", url: SITE + "/" }, url: `${SITE}/projects/${p.slug}.html`, dateCreated: p.meta.year })}</script>`;
  return head({ title, desc, url: `${SITE}/projects/${p.slug}.html`, rel: "../", extra: ld }) + header("../", PROJ_LINKS) + `
<main id="main">
<section id="proj-hero"><div class="wrap">
<a class="proj-back" href="../work.html">&larr; All work</a>
<span class="eyebrow" style="display:block;margin-top:24px">${p.cat}</span>
<h1 class="proj-title words">${p.title}</h1>
<div class="proj-meta reveal">${meta}</div>
<div class="chips reveal" data-d="1">${stack}</div>
</div></section>
<section class="flush" style="padding-top:0"><div class="wrap">
${cover}
<div class="proj-layout">
<article class="proj-body reveal">${cleanBody(p.body)}</article>
<aside class="proj-side">
<div class="card reveal" data-d="1"><h4>On this page</h4><ul class="toc"><li><a href="#project">The project</a></li><li><a href="#what-i-did">What I did</a></li><li><a href="#result">Where it landed</a></li></ul></div>
<div class="card reveal" data-d="2"><h4>Work with me</h4><p class="muted" style="font-size:14px;margin-bottom:14px">Senior, lead and fractional CTO engagements, remote or Johannesburg.</p><a class="btn btn-primary btn-sm" href="../index.html#contact">Get in touch</a></div>
</aside>
</div>
</div></section>
<section><div class="wrap proj-next">
<a href="${p.next}.html" class="next-link"><span class="next-label">Next project</span>${nextP ? nextP.title : p.nextLabel} &rarr;</a>
<a href="../work.html" class="btn btn-ghost">All case studies</a>
</div></section>
</main>` + footer("../");
}

/* ------------------------------------------------------------------------ */
fs.writeFileSync(path.join(ROOT, "index.html"), home());
fs.writeFileSync(path.join(ROOT, "work.html"), work());
projects.forEach((p) => fs.writeFileSync(path.join(ROOT, "projects", p.slug + ".html"), project(p)));
console.log("built index.html, work.html and", projects.length, "case studies" + (hasPortrait ? " (with portrait)" : " (no portrait yet: add assets/portrait.jpg)"));
