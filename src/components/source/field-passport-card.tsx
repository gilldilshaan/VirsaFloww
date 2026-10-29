/**
 * Field Passport — the product's central object, rendered as a static sample
 * record. Used compact in the hero and in full inside the flagship section.
 *
 * Every value below is demo data, and the card says so: nothing here claims a
 * real farmer, a real yield, or a real outcome.
 */

const SAMPLE = {
  fieldId: "ACR-PB-FAR-000012",
  farmer: "Harpreet Singh",
  location: "Faridkot, Punjab",
  acreage: "4.8 ac",
  crop: "Wheat · Rabi 2025–26",
};

const ACTIVITIES = [
  { label: "Land preparation", when: "Nov", status: "Recorded" },
  { label: "DSR sowing · GPS track", when: "Nov", status: "Verified" },
  { label: "First irrigation", when: "Dec", status: "Recorded" },
];

const EVIDENCE = [
  { stage: "Sowing", state: "verified" as const },
  { stage: "Stand count", state: "verified" as const },
  { stage: "Weed check", state: "pending" as const },
];

function Field() {
  return (
    <div className="border-t border-ink/10 p-4 sm:p-5">
      <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-base-900">
        <svg viewBox="0 0 320 120" className="h-full w-full" role="img" aria-label="Sample field boundary">
          {/* grid */}
          <g stroke="#34D399" strokeWidth={0.4} opacity={0.14}>
            {[20, 40, 60, 80, 100].map((y) => (
              <line key={y} x1={0} y1={y} x2={320} y2={y} />
            ))}
            {[40, 80, 120, 160, 200, 240, 280].map((x) => (
              <line key={x} x1={x} y1={0} x2={x} y2={120} />
            ))}
          </g>
          {/* surveyed boundary */}
          <polygon
            points="70,26 246,18 262,88 92,100"
            fill="rgba(52,211,153,0.10)"
            stroke="#34D399"
            strokeWidth={1.5}
          />
          {[
            [70, 26],
            [246, 18],
            [262, 88],
            [92, 100],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.5} fill="#F2C14E" />
          ))}
          <text x={158} y={66} textAnchor="middle" fontSize={12} fontWeight={700} fill="#F4F4F0" className="font-display">
            4.8 ac
          </text>
        </svg>
        <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-dataBlue/80">
          Boundary · surveyed
        </span>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        Declared and surveyed area pass the band check
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 sm:px-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

export default function FieldPassportCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-base-800 shadow-glass">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-base-700/60 px-4 py-3 sm:px-5">
        <span className="font-plex text-xs font-semibold tracking-tight text-ink sm:text-sm">{SAMPLE.fieldId}</span>
        <span className="rounded-full border border-money/30 bg-money/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-money">
          Sample record
        </span>
      </div>

      {/* identity */}
      <div className="grid grid-cols-2">
        <div className="border-b border-r border-ink/10">
          <Row label="Farmer" value={SAMPLE.farmer} />
        </div>
        <div className="border-b border-ink/10">
          <Row label="Location" value={SAMPLE.location} />
        </div>
        <div className="border-r border-ink/10">
          <Row label="Acreage" value={SAMPLE.acreage} />
        </div>
        <div>
          <Row label="Crop · season" value={SAMPLE.crop} />
        </div>
      </div>

      <Field />

      {!compact && (
        <>
          {/* activities */}
          <div className="border-t border-ink/10 p-4 sm:p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Activities</div>
            <ul className="mt-3 space-y-2.5">
              {ACTIVITIES.map((a) => (
                <li key={a.label} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        a.status === "Verified" ? "bg-carbon" : "bg-ink-faint"
                      }`}
                    />
                    <span className="truncate text-sm text-ink">{a.label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {a.when} · {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* evidence */}
          <div className="border-t border-ink/10 p-4 sm:p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Evidence</div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {EVIDENCE.map((e) => (
                <div
                  key={e.stage}
                  className={`rounded-lg border px-2.5 py-2 text-center ${
                    e.state === "verified"
                      ? "border-carbon/30 bg-carbon/5"
                      : "border-ink/10 bg-base-700/50"
                  }`}
                >
                  <div className={`text-sm ${e.state === "verified" ? "text-carbon" : "text-ink-faint"}`}>
                    {e.state === "verified" ? "✓" : "·"}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-ink-muted">{e.stage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* verification */}
          <div className="flex items-center gap-2 border-t border-ink/10 bg-base-700/40 px-4 py-3 sm:px-5">
            <span className="text-carbon">✓</span>
            <span className="text-xs text-ink-muted">
              Every entry lands in an append-only audit trail.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
