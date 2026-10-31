import { createFileRoute } from '@tanstack/react-router';
import { ProjectDossier } from '@/components/terra-ledger/project-dossier';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/dossier')({
  head: () =>
    pageHead(
      'Project Dossier | VirsaFlow Workspace',
      'Institutional due diligence scorecard and pre-audit data room for accredited carbon verifiers.',
      '/workspace/dossier'
    ),
  component: ProjectDossier,
});
