import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/story/Header";
import { Footer } from "@/components/story/Open";
import { getProject, projects, slugs } from "@/lib/projects";
import s from "../work.module.css";

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary || p.desc,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.pageTitle, description: p.summary || p.desc, images: p.figure ? [{ url: p.figure.src }] : undefined },
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const index = projects.findIndex((x) => x.slug === p.slug);

  return (
    <>
      <Header story={false} />
      <main id="main" className={s.study}>
        <article className="wrap">
          <header className={s.studyHead}>
            <div>
              <p className={s.crumb}>
                <Link href="/work">The record</Link>
                <span aria-hidden>/</span>
                <span className="tabular">{String(index + 1).padStart(2, "0")} of {projects.length}</span>
              </p>
              <h1 className={`display display-l ${s.studyTitle}`}>{p.title}</h1>
              <p className={s.cat}>{p.cat}</p>
            </div>
            <dl className={s.facts}>
              <div><dt>Role</dt><dd>{p.meta.role}</dd></div>
              <div><dt>Client</dt><dd>{p.meta.client}</dd></div>
              <div><dt>Year</dt><dd>{p.meta.year}</dd></div>
              <div><dt>Status</dt><dd>{p.meta.status}</dd></div>
            </dl>
          </header>

          {p.figure && (
            <figure className={s.figure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.figure.src} alt={p.figure.alt} width={1200} height={750} />
              <figcaption>{p.figure.caption}</figcaption>
            </figure>
          )}

          <div className={s.studyBody}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.body }} />
            <aside className={s.stack}>
              <h2>Stack</h2>
              <ul className={s.chips}>{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
            </aside>
          </div>

          <nav className={s.next} aria-label="Next case study">
            <span className={s.nextLabel}>Next in the record</span>
            <Link href={`/work/${p.next}`} className={s.nextLink}>{p.nextLabel}</Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
