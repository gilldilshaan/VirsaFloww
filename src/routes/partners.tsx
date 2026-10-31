import { createFileRoute } from '@tanstack/react-router';
import { PartnersPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/partners')({ head: () => pageHead('Partners & Ecosystem', 'Explore collaboration opportunities for agricultural institutions, data experts and verification organizations.', '/partners'), component: () => <PartnersPage/> });
