import { createFileRoute } from '@tanstack/react-router';
import { SatelliteIntelligence } from '@/components/terra-ledger/satellite-intelligence';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/terra-intelligence')({
  head: () =>
    pageHead(
      'Terra Intelligence | VirsaFlow Workspace',
      'Geospatial multi-spectral investigation interface for Punjab agricultural land clusters.',
      '/workspace/terra-intelligence'
    ),
  component: SatelliteIntelligence,
});
