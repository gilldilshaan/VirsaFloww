import { TccBrand } from '@/components/shared/tcc-brand';

/** Shared brand link. Maintained for backwards-compatible imports across public pages. */
export function AcreonBrand({ className = "" }: { className?: string }) {
  return (
    <a className={`brand ${className}`} href="/" aria-label="VirsaFlow Home">
      <span className="brand-mark-frame">
        <img className="brand-monogram" src="/brand/organic-tcc-monogram.png" alt="VirsaFlow Monogram" />
      </span>
      <span className="brand-wordmark">
        Virsa<strong>Flow</strong>
      </span>
    </a>
  );
}
