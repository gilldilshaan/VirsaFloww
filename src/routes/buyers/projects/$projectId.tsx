import { createFileRoute } from '@tanstack/react-router';
import { ProjectDossier } from '@/components/terra-ledger/project-dossier';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/projects/$projectId')({
  head: () =>
    pageHead(
      'Project Due Diligence Dossier | VirsaFlow Buyers',
      'Institutional due diligence data room, scorecard, and VVB pre-audit package.',
      '/buyers/projects/$projectId'
    ),
  component: ProjectDossier,
});
