import { HERO } from "@/content/site";
import s from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={s.hero} aria-labelledby="hero-title">
      <div className={`wrap ${s.inner}`}>
        <p className={`${s.kicker} ${s.in}`} style={{ animationDelay: "60ms" }}>{HERO.kicker}</p>
        <h1 id="hero-title" className={`display display-xl ${s.title}`}>
          {HERO.headline.map((line, i) => (
            <span key={line} className={s.lineClip}>
              <span className={s.line} style={{ animationDelay: `${140 + i * 110}ms` }}>{line}</span>
            </span>
          ))}
        </h1>
        <div className={s.below}>
          <p className={`text-l ${s.lead} ${s.in}`} style={{ animationDelay: "420ms" }}>{HERO.lead}</p>
          <div className={`${s.ctas} ${s.in}`} style={{ animationDelay: "520ms" }}>
            <a className="btn btn-fill" href={HERO.primary.href}>{HERO.primary.label}</a>
            <a className="btn" href={HERO.secondary.href}>{HERO.secondary.label}</a>
          </div>
          <p className={`text-s ${s.status} ${s.in}`} style={{ animationDelay: "620ms" }}>
            <span className={s.dot} aria-hidden />
            {HERO.status}
          </p>
        </div>
      </div>
      <a href="#load" className={s.scrollCue} aria-label="Scroll to chapter one">
        <span className={s.cueLine} aria-hidden />
        <span>Chapter I</span>
      </a>
    </section>
  );
}
