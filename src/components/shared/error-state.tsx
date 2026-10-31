import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Consistent error state for failed API calls.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this page. Please try again.',
  onRetry,
  className = '',
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="rounded-full bg-amber-50 p-4">
        <AlertTriangle className="text-amber-600" size={32} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#213c2b]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#708071]">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-4 border-[#dce3d7] text-[#245b45] hover:bg-[#f0f3ec]"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
