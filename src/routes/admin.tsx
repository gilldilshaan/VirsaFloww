import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AdminLayout } from '@/components/layouts/admin-layout';

export const Route = createFileRoute('/admin')({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});
