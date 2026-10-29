"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { STRUCTURE } from "@/content/site";
import { scrollState } from "@/lib/scroll";
import { Chapter } from "./Chapter";
import s from "./Structure.module.css";

type Key = (typeof STRUCTURE.parts)[number]["key"];

/**
 * Three parts of the tower, three kinds of work. Selecting one lights that
 * part of the structure in cobalt and moves the camera to it. Works with a
 * pointer, with keyboard focus, and by scrolling on small screens.
 */
export function Structure() {
  const [active, setActive] = useState<Key>("foundation");
  const reduce = useReducedMotion();

  useEffect(() => {
    scrollState.focus = active;
    return () => { scrollState.focus = null; };
  }, [active]);

  const part = STRUCTURE.parts.find((p) => p.key === active)!;

  return (
    <Chapter id="structure" numeral={STRUCTURE.numeral} title={STRUCTURE.title} intro={STRUCTURE.intro}>
      <div className={s.panel}>
        <div className={s.tabs} role="tablist" aria-label="Kinds of work">
          {STRUCTURE.parts.map((p) => {
            const on = p.key === active;
            return (
              <button
                key={p.key}
                role="tab"
                id={`tab-${p.key}`}
                aria-selected={on}
                aria-controls={`panel-${p.key}`}
                className={`${s.tab} ${on ? s.on : ""}`}
                onPointerEnter={() => setActive(p.key)}
                onFocus={() => setActive(p.key)}
                onClick={() => setActive(p.key)}
              >
                <span className={s.place}>{p.place}</span>
                <span className={`display-s ${s.tabName}`}>{p.name}</span>
                <span className={s.tabMarker} aria-hidden />
              </button>
            );
          })}
        </div>

        <div className={s.detail}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={part.key}
              id={`panel-${part.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${part.key}`}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className={`text ${s.body}`}>{part.body}</p>
              <ul className={s.caps}>
                {part.capabilities.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <Link href={`/work/${part.study}`} className={s.study}>
                See it in a case study
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Chapter>
  );
}
