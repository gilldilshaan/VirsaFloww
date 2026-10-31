import { createFileRoute } from '@tanstack/react-router';
import { EvidenceExplorer } from '@/components/terra-ledger/evidence-explorer';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/evidence')({
  head: () =>
    pageHead(
      'Evidence Explorer | VirsaFlow Workspace',
      'Cryptographic evidence graph, GPS boundary enclosure inspections, and immutable provenance hashes.',
      '/workspace/evidence'
    ),
  component: EvidenceExplorer,
});
