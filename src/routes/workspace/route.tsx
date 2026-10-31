import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TerraLedgerProvider } from "@/lib/terra-ledger/store";
import { AuthProvider } from "@/lib/auth/auth-context";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export function WorkspaceRouteLayout() {
  return (
    <AuthProvider defaultRole="admin">
      <TerraLedgerProvider>
        <WorkspaceShell>
          <Outlet />
        </WorkspaceShell>
      </TerraLedgerProvider>
    </AuthProvider>
  );
}

export const Route = createFileRoute("/workspace")({
  component: WorkspaceRouteLayout,
});
