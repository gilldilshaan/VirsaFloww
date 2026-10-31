import { createFileRoute } from '@tanstack/react-router';
import { TerraLedgerProvider, useTerraLedger } from '@/lib/terra-ledger/store';
import { WorkspaceLayout } from '@/components/terra-ledger/workspace-layout';
import { ProjectDossier } from '@/components/terra-ledger/project-dossier';
import { useEffect } from 'react';
import { pageHead } from '@/lib/earth/content';

function PassportView() {
  const { setActiveTab } = useTerraLedger();
  useEffect(() => {
    setActiveTab('dossier');
  }, [setActiveTab]);

  return <ProjectDossier />;
}

export function PassportPage() {
  return (
    <TerraLedgerProvider>
      <WorkspaceLayout>
        <PassportView />
      </WorkspaceLayout>
    </TerraLedgerProvider>
  );
}

export const Route = createFileRoute('/passport')({
  head: () =>
    pageHead(
      'Project Passport & Dossier | VirsaFlow',
      'Field parcel passport, cadastral boundaries, and agricultural MRV audit record.',
      '/passport'
    ),
  component: PassportPage,
});
