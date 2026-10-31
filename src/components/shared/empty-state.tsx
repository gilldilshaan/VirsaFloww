import { Inbox } from 'lucide-react';

/**
 * Consistent empty state for pages with no data.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'There is nothing to display at this time.',
  action,
  className = '',
}: {
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="rounded-full bg-[#f0f3ec] p-4">
        <Icon className="text-[#809c88]" size={32} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#213c2b]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#708071]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
