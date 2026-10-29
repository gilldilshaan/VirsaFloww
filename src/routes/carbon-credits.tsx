import { createFileRoute } from '@tanstack/react-router';
import { CarbonCreditsPage } from '@/components/earth/carbon-page';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/carbon-credits')({ head: () => pageHead('Direct Seeded Rice & agricultural carbon projects', 'How field evidence, appropriate baselines and methodology-specific MRV can support eligible agricultural carbon projects in Punjab.', '/carbon-credits'), component: () => <CarbonCreditsPage/> });
