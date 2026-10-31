import { createFileRoute } from "@tanstack/react-router";
import { TerraIntelligenceView } from "@/components/workspace/terra-intelligence-view";
import { pageHead } from "@/lib/earth/content";

export const Route = createFileRoute("/workspace/terra-intelligence")({
  head: () =>
    pageHead(
      "Terra Intelligence GIS Studio | TerraLedger AI",
      "Dedicated geospatial workspace with multi-spectral satellite layers, timeline analysis and data-quality indicators.",
      "/workspace/terra-intelligence",
    ),
  component: TerraIntelligenceView,
});
