import { createFileRoute } from '@tanstack/react-router';
import { ProjectDossier } from '@/components/terra-ledger/project-dossier';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/dossier')({
  head: () =>
    pageHead(
      'Verification Dossiers | The Carbon Credit OS',
      'Comprehensive institutional project dossier compiled from cadastral boundaries and multi-sensor evidence.',
      '/workspace/dossier'
    ),
  component: ProjectDossier,
});
