import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/earth/home-page';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/')({ head: () => pageHead('Agricultural carbon projects & MRV', 'The Carbon Credit connects field evidence and MRV workflows to help build credible agricultural carbon projects, starting with Direct Seeded Rice in Punjab.', '/'), component: () => <HomePage/> });
