import { FlaskConical } from 'lucide-react';

/**
 * Demo data badge — must be shown wherever synthetic/demo records are displayed.
 * Per blueprint: "All synthetic data must carry a visible Demo data label."
 */
export function DemoBadge({
  label = 'Demo data',
  size = 'sm',
  className = '',
}: {
  label?: string;
  size?: 'xs' | 'sm';
  className?: string;
}) {
  const sizeClasses = size === 'xs'
    ? 'text-[9px] px-1.5 py-0.5 gap-1'
    : 'text-[10px] px-2 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-200 bg-amber-50 font-mono uppercase tracking-wider text-amber-700 ${sizeClasses} ${className}`}
    >
      <FlaskConical size={size === 'xs' ? 9 : 11} />
      {label}
    </span>
  );
}
