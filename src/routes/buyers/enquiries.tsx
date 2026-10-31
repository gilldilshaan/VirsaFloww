import { createFileRoute } from '@tanstack/react-router';
import { BuyerEnquiriesView } from '@/components/buyers/buyer-enquiries-view';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/enquiries')({
  head: () =>
    pageHead(
      'My Due Diligence Enquiries | TerraLedger AI',
      'Track your institutional due diligence and data room access requests.',
      '/buyers/enquiries'
    ),
  component: BuyerEnquiriesView,
});
