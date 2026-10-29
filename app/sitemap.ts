import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { slugs } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/work`, lastModified: now, priority: 0.8 },
    ...slugs.map((s) => ({ url: `${SITE.url}/work/${s}`, lastModified: now, priority: 0.6 })),
  ];
}
