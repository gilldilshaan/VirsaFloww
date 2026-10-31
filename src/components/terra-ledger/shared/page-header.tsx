import React from 'react';
import { ChevronRight } from 'lucide-react';
import { DemoDataBadge } from './status-states';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showDemoBadge?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  showDemoBadge = true,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`space-y-2 pb-2 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#72816f]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {crumb.href && !isLast ? (
                  <a href={crumb.href} className="hover:text-[#213c2b] transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={isLast ? 'text-[#193b2a] font-medium' : ''}>{crumb.label}</span>
                )}
                {!isLast && <ChevronRight size={12} className="text-[#a0afa0]" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-1">
            {badge}
            {showDemoBadge && <DemoDataBadge />}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">{title}</h1>
          {description && <p className="text-xs text-[#72816f] mt-1 max-w-3xl">{description}</p>}
        </div>

        {actions && <div className="flex items-center flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
