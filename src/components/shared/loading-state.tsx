import { Loader2 } from "lucide-react";

export function LoadingState({
  message = "Loading data...",
  description = "Retrieving verified records from TerraLedger engine",
}: {
  message?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#e2e8dc] my-4 shadow-xs">
      <Loader2 className="w-8 h-8 text-[#245b45] animate-spin mb-3" />
      <h3 className="text-sm font-semibold text-[#193b2a]">{message}</h3>
      <p className="text-xs text-[#72816f] mt-1 max-w-sm">{description}</p>
    </div>
  );
}
