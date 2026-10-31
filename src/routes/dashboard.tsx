import { createFileRoute } from '@tanstack/react-router';
import { TerraLedgerProvider, useTerraLedger } from '@/lib/terra-ledger/store';
import { WorkspaceLayout } from '@/components/terra-ledger/workspace-layout';
import { CommandCentre } from '@/components/terra-ledger/command-centre';
import { SatelliteIntelligence } from '@/components/terra-ledger/satellite-intelligence';
import { EvidenceExplorer } from '@/components/terra-ledger/evidence-explorer';
import { ProjectDossier } from '@/components/terra-ledger/project-dossier';
import { Marketplace } from '@/components/terra-ledger/marketplace';
import { pageHead } from '@/lib/earth/content';

function DashboardView() {
  const { activeTab } = useTerraLedger();

  switch (activeTab) {
    case 'satellite':
      return <SatelliteIntelligence />;
    case 'evidence':
      return <EvidenceExplorer />;
    case 'dossier':
      return <ProjectDossier />;
    case 'marketplace':
      return <Marketplace />;
    case 'command':
    default:
      return <CommandCentre />;
  }
}

export function DashboardPage() {
  return (
    <TerraLedgerProvider>
      <WorkspaceLayout>
        <DashboardView />
      </WorkspaceLayout>
    </TerraLedgerProvider>
  );
}

export const Route = createFileRoute('/dashboard')({
  head: () =>
    pageHead(
      'VirsaFlow | Agricultural MRV Command Centre',
      'Field evidence, satellite intelligence, and institutional due diligence platform for agricultural carbon projects in Punjab.',
      '/dashboard'
    ),
  component: DashboardPage,
});
