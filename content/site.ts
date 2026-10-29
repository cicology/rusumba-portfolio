/* ===========================================================================
   Rusumba Bukanga, portfolio content

   One idea runs through the site: load-bearing systems. Insurance billing,
   a student's grade, a member's debit order. The 3D scene is a lattice
   tower (a mine headgear, Johannesburg's own structure) carrying traffic.
   Every chapter below is a camera stop on that tower.

   Copy rules: plain English, no em dashes, no NDA figures, shared credit
   where the work was shared. Nothing here is a claim Rusumba cannot stand
   behind in an interview.
   =========================================================================== */

export const SITE = {
  name: "Rusumba Bukanga",
  url: "https://rusumba-portfolio.vercel.app",
  title: "Rusumba Bukanga | AI product engineer and CTO, Johannesburg",
  description:
    "Rusumba Bukanga builds the systems companies trust with money, students and members: insurance operations, identity gateways and production AI products. CTO at 123tutors and Cleverly AI, engineer at Alpha Insure. Open to senior, lead and fractional CTO roles, remote or on site.",
  email: "herij46@gmail.com",
  phone: "+27 79 905 6758",
  location: "Johannesburg, South Africa",
  linkedin: "https://www.linkedin.com/in/rusumba/",
  github: "https://github.com/cicology",
  cv: "/Rusumba_Bukanga_2026_CV.pdf",
  oryares: "https://oryares.solutions/",
} as const;

export const HERO = {
  kicker: "Rusumba Bukanga, Johannesburg",
  headline: ["Systems that", "carry weight."],
  lead: "I build the software companies trust with money, students and members. Insurance operations, identity gateways and AI products that have to work on a Monday morning, not just in the demo.",
  status: "Open to senior, lead and fractional CTO roles. Remote, or on site in Johannesburg, Dubai, London or the US.",
  primary: { label: "Read the work", href: "#record" },
  secondary: { label: "Download the CV", href: SITE.cv },
} as const;

/* Chapter I: what rests on the structure */
export const LOAD = {
  numeral: "I",
  title: "The load",
  intro:
    "Every system I have shipped has someone depending on it who will never see the code. That is the brief I design for.",
  items: [
    {
      word: "Money",
      body: "An insurance group's underwriting flow, policy portals, a monthly debit-order run and the bank reconciliation behind it. If the run is wrong, real people are charged wrong.",
      where: "Alpha Group, 2025 to now",
    },
    {
      word: "Students",
      body: "A tutoring marketplace with an AI tutor on call at 11pm, and a grading platform where a teacher has to trust every mark it suggests. A wrong grade is not a bug, it is someone's year.",
      where: "123tutors and Cleverly AI",
    },
    {
      word: "Members",
      body: "A gym's memberships and a restaurant's bookings, running on the same operations layer as the insurer. Small businesses with no tolerance for downtime and no engineering team of their own.",
      where: "Body Action Gym, The 11th Floor",
    },
  ],
} as const;

/* Chapter II: the three kinds of work, mapped to the tower */
export const STRUCTURE = {
  numeral: "II",
  title: "The structure",
  intro:
    "Three kinds of work, and I do all three on the same system. The foundation keeps people out, the frame keeps the business running, the head is where the AI sits.",
  parts: [
    {
      key: "foundation",
      name: "Platform and identity",
      place: "Foundation",
      body: "Central SSO and OAuth2 with PKCE on Cognito, KMS-signed tokens, AWS Lambda and API Gateway. Security hardening, dependency audits and POPIA-aware data handling.",
      capabilities: ["OAuth2 and PKCE gateways", "Cognito, KMS, Lambda, API Gateway", "Security review and hardening", "POPIA-aware architecture"],
      study: "alpha-sso-gateway",
    },
    {
      key: "frame",
      name: "InsurTech and operations",
      place: "Frame",
      body: "Underwriting CRMs, policy portals, claim forms and e-signing, bookings, billing runs and reconciliation. Actuarial tooling and UAT automation for a motor rating API.",
      capabilities: ["CRMs, portals and booking systems", "Claims, documents and e-signature", "Billing runs and reconciliation on AWS", "Actuarial tooling and UAT automation"],
      study: "alpha-operations",
    },
    {
      key: "head",
      name: "AI products",
      place: "Head",
      body: "LLM features on Claude, rubric-aligned grading with a human in the loop, RAG and embeddings, tiered OCR, vendor-neutral provider layers and cost telemetry so the bill is never a surprise.",
      capabilities: ["Claude and Bedrock in production", "RAG, embeddings and evals", "Tiered OCR pipelines", "Provider layers and cost telemetry"],
      study: "cleverly-ai-grading",
    },
  ],
} as const;

