"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAPTERS, SITE } from "@/content/site";
import { scrollState, subscribe } from "@/lib/scroll";
import s from "./Header.module.css";

export function Header({ story = true }: { story?: boolean }) {
  const [active, setActive] = useState(-1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!story) {
      const on = () => setScrolled(window.scrollY > 24);
      on();
      window.addEventListener("scroll", on, { passive: true });
      return () => window.removeEventListener("scroll", on);
    }
    let last = -2;
    let lastScrolled = false;
    return subscribe(() => {
      if (scrollState.chapter !== last) { last = scrollState.chapter; setActive(last); }
      const sc = scrollState.y > 24;
      if (sc !== lastScrolled) { lastScrolled = sc; setScrolled(sc); }
    });
  }, [story]);

  return (
    <header className={`${s.header} ${scrolled ? s.scrolled : ""}`}>
      <div className={`wrap ${s.row}`}>
        <Link href="/" className={s.name}>
          <span className={s.mark} aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 21 12 3l8 18M7.2 14h9.6M5.6 18h12.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          </span>
          {SITE.name}
        </Link>
        {story ? (
          <nav className={s.chapters} aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <a key={c.id} href={`#${c.id}`} className={`${s.ch} ${active === i ? s.on : ""}`} aria-current={active === i ? "location" : undefined}>
                <span className={s.chNum}>{c.numeral}</span>
                <span className={s.chTitle}>{c.title}</span>
              </a>
            ))}
          </nav>
        ) : (
          <nav className={s.chapters} aria-label="Site">
            <Link href="/#record" className={s.ch}><span className={s.chTitle}>The record</span></Link>
            <Link href="/work" className={s.ch}><span className={s.chTitle}>All work</span></Link>
          </nav>
        )}
        <a className={`btn ${s.cta}`} href={story ? "#open" : "/#open"}>Get in touch</a>
      </div>
    </header>
  );
}
