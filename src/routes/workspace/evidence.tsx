import { createFileRoute } from "@tanstack/react-router";
import { EvidenceExplorer } from "@/components/terra-ledger/evidence-explorer";
import { pageHead } from "@/lib/earth/content";

export const Route = createFileRoute("/workspace/evidence")({
  head: () =>
    pageHead(
      "Evidence Explorer | TerraLedger AI",
      "Multi-source agricultural evidence graph, document verification and spatial corroboration.",
      "/workspace/evidence",
    ),
  component: EvidenceExplorer,
});
