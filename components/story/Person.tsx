import Image from "next/image";
import { PERSON, STACK } from "@/content/site";
import { Chapter } from "./Chapter";
import s from "./Person.module.css";

export function Person() {
  return (
    <Chapter id="person" numeral={PERSON.numeral} title={PERSON.title} intro={PERSON.intro}>
      <div className={s.layout}>
        <figure className={s.portrait}>
          <Image src="/assets/portrait.jpg" alt="Rusumba Bukanga" width={320} height={320} sizes="(max-width: 720px) 160px, 240px" priority={false} />
          <figcaption className="text-s">Rusumba Bukanga, Johannesburg</figcaption>
        </figure>

        <ol className={s.path} aria-label="Path so far">
          {PERSON.path.map((p) => (
            <li key={p.when + p.what} className={s.step}>
              <span className={`tabular ${s.when}`}>{p.when}</span>
              <span className={s.what}>{p.what}</span>
              <span className={`text-s ${s.role}`}>{p.role}</span>
            </li>
          ))}
        </ol>

        <dl className={s.facts}>
          {PERSON.facts.map((f) => (
            <div key={f.label} className={s.fact}>
              <dt className="text-s">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className={s.stack}>
          <h3 className={`display-s ${s.stackTitle}`}>Hands-on years, honestly counted</h3>
          <p className="text-s">Where it says one year, it means one year.</p>
          <ul className={s.rows}>
            {STACK.map((r) => (
              <li key={r.name} className={s.row}>
                <span className={s.rowName}>{r.name}</span>
                <span className={s.rowBar} aria-hidden><i style={{ width: `${r.w}%` }} /></span>
                <span className={`tabular ${s.rowYears}`}>{r.years}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}
