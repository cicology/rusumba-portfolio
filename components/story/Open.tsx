import { OPEN, SITE } from "@/content/site";
import s from "./Open.module.css";

export function Open() {
  return (
    <section id="open" className={s.open} aria-labelledby="open-title">
      <div className={`wrap ${s.inner}`}>
        <div className={s.head}>
          <span className={`numeral ${s.numeral}`} aria-hidden>{OPEN.numeral}</span>
          <h2 id="open-title" className={`display display-l ${s.title}`}>{OPEN.headline}</h2>
          <p className={`text-l ${s.body}`}>{OPEN.body}</p>
        </div>
        <ul className={s.links}>
          {OPEN.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className={s.link} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener" : undefined}>
                <span className={s.linkLabel}>{l.label}</span>
                <span className={s.linkValue}>{l.value}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={`text-s ${s.foot}`}>{SITE.phone}. {SITE.location}. English and French.</p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.footRow}`}>
        <span>{SITE.name}</span>
        <nav aria-label="Footer" className={s.footNav}>
          <a href="/work">Work</a>
          <a href={SITE.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={SITE.github} target="_blank" rel="noopener">GitHub</a>
          <a href={SITE.oryares} target="_blank" rel="noopener">Oryares Solutions</a>
        </nav>
        <span className="text-s">2025 to {new Date().getFullYear()}, Johannesburg</span>
      </div>
    </footer>
  );
}
