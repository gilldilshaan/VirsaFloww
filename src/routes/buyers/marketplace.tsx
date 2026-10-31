import { createFileRoute } from '@tanstack/react-router';
import { BuyerMarketplaceView } from '@/components/buyers/buyer-marketplace-view';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/marketplace')({
  head: () =>
    pageHead(
      'Institutional Carbon Project Marketplace | TerraLedger AI',
      'Discover publication-approved agricultural carbon projects in Punjab with transparent readiness scores.',
      '/buyers/marketplace'
    ),
  component: BuyerMarketplaceView,
});
