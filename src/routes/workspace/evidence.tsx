import { createFileRoute } from '@tanstack/react-router';
import { EvidenceExplorer } from '@/components/terra-ledger/evidence-explorer';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/evidence')({
  head: () =>
    pageHead(
      'Evidence Explorer | VirsaFlow',
      'Append-only evidence graph, server-side SHA-256 byte hashes, and ground truth provenance.',
      '/workspace/evidence'
    ),
  component: EvidenceExplorer,
});
