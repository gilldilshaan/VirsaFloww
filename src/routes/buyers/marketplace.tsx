import { createFileRoute } from '@tanstack/react-router';
import { Marketplace } from '@/components/terra-ledger/marketplace';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/marketplace')({
  head: () =>
    pageHead(
      'Carbon Marketplace | Industry Buyer Portal',
      'Institutional directory of verified agricultural carbon projects and due diligence data rooms in Punjab.',
      '/buyers/marketplace'
    ),
  component: Marketplace,
});
