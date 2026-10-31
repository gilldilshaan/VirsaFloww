import { createFileRoute } from '@tanstack/react-router';
import { SatelliteIntelligence } from '@/components/terra-ledger/satellite-intelligence';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/satellite')({
  head: () =>
    pageHead(
      'Satellite Intelligence | VirsaFlow Workspace',
      'Copernicus Sentinel-2 multi-spectral time-series and phenology analysis for Punjab agricultural parcels.',
      '/workspace/satellite'
    ),
  component: SatelliteIntelligence,
});
