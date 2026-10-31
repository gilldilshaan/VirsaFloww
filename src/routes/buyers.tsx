import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TerraLedgerProvider } from '@/lib/terra-ledger/store';
import { BuyerLayout } from '@/components/buyers/buyer-layout';
import { pageHead } from '@/lib/earth/content';

function BuyersRoot() {
  return (
    <ProtectedRoute portal="buyer">
      <TerraLedgerProvider>
        <BuyerLayout>
          <Outlet />
        </BuyerLayout>
      </TerraLedgerProvider>
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/buyers')({
  head: () =>
    pageHead(
      'Industry Buyer Portal | VirsaFlow',
      'Institutional carbon offtake marketplace and verified project due diligence data rooms.',
      '/buyers'
    ),
  component: BuyersRoot,
});
