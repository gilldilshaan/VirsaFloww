import { PRODUCTION_SITE_URL } from '@/lib/site-url';

export const publicNavigation = [
  { to: '/platform', label: 'Our approach' },
  { to: '/carbon-credits', label: 'Agricultural projects' },
  { to: '/agricultural-mrv', label: 'MRV & verification' },
  { to: '/partners', label: 'For partners' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
] as const;
export const solutions = [
  { id: 'practice', title: 'Agricultural practice monitoring', category: 'FIELD INTELLIGENCE', description: 'Connect seasonal activity records with field observations to assess how agricultural practices change over time.', evidence: 'Dated activity records, field photos, boundaries and seasonal observations.', outcome: 'Practice timelines with source references and gaps made visible.' },
  { id: 'water', title: 'Water-use management', category: 'RESOURCE MONITORING', description: 'Bring irrigation observations, sensor measurements and geospatial context into a consistent field record.', evidence: 'Irrigation logs, sensor readings and field observations where available.', outcome: 'Measured values kept separate from modeled estimates; no unsupported water-saving claims.' },
  { id: 'sustainable', title: 'Sustainable agriculture MRV', category: 'PROGRAM ASSURANCE', description: 'Structure evidence around the criteria of a sustainable agriculture program, rather than a single crop or region.', evidence: 'Practice records, applicable criteria, provenance and reviewer decisions.', outcome: 'Traceable assessments that show what is supported and what needs further evidence.' },
  { id: 'carbon', title: 'Carbon & environmental MRV', category: 'ENVIRONMENTAL EVIDENCE', description: 'Organize activity data and environmental estimates for methodology-specific review.', evidence: 'Baseline assumptions, activity data, calculation versions and uncertainty.', outcome: 'Review-ready evidence, not a promise of certification or issued carbon credits.' },
  { id: 'insurance', title: 'Crop insurance evidence', category: 'RISK & ASSESSMENT', description: 'Link field conditions and dated observations to support transparent assessment of crop events.', evidence: 'Time-stamped photos, seasonal records, geospatial context and source quality.', outcome: 'A documented evidence package for an insurer’s own assessment process.' },
  { id: 'supply-chain', title: 'Agricultural supply-chain traceability', category: 'AUTHORIZED RECORD LINKS', description: 'Link field, crop-season and production records to downstream documentation, keeping missing links and reconciliation visible.', evidence: 'Authorized farm records, seasonal production references and downstream documentation.', outcome: 'Traceability summaries and supporting records, with chain-of-custody limitations stated.' },
];
export const audiences = [
  ['FPOs & farmer collectives', 'Contribute authorized farm records and local observations; coordinate registration and collection, with clearer evidence requirements and seasonal visibility.'],
  ['Agribusinesses & supply chains', 'Contribute farm and downstream documentation; reconcile practice and production references to identify traceability coverage and missing links.'],
  ['Government & development programs', 'Define eligibility, reporting criteria and authorized program records; assess implementation and unresolved evidence without replacing official review.'],
  ['Crop insurers & risk teams', 'Define case requirements and supply authorized inspection records; review field timelines to prepare documentation for their own assessment process.'],
  ['Sustainability & carbon developers', 'Supply methodology and baseline requirements; organize activity sources and calculations for review without implying certification or issued credits.'],
  ['Research & verification organizations', 'Contribute protocols and validation datasets; inspect provenance, assumptions and reproducibility to assess the quality of methods and evidence.'],
] as const;
export const stages = [
  ['Register', 'Establish the field, boundary, season and program context. Capture appropriate permissions and consent.'],
  ['Collect', 'Link observations, photos, farm records, satellite inputs and sensor readings to their sources.'],
  ['Analyze', 'Apply relevant criteria, check consistency and surface anomalies, missing evidence and uncertainty.'],
  ['Verify', 'Review supporting evidence. Human reviewers handle exceptions and record decisions with reasons.'],
  ['Report', 'Produce decision-ready records that retain source references, confidence and review status.'],
] as const;
export const trustPrinciples = [
  ['Evidence provenance', 'Retain the source, collection time, field context and transformations behind each record.'],
  ['Data quality & confidence', 'Make completeness, consistency, uncertainty and limitations explicit. Confidence is not certification.'],
  ['Human review & audit trails', 'Keep reviewer decisions and their rationale connected to the evidence they assess.'],
  ['Consent & privacy', 'Respect purpose-specific permissions and restrict sensitive farmer and field information.'],
] as const;
export const insights = [
  { title: 'From field observations to defensible evidence', category: 'EVIDENCE & TRACEABILITY', summary: 'Why source context matters as much as the observation itself.', paragraphs: ['A photograph or farm record is a source of information, not a verification decision. Its field association, timing, collection method and limitations determine what it can support.', 'An evidence graph connects observations to activities, seasons and claims. This allows reviewers to inspect a claim without losing the original context or overlooking contradictory evidence.', 'A defensible assessment makes missing evidence visible and records the reasoning behind a decision.'] },
  { title: 'Measured, estimated and verified are not interchangeable', category: 'MRV FUNDAMENTALS', summary: 'A clear vocabulary for agricultural impact assessment.', paragraphs: ['Measured values come from an observation or instrument with a stated method. Estimates depend on a model and its assumptions. Both require quality checks.', 'Self-reported activities should remain distinguishable from independently corroborated evidence. An analysis result remains preliminary until the applicable review process is complete.', 'Verification is a decision against defined criteria. It does not automatically mean a certification has been granted or a carbon credit issued.'] },
  { title: 'The role of AI in agricultural verification', category: 'ANALYSIS & HUMAN REVIEW', summary: 'Support for analysis, not a substitute for accountable decisions.', paragraphs: ['AI can support pattern recognition and anomaly detection across field records and geospatial inputs. Those outputs should carry appropriate limitations and be inspectable.', 'Predefined rules check evidence against applicable criteria. Uncertain or exceptional cases need human review, with the decision and its rationale retained.', 'No model output alone establishes the truth of an environmental claim.'] },
];
export function pageHead(
  title: string,
  description: string,
  path: string,
  options: { indexable?: boolean; image?: string } = {},
) {
  const fullTitle = `VirsaFlow | ${title}`;
  const canonical = new URL(path, `${PRODUCTION_SITE_URL}/`).toString();
  const image = options.image ?? `${PRODUCTION_SITE_URL}/social-card.jpg`;
  const privateWorkspacePath = /^\/(?:dashboard(?:\/|$)|farmer\/dashboard(?:\/|$))/.test(path);
  const indexable = options.indexable ?? !privateWorkspacePath;
  const structuredData = indexable
    ? [
        ...(path === '/'
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': `${PRODUCTION_SITE_URL}/#organization`,
                name: 'VirsaFlow',
                legalName: 'Panjdhara Private Limited',
                url: `${PRODUCTION_SITE_URL}/`,
                logo: `${PRODUCTION_SITE_URL}/brand/the-carbon-credit-logo.png`,
                email: 'contact@thecarboncredit.in',
                description:
                  'Agricultural carbon project development and evidence-based MRV, with an initial focus on Direct Seeded Rice in Punjab, India.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': `${PRODUCTION_SITE_URL}/#website`,
                name: 'VirsaFlow',
                url: `${PRODUCTION_SITE_URL}/`,
                publisher: { '@id': `${PRODUCTION_SITE_URL}/#organization` },
                inLanguage: 'en',
              },
            ]
          : []),
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: fullTitle,
          description,
          inLanguage: 'en',
          isPartOf: { '@id': `${PRODUCTION_SITE_URL}/#website` },
        },
        ...(path !== '/'
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: `${PRODUCTION_SITE_URL}/`,
                  },
                  { '@type': 'ListItem', position: 2, name: title, item: canonical },
                ],
              },
            ]
          : []),
      ]
    : [];
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      ...(indexable ? [] : [{ name: 'robots', content: 'noindex, nofollow' }]),
      { property: 'og:site_name', content: 'VirsaFlow' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: 'VirsaFlow — agricultural evidence and MRV' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: indexable ? [{ rel: 'canonical', href: canonical }] : [],
    ...(structuredData.length
      ? { scripts: structuredData.map((schema) => ({ type: 'application/ld+json', children: JSON.stringify(schema) })) }
      : {}),
  };
}
