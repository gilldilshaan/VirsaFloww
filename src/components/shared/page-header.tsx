/**
 * Consistent page header used across all three portals.
 */
export function PageHeader({
  title,
  description,
  badge,
  actions,
  className = '',
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight text-[#193b2a] sm:text-2xl">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-sm text-[#708071]">{description}</p>
        )}
      </div>
      {actions && <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">{actions}</div>}
    </div>
  );
}
