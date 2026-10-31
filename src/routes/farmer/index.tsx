import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/farmer/')({
  component: () => <Navigate to="/farmer/dashboard" replace />,
});
