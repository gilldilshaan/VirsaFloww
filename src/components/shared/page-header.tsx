import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function PageHeader({
  badge,
  icon: Icon,
  title,
  description,
  actions,
}: {
  badge?: string;
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8dc]">
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            {Icon && <Icon size={13} />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">{title}</h1>
        {description && <p className="text-xs text-[#72816f] mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
