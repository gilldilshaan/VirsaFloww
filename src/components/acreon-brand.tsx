/** Shared brand link. The filename remains for stable imports. */
export function AcreonBrand({ className = "" }: { className?: string }) {
  return (
    <a className={`brand ${className}`} href="/" aria-label="VirsaFlow home">
      <span className="brand-mark-frame">
        <img className="brand-monogram" src="/brand/organic-tcc-monogram.png" alt="" />
      </span>
      <span className="brand-wordmark">
        Virsa<strong>Flow</strong>
      </span>
    </a>
  );
}
