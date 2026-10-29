import raw from "@/content/projects.json";
import { RECORD } from "@/content/site";

export interface Project {
  slug: string;
  title: string;
  cat: string;
  meta: { role: string; client: string; year: string; status: string };
  stack: string[];
  /** Trusted HTML authored in content/projects.json (our own case-study copy). */
  body: string;
  figure: { src: string; alt: string; caption: string } | null;
  next: string;
  nextLabel: string;
  pageTitle: string;
  desc: string;
  summary: string;
}

const list = (raw as Omit<Project, "summary">[]).map((p) => ({
  ...p,
  figure: p.figure ? { ...p.figure, src: "/" + p.figure.src.replace(/^\/?/, "") } : null,
  summary: RECORD.summaries[p.slug] ?? "",
}));

const bySlug = new Map(list.map((p) => [p.slug, p]));

export const projects: Project[] = RECORD.order.map((s) => bySlug.get(s)!).filter(Boolean);

export function getProject(slug: string) {
  return bySlug.get(slug) ?? null;
}

export const slugs = projects.map((p) => p.slug);
