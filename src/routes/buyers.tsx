import { createFileRoute, Outlet } from '@tanstack/react-router';
import { BuyerLayout } from '@/components/layouts/buyer-layout';

export const Route = createFileRoute('/buyers')({
  component: () => (
    <BuyerLayout>
      <Outlet />
    </BuyerLayout>
  ),
});
