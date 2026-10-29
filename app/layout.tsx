import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/content/site";
import "./globals.css";

const bricolage = localFont({
  src: [{ path: "./fonts/bricolage-grotesque-latin-standard-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | Rusumba Bukanga" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_ZA",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: ["/og-image.jpg"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#e9e8e2", width: "device-width", initialScale: 1 };

const PERSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rusumba Bukanga",
  jobTitle: "AI Product Engineer and CTO",
  description: SITE.description,
  url: SITE.url,
  image: `${SITE.url}/assets/portrait.jpg`,
  email: `mailto:${SITE.email}`,
  telephone: SITE.phone.replace(/\s/g, ""),
  address: { "@type": "PostalAddress", addressLocality: "Johannesburg", addressCountry: "ZA" },
  sameAs: [SITE.linkedin, SITE.github],
  worksFor: [
    { "@type": "Organization", name: "Alpha Insure" },
    { "@type": "Organization", name: "123tutors", url: "https://123tutors.co.za" },
    { "@type": "Organization", name: "Cleverly AI" },
    { "@type": "Organization", name: "Oryares Solutions" },
  ],
  knowsAbout: ["Full Stack Development", "AI Engineering", "LLM Integration", "AWS", "Authentication Systems", "InsurTech", "Application Security"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} style={{ ["--font" as string]: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif" }}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_LD) }} />
      </body>
    </html>
  );
}
