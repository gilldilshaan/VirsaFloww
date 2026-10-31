import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/buyers/')({
  component: () => <Navigate to="/buyers/marketplace" replace />,
});
