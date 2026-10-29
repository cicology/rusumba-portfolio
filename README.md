# Rusumba Bukanga, portfolio

Personal site for Rusumba Bukanga, AI product engineer and CTO in Johannesburg. Live at rusumba-portfolio.vercel.app (Vercel, team `oryares`, auto-deploys from `main`).

## The idea

One story in five chapters, read against one structure. The structure is a mine headgear, Johannesburg's own tower, drawn as a wire lattice in WebGL with the "load" (cobalt packets) moving along its members. Each chapter is a camera stop:

| Chapter | Camera | What it says |
| --- | --- | --- |
| Hero | three-quarter, wide | Systems that carry weight |
| I The load | low, at the base | money, students, members |
| II The structure | side, part lit in cobalt | platform and identity, operations, AI |
| III The record | high, looking down, plates slide sideways | ten case studies |
| IV The person | from behind the back legs | path, facts, honest years |
| V Open | top-down on the sheave wheel | contact |

Design tokens live in `app/globals.css`: paper, ink, one cobalt accent, one typeface (Bricolage Grotesque, self-hosted, variable width and optical size).

## Stack

Next.js 16 (App Router), React 19, three.js with React Three Fiber, Framer Motion for DOM motion, Lenis for smooth scroll. No CSS framework; CSS modules and a small set of global primitives.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Where things are

- `content/site.ts` all copy for the story pages
- `content/projects.json` the ten case studies (role, client, year, status, stack, body HTML)
- `components/scene/tower.ts` procedural headgear graph (nodes, members, parts)
- `components/scene/Scene.tsx` canvas, line drawing, packets, camera rig
- `components/story/*` the chapters
- `app/work` index and `app/work/[slug]` case-study pages
- `lib/scroll.ts` shared scroll state between the DOM and the canvas

## Behaviour

- Reduced motion: no smooth scroll, no packets, static camera, horizontal record becomes a list.
- Small screens: the camera pulls back and centres the structure; fewer packets; lower DPR.
- The WebGL scene loads client-side after the text, so the page reads without it.

## Still to do

- Custom domain: update `SITE.url` in `content/site.ts`.
- Case-study screenshots for the entries that use the drawn plate.
- `123tutors-platform` lists AWS Bedrock in its stack; confirm that is the live provider or change it to Claude.
