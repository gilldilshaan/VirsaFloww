import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/auth-context";

export function UnauthorizedState({
  title = "Access Denied",
  description = "Your current authenticated account role does not have permission to view or manage this workspace section.",
  requiredPermission,
}: {
  title?: string;
  description?: string;
  requiredPermission?: string;
}) {
  const { currentRole, switchRole } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-amber-200 my-6 shadow-xs max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-700">
        <ShieldAlert size={28} />
      </div>
      <h2 className="text-xl font-semibold text-[#193b2a]">{title}</h2>
      <p className="text-xs text-[#72816f] mt-2 max-w-md">{description}</p>

      {requiredPermission && (
        <div className="mt-3 inline-block bg-[#f4f7f0] border border-[#dce3d7] rounded px-3 py-1 text-[11px] font-mono text-[#5c7c46]">
          Required Permission: {requiredPermission}
        </div>
      )}

      <div className="mt-2 text-xs text-[#72816f]">
        Current active role: <strong className="text-[#193b2a] uppercase">{currentRole}</strong>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => switchRole("admin")}
          className="text-xs border-[#245b45] text-[#245b45] hover:bg-[#245b45]/10"
        >
          Switch to Admin Demo Role
        </Button>
        <Link
          to="/workspace/command"
          className="inline-flex items-center justify-center rounded-md bg-[#245b45] px-4 py-2 text-xs font-medium text-white hover:bg-[#1a4333]"
        >
          Return to Command Centre
        </Link>
      </div>
    </div>
  );
}
