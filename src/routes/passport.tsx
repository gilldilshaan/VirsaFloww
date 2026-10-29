import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { pageHead } from '@/lib/earth/content';

export function PassportRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: '/dashboard' });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#102e20] text-white flex items-center justify-center font-mono text-xs">
      Loading Field Passport into TerraLedger Workspace...
    </div>
  );
}

export const Route = createFileRoute('/passport')({
  head: () =>
    pageHead(
      'Field Passport | TerraLedger AI',
      'Field parcel passport, cadastral boundaries, and agricultural MRV audit record.',
      '/passport'
    ),
  component: PassportRedirect,
});
