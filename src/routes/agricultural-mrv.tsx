import { createFileRoute } from '@tanstack/react-router';
import { AgriculturalMRVPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/agricultural-mrv')({ head: () => pageHead('Agricultural MRV', 'Understand agricultural monitoring, reporting, verification, confidence, uncertainty and methodology-specific evidence requirements.', '/agricultural-mrv'), component: AgriculturalMRVPage });
