import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>): { interest?: string } => typeof search['interest'] === 'string' ? { interest: search['interest'] } : {},
  head: () => pageHead('Contact', 'Contact The Carbon Credit about institutional partnerships, pilot programs, research and platform walkthroughs.', '/contact'),
  component: ContactRoute,
});
function ContactRoute() { const { interest } = Route.useSearch(); return <ContactPage {...(interest ? { interest } : {})}/>; }
