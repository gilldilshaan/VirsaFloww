import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { FarmerLayout } from '@/components/farmer/farmer-layout';
import { pageHead } from '@/lib/earth/content';

function FarmerRoot() {
  return (
    <ProtectedRoute portal="farmer">
      <FarmerLayout>
        <Outlet />
      </FarmerLayout>
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/farmer')({
  head: () =>
    pageHead(
      'Farmer Portal | VirsaFlow',
      'Farmer field record management, AWD water depth logging, and practice evidence submission.',
      '/farmer'
    ),
  component: FarmerRoot,
});
