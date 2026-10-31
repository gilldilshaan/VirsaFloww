import { createFileRoute } from '@tanstack/react-router';
import { SolutionsPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/solutions')({ head: () => pageHead('Agricultural Solutions', 'Agricultural monitoring, water management, environmental MRV, insurance evidence and program oversight.', '/solutions'), component: () => <SolutionsPage/> });
