import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { FieldRecord } from "@/lib/types/workspace";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { pageHead } from "@/lib/earth/content";
import {
  MapPin,
  ArrowLeft,
  Shield,
  Layers,
  Sprout,
  Droplets,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FieldDetailPage() {
  const { fieldId } = useParams({ from: "/workspace/fields/$fieldId" });
  const [fieldData, setFieldData] = useState<FieldRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fields.getById(fieldId).then((res) => {
      setFieldData(res);
      setLoading(false);
    });
  }, [fieldId]);

  if (loading) {
    return <LoadingState message="Loading parcel cadastral details..." />;
  }

  if (!fieldData) {
    return (
      <EmptyState
        title="Field Parcel Not Found"
        description={`The parcel reference ${fieldId} was not found in the cadastral registry.`}
        actionLabel="Back to Fields"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/workspace/fields"
        className="inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium"
      >
        <ArrowLeft size={13} />
        Back to Field Parcels
      </Link>

      <PageHeader
        badge={`Cadastral Code: ${fieldData.code}`}
        icon={MapPin}
        title={fieldData.name}
        description={`Farmer partner: ${fieldData.farmerName} (${fieldData.farmerNameLocal}) · ${fieldData.district}, Punjab`}
        actions={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${
                fieldData.activeStatus === "Audit Approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-sky-100 text-sky-800 border border-sky-300"
              }`}
            >
              Status: {fieldData.activeStatus}
            </span>
          </div>
        }
      />

      {/* Grid of details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Parcel Area</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {fieldData.areaHa} ha
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            {fieldData.areaAcres} acres
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Mitigation Target</span>
          <strong className="block text-2xl font-mono text-[#245b45] mt-1">
            {fieldData.targetEmissionReductionTonnes} tCO2e
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            Estimated annual reduction
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">AWD Water Tubes</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {fieldData.awdTubeCount}
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            Perforated monitoring pipes
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">
            Current Growth Stage
          </span>
          <strong className="block text-lg font-semibold text-[#193b2a] mt-1">
            {fieldData.currentCropStage}
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">{fieldData.crop}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-xl text-[#193b2a]">Boundary Geometry & Coordinates</h3>
          <p className="text-xs text-[#72816f]">
            Cadastral boundary polygon registered with Punjab Land Records Agency. Centroid
            coordinates: {fieldData.coordinates.lat.toFixed(4)}°N,{" "}
            {fieldData.coordinates.lng.toFixed(4)}°E.
          </p>

          <div className="bg-[#f8faf6] border border-[#e2ebd9] rounded-lg p-3 font-mono text-xs text-[#213c2b] space-y-1">
            <div className="text-[10px] uppercase text-[#69816a] mb-2 font-bold">
              Polygon Vertices (WGS 84):
            </div>
            {fieldData.boundaryPolygon.map((v, i) => (
              <div key={i} className="flex justify-between">
                <span>Vertex #{i + 1}:</span>
                <span className="text-[#245b45]">
                  [{v[0]?.toFixed(5)}, {v[1]?.toFixed(5)}]
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 flex gap-3">
            <Link
              to="/workspace/terra-intelligence"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#245b45] text-white px-4 py-2 text-xs font-semibold hover:bg-[#1a4333]"
            >
              Open in Terra Intelligence Map
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-3 text-xs">
          <h3 className="font-serif text-lg text-[#193b2a]">Agronomic Attributes</h3>

          <div>
            <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
              FPO Affiliation
            </span>
            <strong className="text-[#193b2a]">{fieldData.fpoName}</strong>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
              Soil Classification
            </span>
            <strong className="text-[#193b2a]">{fieldData.soilType}</strong>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
              Irrigation Source
            </span>
            <strong className="text-[#193b2a]">{fieldData.irrigationSource}</strong>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
              Seeding / Sowing Date
            </span>
            <strong className="text-[#193b2a]">{fieldData.seedingDate}</strong>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
              Assigned Field Officer
            </span>
            <strong className="text-[#193b2a]">{fieldData.assignedFieldOfficer}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/workspace/fields/$fieldId")({
  head: () =>
    pageHead(
      "Field Parcel Detail | TerraLedger AI",
      "Cadastral parcel coordinates, soil telemetry and water management protocols.",
      "/workspace/fields/$fieldId",
    ),
  component: FieldDetailPage,
});
