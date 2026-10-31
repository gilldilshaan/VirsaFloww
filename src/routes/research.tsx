import { createFileRoute } from '@tanstack/react-router';
import { ResearchPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/research')({ head: () => pageHead('Research & Insights', 'Introductory perspectives on agricultural evidence, measurement, MRV and accountable AI-supported analysis.', '/research'), component: () => <ResearchPage/> });
