import { createFileRoute } from '@tanstack/react-router';
import { BuyerProfileView } from '@/components/buyers/buyer-profile-view';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/profile')({
  head: () =>
    pageHead(
      'Buyer Profile & Settings | TerraLedger AI',
      'Manage corporate buyer credentials, authorizations, and preferences.',
      '/buyers/profile'
    ),
  component: BuyerProfileView,
});
