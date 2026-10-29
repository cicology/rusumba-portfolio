import type { ReactNode } from "react";
import s from "./Chapter.module.css";

/**
 * A chapter is a camera stop. The numeral and title sit in a sticky rail on
 * the left while the chapter's content scrolls past the structure.
 */
export function Chapter({ id, numeral, title, intro, children, tall }: { id: string; numeral: string; title: string; intro: string; children: ReactNode; tall?: boolean }) {
  return (
    <section id={id} className={`${s.chapter} ${tall ? s.tall : ""}`} aria-labelledby={`${id}-title`}>
      <div className={`wrap ${s.inner}`}>
        <header className={s.rail}>
          <div className={s.railStick}>
            <span className={`numeral ${s.numeral}`} aria-hidden>{numeral}</span>
            <h2 id={`${id}-title`} className={`display-s ${s.title}`}>{title}</h2>
            <p className={`text ${s.intro}`}>{intro}</p>
          </div>
        </header>
        <div className={s.body}>{children}</div>
      </div>
    </section>
  );
}
