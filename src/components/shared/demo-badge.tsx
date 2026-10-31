import { Sparkles } from "lucide-react";

export function DemoBadge({ label = "Synthetic Demo Dataset" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono">
      <Sparkles size={12} className="text-amber-600" />
      <span>{label}</span>
    </div>
  );
}
