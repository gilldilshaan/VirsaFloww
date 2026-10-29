import { createFileRoute } from '@tanstack/react-router';
import { TerraLedgerProvider, useTerraLedger } from '@/lib/terra-ledger/store';
import { WorkspaceLayout } from '@/components/terra-ledger/workspace-layout';
import { Marketplace } from '@/components/terra-ledger/marketplace';
import { useEffect } from 'react';
import { pageHead } from '@/lib/earth/content';

function MarketplaceView() {
  const { setActiveTab } = useTerraLedger();
  useEffect(() => {
    setActiveTab('marketplace');
  }, [setActiveTab]);

  return <Marketplace />;
}

export function MarketplacePage() {
  return (
    <TerraLedgerProvider>
      <WorkspaceLayout>
        <MarketplaceView />
      </WorkspaceLayout>
    </TerraLedgerProvider>
  );
}

export const Route = createFileRoute('/marketplace')({
  head: () =>
    pageHead(
      'Agricultural Carbon Marketplace | TerraLedger AI',
      'Institutional directory of verified agricultural carbon projects and due diligence data rooms in Punjab.',
      '/marketplace'
    ),
  component: MarketplacePage,
});
