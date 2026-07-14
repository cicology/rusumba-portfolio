# rusumba.dev — Portfolio

Personal portfolio site for **Rusumba Bukanga** — Full Stack Developer, AI Engineer, and CTO (Cleverly AI, 123tutors, Alpha Group, uTap). Johannesburg, South Africa.

**Design language:** blueprint/schematic engineering aesthetic — graph-paper grid, animated system diagrams, amber signal accents, monospace labels. Structured on the AIDA framework (Attention → Interest → Desire → Action).

## Stack

Single-file static site. No build step, no framework, no dependencies.

- `index.html` — everything: markup, styles, scripts
- `robots.txt` + `sitemap.xml` — SEO
- `favicon.svg` — browser tab icon

## ⚠️ Still needed before deploy

- `og-image.jpg` — social share card (was generated earlier in the Claude session; download it from the chat and drop it in this folder)
- `apple-touch-icon.png` — same as above
- `Rusumba_Bukanga_2026_CV_1Page.pdf` — **use the latest version** (includes Akur8, team-collaboration framing, Friends of Cinema). The one in Downloads dated July 1 is outdated.

## Features

- Interactive hero schematic (hover or click any node) with animated draw-in and data packets
- Custom cursor, live Johannesburg clock, scrolling marquee, full-screen contact overlay
- Lane filter (AI Engineering / Platform & Identity / InsurTech & FinTech / Leadership & Cofounding)
- 10 case studies: Cleverly AI, Alpha SSO Gateway, 123tutors migration + AI Tutor, Alpha operations, Claim Forms Modernisation, property site rebuild, tutor vetting automation, uTap, Friends of Cinema, Akur8 UAT Runner
- JSON-LD structured data, Open Graph + Twitter cards, canonical URL
- `prefers-reduced-motion` respected; keyboard focus states throughout

## Setup before going live

1. **Google Tag Manager** — replace `GTM-XXXXXXX` in `index.html` (2 places).
2. **Meta Pixel** — replace `YOUR_PIXEL_ID`.
3. **Domain** — update canonical/OG URLs from the `rusumbabukanga.com` placeholder.
4. **CV link** — confirm `/Rusumba_Bukanga_2026_CV_1Page.pdf` matches the file you deploy.

## Deploy

**Vercel:** `npx vercel` from the repo root, or connect the repo at vercel.com.
**Netlify:** drag the folder onto app.netlify.com/drop, or connect the repo.
