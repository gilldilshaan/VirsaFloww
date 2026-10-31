import { Link } from '@tanstack/react-router';

interface TccBrandProps {
  portalBadge?: string;
  badgeVariant?: 'default' | 'admin' | 'buyer' | 'farmer' | 'reviewer' | 'officer';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TccBrand({
  portalBadge = 'OS',
  badgeVariant = 'default',
  theme = 'dark',
  size = 'md',
  className = '',
}: TccBrandProps) {
  const isDark = theme === 'dark';

  const badgeStyles: Record<string, string> = {
    default: isDark
      ? 'bg-[#1e4834] text-[#d6eaa6] border-[#366c50]'
      : 'bg-[#e8eee5] text-[#123c2b] border-[#d2ded0]',
    admin: 'bg-red-950/80 text-red-200 border-red-800/60',
    buyer: 'bg-[#18392b] text-[#c9e8a4] border-[#2f664b]',
    farmer: 'bg-[#204936] text-[#e3f4b8] border-[#3e785a]',
    reviewer: 'bg-amber-950/80 text-amber-200 border-amber-800/60',
    officer: 'bg-sky-950/80 text-sky-200 border-sky-800/60',
  };

  const badgeClass = badgeStyles[badgeVariant] || badgeStyles['default'];

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95 ${className}`}>
      {/* Crisp Monogram Frame */}
      <span className="w-8 h-8 rounded-lg bg-[#123C2B] border border-[#285C45] flex items-center justify-center p-1 shadow-xs shrink-0 overflow-hidden">
        <img
          src="/brand/organic-tcc-monogram.png"
          alt="The Carbon Credit Logo"
          className="w-full h-full object-contain"
        />
      </span>

      {/* Wordmark */}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-2">
          <span
            className={`font-serif tracking-tight font-medium ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
            } ${isDark ? 'text-[#F7F8F3]' : 'text-[#1B2B23]'}`}
          >
            The Carbon Credit
          </span>
          {portalBadge && (
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${badgeClass}`}
            >
              {portalBadge}
            </span>
          )}
        </div>
        <span
          className={`text-[9px] tracking-wide font-sans ${
            isDark ? 'text-[#8EA595]' : 'text-[#718078]'
          }`}
        >
          Panjdhara MRV & Agricultural Intelligence
        </span>
      </div>
    </Link>
  );
}
