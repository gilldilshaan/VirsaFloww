import { createFileRoute } from '@tanstack/react-router';
import { ProgramsPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/field-programs')({ head: () => pageHead('Field Programs & Case Studies', 'Program-specific agricultural contexts, geographies and methodology, with transparent publication status.', '/field-programs'), component: () => <ProgramsPage/> });
