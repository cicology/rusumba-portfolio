"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { RECORD } from "@/content/site";
import type { Project } from "@/lib/projects";
import { Chapter } from "./Chapter";
import s from "./Record.module.css";

/**
 * Ten plates on a rail. On wide screens the rail is pinned and scrolling the
 * page moves it sideways, so the whole record is read in one gesture while
 * the structure drifts behind. On small screens, and with reduced motion,
 * it is a plain vertical list.
 */
export function Record({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const on = () => setWide(mq.matches && !reduce);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  useEffect(() => {
    if (!wide) return;
    const measure = () => {
      const t = track.current;
      if (!t) return;
      setShift(Math.max(0, t.scrollWidth - window.innerWidth + 2 * parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter"))));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [wide, projects.length]);

  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);

  const list = (
    <div className={`${s.track} ${wide ? s.trackWide : ""}`} ref={track}>
      {projects.map((p, i) => (
        <Plate key={p.slug} p={p} i={i} />
      ))}
      <div className={s.endCap}>
        <p className="text">That is the record so far. Each one is written up with the problem, the decisions and the result.</p>
        <Link href="/work" className="btn">Browse all ten</Link>
      </div>
    </div>
  );

  return (
    <Chapter id="record" numeral={RECORD.numeral} title={RECORD.title} intro={RECORD.intro} tall={wide}>
      {wide ? (
        <div className={s.pinWrap} ref={pin} style={{ height: `calc(100vh + ${shift}px)` }}>
          <div className={s.sticky}>
            <motion.div style={{ x }} className={s.mover}>{list}</motion.div>
          </div>
        </div>
      ) : (
        list
      )}
    </Chapter>
  );
}

function Plate({ p, i }: { p: Project; i: number }) {
  return (
    <Link href={`/work/${p.slug}`} className={s.plate}>
      <div className={s.plateTop}>
        <span className={`tabular ${s.index}`}>{String(i + 1).padStart(2, "0")}</span>
        <span className={s.cat}>{p.cat}</span>
      </div>
      <div className={s.art} aria-hidden>
        {p.figure ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.figure.src} alt="" loading="lazy" width={640} height={400} />
        ) : (
          <Glyph seed={i} />
        )}
      </div>
      <h3 className={`display-s ${s.plateTitle}`}>{p.title}</h3>
      <p className={`text-s ${s.summary}`}>{p.summary}</p>
      <div className={s.meta}>
        <span>{p.meta.role}</span>
        <span className="tabular">{p.meta.year}</span>
      </div>
    </Link>
  );
}

/** A small, deterministic truss drawing so every plate has an image. */
function Glyph({ seed }: { seed: number }) {
  const cols = 6, rows = 3;
  const w = 320, h = 200, pad = 18;
  const cw = (w - pad * 2) / cols, rh = (h - pad * 2) / rows;
  const lines: string[] = [];
  for (let r = 0; r <= rows; r++) lines.push(`M${pad} ${pad + r * rh}H${w - pad}`);
  for (let c = 0; c <= cols; c++) lines.push(`M${pad + c * cw} ${pad}V${h - pad}`);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const flip = ((r * 7 + c * 3 + seed * 5) % 3) === 0;
      const x = pad + c * cw, y = pad + r * rh;
      lines.push(flip ? `M${x} ${y}L${x + cw} ${y + rh}` : `M${x + cw} ${y}L${x} ${y + rh}`);
    }
  const dots = Array.from({ length: 5 }, (_, k) => {
    const c = (seed * 3 + k * 5) % (cols + 1), r = (seed + k * 2) % (rows + 1);
    return [pad + c * cw, pad + r * rh];
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={s.glyph}>
      <path d={lines.join("")} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      {dots.map(([x, y], k) => <circle key={k} cx={x} cy={y} r="3.2" fill="var(--cobalt)" />)}
    </svg>
  );
}
