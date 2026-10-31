import { createFileRoute } from '@tanstack/react-router';
import { BusinessImpactPage } from '@/components/earth/content-pages';
import { pageHead } from '@/lib/earth/content';
export const Route = createFileRoute('/business-impact')({ head: () => pageHead('Business & Impact', 'Explore proposed commercial models, customer value, delivery-cost variables and transparent evaluation metrics for agricultural evidence workflows.', '/business-impact'), component: BusinessImpactPage });
