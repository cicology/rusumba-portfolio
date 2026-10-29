import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/story/Header";
import { Footer } from "@/components/story/Open";
import { projects } from "@/lib/projects";
import s from "./work.module.css";

export const metadata: Metadata = {
  title: "Work",
  description: "Ten systems built by Rusumba Bukanga: AI grading, SSO gateways, insurance operations, tutoring platforms and more, each with the problem, the decisions and the result.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <>
      <Header story={false} />
      <main id="main" className={s.page}>
        <div className="wrap">
          <header className={s.head}>
            <h1 className="display display-l">The record, in full.</h1>
            <p className="text-l">Ten systems. Each entry says what it had to solve, what was decided, and where it landed. Role and credit are as they happened.</p>
          </header>
          <ol className={s.list}>
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className={s.row}>
                  <span className={`tabular ${s.index}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.main}>
                    <span className={`display-s ${s.title}`}>{p.title}</span>
                    <span className={`text-s ${s.summary}`}>{p.summary}</span>
                  </span>
                  <span className={s.side}>
                    <span>{p.cat}</span>
                    <span>{p.meta.role}</span>
                    <span className="tabular">{p.meta.year}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
