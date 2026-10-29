"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LOAD } from "@/content/site";
import { Chapter } from "./Chapter";
import s from "./Load.module.css";

/**
 * Three words, each the width of the column, each arriving as the reader
 * reaches it. The structure behind is at its base here; the packets are
 * the load. The cobalt underline is the only colour on the page.
 */
export function Load() {
  const reduce = useReducedMotion();
  return (
    <Chapter id="load" numeral={LOAD.numeral} title={LOAD.title} intro={LOAD.intro}>
      <ol className={s.list}>
        {LOAD.items.map((it, i) => (
          <motion.li
            key={it.word}
            className={s.item}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            <div className={s.wordRow}>
              <span className={`display display-l ${s.word}`}>{it.word}</span>
              <motion.span
                className={s.bar}
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.05 }}
              />
            </div>
            <p className={`text ${s.body}`}>{it.body}</p>
            <p className={`text-s ${s.where}`}>{it.where}</p>
          </motion.li>
        ))}
      </ol>
    </Chapter>
  );
}
