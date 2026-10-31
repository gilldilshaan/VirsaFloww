import { ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

/**
 * Unauthorized access state — shown when a user attempts to
 * access a portal or route they don't have permission for.
 */
export function UnauthorizedState({
  title = 'Access denied',
  description = 'You do not have permission to access this page. Contact your administrator if you believe this is an error.',
  showLoginLink = false,
  className = '',
}: {
  title?: string;
  description?: string;
  showLoginLink?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex min-h-[60vh] flex-col items-center justify-center px-4 text-center ${className}`}>
      <div className="rounded-full bg-red-50 p-4">
        <ShieldX className="text-red-500" size={32} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[#213c2b]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[#708071]">{description}</p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline" className="border-[#dce3d7] text-[#245b45]">
          <Link to="/">Go home</Link>
        </Button>
        {showLoginLink && (
          <Button asChild className="bg-[#245b45] text-white hover:bg-[#1a4333]">
            <Link to="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
