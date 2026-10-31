import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Failed to load records",
  error = "An unexpected error occurred while communicating with the MRV verification service.",
  onRetry,
}: {
  title?: string;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#fff8f8] rounded-xl border border-[#f3d2d2] my-4">
      <div className="w-11 h-11 rounded-full bg-[#fae5e5] flex items-center justify-center mb-3 text-red-600">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-sm font-semibold text-red-900">{title}</h3>
      <p className="text-xs text-red-700 mt-1 max-w-md">{error}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="text-xs border-red-300 text-red-800 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
