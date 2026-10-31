import { createFileRoute } from '@tanstack/react-router';
import { CommandCentre } from '@/components/terra-ledger/command-centre';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/command')({
  head: () =>
    pageHead(
      'Command Centre | VirsaFlow Workspace',
      'Field evidence synthesis, spatial enclosure analysis, and automated verification checklist for Punjab.',
      '/workspace/command'
    ),
  component: CommandCentre,
});
