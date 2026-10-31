import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { TerraLedgerProvider } from '@/lib/terra-ledger/store';
import { WorkspaceLayout } from '@/components/terra-ledger/workspace-layout';
import { pageHead } from '@/lib/earth/content';

function WorkspaceRoot() {
  return (
    <ProtectedRoute portal="workspace">
      <TerraLedgerProvider>
        <WorkspaceLayout>
          <Outlet />
        </WorkspaceLayout>
      </TerraLedgerProvider>
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/workspace')({
  head: () =>
    pageHead(
      'VirsaFlow | Internal MRV Workspace',
      'Field evidence, satellite intelligence, and institutional due diligence platform for agricultural carbon projects in Punjab.',
      '/workspace'
    ),
  component: WorkspaceRoot,
});
