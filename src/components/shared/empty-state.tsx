import { FolderOpen, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No records found",
  description = "There are no active records matching your filter criteria.",
  actionLabel,
  onAction,
  extra,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-[#cfdac7] my-4">
      <div className="w-12 h-12 rounded-full bg-[#f4f7f0] flex items-center justify-center mb-4 text-[#5c7c46]">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-[#193b2a]">{title}</h3>
      <p className="text-xs text-[#72816f] mt-1.5 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            size="sm"
            onClick={onAction}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            {actionLabel}
          </Button>
        </div>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}
