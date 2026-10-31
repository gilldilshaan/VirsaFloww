import { createFileRoute } from '@tanstack/react-router';
import { IndustrialPartnershipsPage } from '@/components/earth/industrial-partnerships-page';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/industrial-partnerships')({
  head: () =>
    pageHead(
      'Industrial Tie-ups & Climate Infrastructure | The Carbon Credit',
      'Deploy measurable environmental infrastructure with The Carbon Credit. Industrial decarbonisation, urban algae-based solutions, and agricultural carbon programmes in Punjab.',
      '/industrial-partnerships'
    ),
  component: IndustrialPartnershipsPage,
});
