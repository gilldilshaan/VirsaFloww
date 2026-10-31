import { createFileRoute } from '@tanstack/react-router';
import { SatelliteIntelligence } from '@/components/terra-ledger/satellite-intelligence';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/satellite')({
  head: () =>
    pageHead(
      'Satellite Intelligence | VirsaFlow',
      'Copernicus Sentinel-2 10m multi-spectral observations, cloud quality flags, and vegetation/water indices.',
      '/workspace/satellite'
    ),
  component: SatelliteIntelligence,
});
