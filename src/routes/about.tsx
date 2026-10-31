import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/about')({ head: () => pageHead('About', 'The Carbon Credit connects agricultural data and verification workflows for traceable evidence and accountable decisions.', '/about'), component: () => <AboutPage/> });
