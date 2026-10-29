import { createFileRoute } from '@tanstack/react-router';
import { OpportunityEstimator } from '@/components/earth/opportunity-estimator';
import { SiteShell } from '@/components/earth/site-shell';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/calculator')({ head: () => pageHead('Farmer Opportunity Estimator', 'Explore potential carbon, cost, financing and scheme opportunities for your farm, with every assumption, condition and missing input shown. Illustrative, not guaranteed.', '/calculator'), component: () => <SiteShell><OpportunityEstimator/></SiteShell> });
