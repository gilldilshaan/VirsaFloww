import { createFileRoute } from "@tanstack/react-router";
import { ProjectDossier } from "@/components/terra-ledger/project-dossier";
import { pageHead } from "@/lib/earth/content";

export const Route = createFileRoute("/workspace/dossier")({
  head: () =>
    pageHead(
      "Project Dossier | TerraLedger AI",
      "Comprehensive project evidence package, digital data room and institutional due diligence.",
      "/workspace/dossier",
    ),
  component: ProjectDossier,
});
