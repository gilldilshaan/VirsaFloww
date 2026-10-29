import { createFileRoute } from '@tanstack/react-router';
import { PlatformPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/platform')({ head: () => pageHead('Platform', 'Explore the The Carbon Credit Evidence Graph, agricultural data sources, analysis, validation and human review.', '/platform'), component: () => <PlatformPage/> });
