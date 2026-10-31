import { createFileRoute } from '@tanstack/react-router';
import { CommandCentre } from '@/components/terra-ledger/command-centre';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/workspace/command')({
  head: () =>
    pageHead(
      'Command Centre | The Carbon Credit OS',
      'Portfolio KPIs, active parcel status, and real-time MRV operational command centre.',
      '/workspace/command'
    ),
  component: CommandCentre,
});