/* Chapter III: the record */
export const RECORD = {
  numeral: "III",
  title: "The record",
  intro: "Ten systems, each with the problem, the decisions and where it landed. Dates and credit are as they happened.",
  order: [
    "cleverly-ai-grading",
    "alpha-sso-gateway",
    "123tutors-platform",
    "alpha-operations",
    "akur8-uat-runner",
    "tutor-vetting-automation",
    "claim-forms-modernisation",
    "friends-of-cinema",
    "utap-campus-commerce",
    "property-portfolio-rebuild",
  ],
  summaries: {
    "cleverly-ai-grading": "AI-assisted grading teachers can trace: rubric-aligned, evidence-linked, with a vendor-neutral provider layer.",
    "alpha-sso-gateway": "One login for every application across an insurance, hospitality and fitness group.",
    "123tutors-platform": "Bubble to Next.js migration on Supabase, and a Claude-powered AI tutor, live in production.",
    "alpha-operations": "CRMs, policy portals, bookings and an automated billing run for three very different businesses.",
    "akur8-uat-runner": "Bulk-validates an actuarial motor rating API before it ships. Solo build, in active use.",
    "tutor-vetting-automation": "KYC, biometrics and AML screening that turned a five-day manual review into a two-hour one.",
    "claim-forms-modernisation": "PDF claim forms turned into web forms with e-signature and a stored record.",
    "friends-of-cinema": "A cinematic site for an independent film studio, built and shipped solo.",
    "utap-campus-commerce": "NFC campus payments on React Native, with a Paystack migration and a vendor dashboard.",
    "property-portfolio-rebuild": "A property developer's site rebuilt on Next.js with a proper content model.",
  } as Record<string, string>,
} as const;

/* Chapter IV: the person */
export const PERSON = {
  numeral: "IV",
  title: "The person",
  intro:
    "Congolese, in Johannesburg, fluent in English and French. I came to software through logistics, finance and network operations, which is why I build for the people who run the business, not only the people who use the app.",
  path: [
    { when: "2026", what: "Oryares Solutions", role: "Founder. AI implementation and fractional CTO work for small teams." },
    { when: "Oct 2025", what: "Cleverly AI", role: "Co-founder and CTO. Grading platform on Next.js, Express, Supabase and Claude. Director at board level." },
    { when: "Aug 2025", what: "123tutors", role: "CTO. Led the move off Bubble, a security review, and the AI tutor." },
    { when: "2025", what: "Alpha Group", role: "Full stack developer. SSO gateway, CRMs, portals, bookings and billing with the Alpha engineering team." },
    { when: "Dec 2024", what: "Reflex Solutions", role: "NOC support engineer, contract. FortiGate, F5, Cisco, PRTG, Python for diagnostics." },
    { when: "Apr 2023", what: "123tutors", role: "Junior software and ML engineer. First paid development work." },
    { when: "Before", what: "Logistics and finance", role: "BCom Logistics Management, financial advisory, then an MSc in Financial Engineering. The quant side never left." },
  ],
  facts: [
    { label: "Based", value: "Johannesburg, South Africa" },
    { label: "Languages", value: "English and French" },
    { label: "Education", value: "MSc Financial Engineering; BCom Logistics Management, University of Johannesburg" },
    { label: "Certifications", value: "HCIA, CCNA, ITIL, cloud fundamentals on AWS, GCP and Azure" },
  ],
} as const;

/* Honest years. Where it says one year, it means one year. */
export const STACK = [
  { name: "Next.js and React", years: "4 years", w: 90 },
  { name: "Python and FastAPI", years: "4 years", w: 80 },
  { name: "Node.js and Express", years: "3+ years", w: 85 },
  { name: "TypeScript", years: "3 years", w: 85 },
  { name: "PostgreSQL and Supabase", years: "3 years", w: 80 },
  { name: "Docker, CI/CD, Vercel, Render", years: "3 years", w: 75 },
  { name: "AWS (Lambda, Cognito, KMS)", years: "2 years", w: 75 },
  { name: "LLM integration (Claude, Bedrock)", years: "2 years", w: 75 },
  { name: "Auth and identity (OAuth2, SSO)", years: "2 years", w: 75 },
  { name: "Security testing (Kali, Burp)", years: "2 years", w: 60 },
  { name: "GCP and Terraform", years: "1 year", w: 50 },
  { name: "React Native and Expo", years: "1 year", w: 50 },
] as const;

/* Chapter V: open */
export const OPEN = {
  numeral: "V",
  title: "Open",
  headline: "If it has to work, let's talk.",
  body: "Senior and lead full stack, AI engineering, platform and identity, or a fractional CTO seat. Contract or full-time. I reply within a day.",
  links: [
    { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { label: "LinkedIn", value: "linkedin.com/in/rusumba", href: SITE.linkedin },
    { label: "GitHub", value: "github.com/cicology", href: SITE.github },
    { label: "CV", value: "PDF, 2026", href: SITE.cv },
  ],
} as const;

export const CHAPTERS = [
  { id: "load", numeral: LOAD.numeral, title: LOAD.title },
  { id: "structure", numeral: STRUCTURE.numeral, title: STRUCTURE.title },
  { id: "record", numeral: RECORD.numeral, title: RECORD.title },
  { id: "person", numeral: PERSON.numeral, title: PERSON.title },
  { id: "open", numeral: OPEN.numeral, title: OPEN.title },
] as const;
