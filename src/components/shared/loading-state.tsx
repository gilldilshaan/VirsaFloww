import { Loader2 } from 'lucide-react';

/**
 * Consistent loading state for API-driven pages.
 * Every API call needs a loading state — no blank screens.
 */
export function LoadingState({
  message = 'Loading…',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-[#245b45]" />
      <p className="mt-3 text-sm text-[#708071]">{message}</p>
    </div>
  );
}
