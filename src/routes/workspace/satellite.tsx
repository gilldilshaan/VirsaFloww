import { createFileRoute } from "@tanstack/react-router";
import { SatelliteIntelligence } from "@/components/terra-ledger/satellite-intelligence";
import { pageHead } from "@/lib/earth/content";

export const Route = createFileRoute("/workspace/satellite")({
  head: () =>
    pageHead(
      "Satellite Intelligence | TerraLedger AI",
      "Copernicus Sentinel-2 multi-spectral time-series and vegetation index analysis.",
      "/workspace/satellite",
    ),
  component: SatelliteIntelligence,
});
