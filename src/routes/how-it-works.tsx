import { createFileRoute } from '@tanstack/react-router';
import { HowPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/how-it-works')({ head: () => pageHead('How It Works', 'Register, collect, analyze, verify and report with a traceable agricultural evidence workflow.', '/how-it-works'), component: () => <HowPage/> });
