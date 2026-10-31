import { createFileRoute } from "@tanstack/react-router";
import { CommandCentre } from "@/components/terra-ledger/command-centre";
import { pageHead } from "@/lib/earth/content";

export const Route = createFileRoute("/workspace/command")({
  head: () =>
    pageHead(
      "Operational Command Centre | TerraLedger AI",
      "Field assessment command centre synthesizing ground evidence, remote sensing and review status.",
      "/workspace/command",
    ),
  component: CommandCentre,
});
