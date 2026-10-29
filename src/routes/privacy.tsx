import { createFileRoute } from '@tanstack/react-router';
import { LegalPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/privacy')({ head: () => pageHead('Privacy & Data Governance', 'Understand public enquiry handling, program consent, authorized access, proposed safeguards, publication permissions and responsible AI use.', '/privacy'), component: () => <LegalPage type="privacy"/> });
