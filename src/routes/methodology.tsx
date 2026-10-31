import { createFileRoute } from '@tanstack/react-router';
import { MethodologyPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/methodology')({ head: () => pageHead('Methodology & Evidence', 'Evidence provenance, confidence, data quality, human review, audit trails and consent principles.', '/methodology'), component: () => <MethodologyPage/> });
