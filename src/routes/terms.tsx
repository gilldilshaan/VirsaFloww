import { createFileRoute } from '@tanstack/react-router';
import { LegalPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/terms')({ head: () => pageHead('Terms of Use', 'Limits on public platform information, illustrative agricultural records and income estimates.', '/terms'), component: () => <LegalPage type="terms"/> });
