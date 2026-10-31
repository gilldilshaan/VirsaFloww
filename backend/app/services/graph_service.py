import os
import json
from datetime import datetime, timezone
from typing import List, Dict, Optional, Set
from fastapi import HTTPException, status

from backend.app.schemas.graph import (
    GraphNode,
    GraphNodeType,
    GraphEdge,
    GraphRelation,
    EvidenceGraphResponse,
)
from backend.app.schemas.evidence import Evidence, EvidenceStatus, EvidenceCategory
from backend.app.schemas.user import User, UserRole
from backend.app.schemas.field import FieldModel
from backend.app.schemas.assessment import Assessment
from backend.app.schemas.satellite import SatelliteObservation
from backend.app.core.config import settings

class GraphService:
    def __init__(self, container):
        self.container = container

    def _read_observations(self, field_id: Optional[str] = None) -> List[SatelliteObservation]:
        """Reads satellite observations strictly from configured observations path (Amendment 4)."""
        obs_path = settings.LEAD_OBSERVATIONS_PATH
        if not os.path.exists(obs_path):
            return []
        try:
            with open(obs_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return []
                raw_items = json.loads(content)
                obs_list = []
                for item in raw_items:
                    try:
                        obs = SatelliteObservation.model_validate(item)
                        obs_list.append(obs)
                    except Exception:
                        pass
                return obs_list
        except Exception:
            return []

    def build_field_graph(self, field_id: str, current_user: User) -> EvidenceGraphResponse:
        """Constructs a deterministic, provenance-checked evidence graph for a field parcel."""
        # 1. Access control
        if current_user.role == UserRole.BUYER:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Resource not found."},
            )

        field = self.container.field_repo.get(field_id)
        if not field:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Field '{field_id}' not found."},
            )

        if current_user.role == UserRole.FARMER and field_id not in current_user.assigned_field_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Field not found or access denied."},
            )

        nodes: Dict[str, GraphNode] = {}
        edges: Dict[str, GraphEdge] = {}

        is_farmer = current_user.role == UserRole.FARMER

        # Field Node (PII redacted for farmer view of others, though farmer only accesses own field)
        field_meta = {
            "areaHa": field.area_ha,
            "district": field.district,
            "practice": field.practice,
            "crop": field.crop,
        }
        if not is_farmer:
            field_meta["farmerId"] = field.farmer_id

        nodes[field.id] = GraphNode(
            id=field.id,
            type=GraphNodeType.FIELD,
            label=f"Field: {field.name}",
            status=field.practice,
            meta=field_meta,
        )

        # Project Node (if assigned)
        if field.project_id:
            project = self.container.project_repo.get(field.project_id)
            if project:
                nodes[project.id] = GraphNode(
                    id=project.id,
                    type=GraphNodeType.PROJECT,
                    label=f"Project: {project.title}",
                    status=project.status_label,
                    meta={"vintage": project.vintage, "methodology": project.methodology},
                )
                edge_id = f"EDGE-{project.id}-has_field-{field.id}"
                edges[edge_id] = GraphEdge(
                    id=edge_id,
                    source=project.id,
                    target=field.id,
                    relation=GraphRelation.HAS_FIELD,
                )

        # Activity Nodes
        activities, _ = self.container.activity_repo.list(filter_fn=lambda a: a.field_id == field_id)
        for act in activities:
            nodes[act.id] = GraphNode(
                id=act.id,
                type=GraphNodeType.ACTIVITY,
                label=f"Activity: {act.activity_type.value}",
                status=act.declared_date,
                meta={"declaredDate": act.declared_date, "activityType": act.activity_type.value},
            )
            edge_id = f"EDGE-{field.id}-has_activity-{act.id}"
            edges[edge_id] = GraphEdge(
                id=edge_id,
                source=field.id,
                target=act.id,
                relation=GraphRelation.HAS_ACTIVITY,
            )

        # Evidence Nodes
        evidence_items, _ = self.container.evidence_repo.list(
            filter_fn=lambda e: e.field_id == field_id,
        )
        for ev in evidence_items:
            ev_meta = {
                "type": ev.type.value,
                "category": ev.category.value,
                "capturedAt": ev.captured_at,
                "sha256": ev.provenance.sha256[:16] + "...",
            }
            if ev.provenance.gps_coordinates:
                ev_meta["lat"] = ev.provenance.gps_coordinates.lat
                ev_meta["lng"] = ev.provenance.gps_coordinates.lng

            nodes[ev.id] = GraphNode(
                id=ev.id,
                type=GraphNodeType.EVIDENCE,
                label=f"Evidence: {ev.title}",
                status=ev.status.value,
                meta=ev_meta,
            )

            # Supersession edge
            if ev.supersedes_id and ev.supersedes_id in [e.id for e in evidence_items]:
                edge_id = f"EDGE-{ev.id}-supersedes-{ev.supersedes_id}"
                edges[edge_id] = GraphEdge(
                    id=edge_id,
                    source=ev.id,
                    target=ev.supersedes_id,
                    relation=GraphRelation.SUPERSEDES,
                )

            # Link active evidence to activity or field
            if ev.status != EvidenceStatus.SUPERSEDED:
                target_id = ev.activity_id if ev.activity_id and ev.activity_id in nodes else field.id
                rel = GraphRelation.SUPPORTS if ev.category == EvidenceCategory.SUPPORTING else GraphRelation.CONTRADICTS
                edge_id = f"EDGE-{ev.id}-{rel.value}-{target_id}"
                edges[edge_id] = GraphEdge(
                    id=edge_id,
                    source=ev.id,
                    target=target_id,
                    relation=rel,
                )

        # Assessment & Rule Results Nodes
        assessments, _ = self.container.assessment_repo.list(filter_fn=lambda a: a.field_id == field_id)
        latest_assessment: Optional[Assessment] = assessments[-1] if assessments else None

        if latest_assessment:
            nodes[latest_assessment.id] = GraphNode(
                id=latest_assessment.id,
                type=GraphNodeType.ASSESSMENT,
                label=f"Assessment: {latest_assessment.status_label}",
                status=latest_assessment.status.value,
                meta={"assessedAt": latest_assessment.assessed_at, "version": latest_assessment.ruleset_version},
            )
            edge_id = f"EDGE-{field.id}-evaluated_by-{latest_assessment.id}"
            edges[edge_id] = GraphEdge(
                id=edge_id,
                source=field.id,
                target=latest_assessment.id,
                relation=GraphRelation.EVALUATED_BY,
            )

            # Rule Results Nodes
            for r in latest_assessment.rule_results:
                rule_node_id = f"{latest_assessment.id}:{r.rule_id}"
                nodes[rule_node_id] = GraphNode(
                    id=rule_node_id,
                    type=GraphNodeType.RULE_RESULT,
                    label=f"Rule: {r.rule_id}",
                    status=r.result.value,
                    meta={"explanation": r.explanation, "result": r.result.value},
                )
                res_edge_id = f"EDGE-{latest_assessment.id}-resulted_in-{rule_node_id}"
                edges[res_edge_id] = GraphEdge(
                    id=res_edge_id,
                    source=latest_assessment.id,
                    target=rule_node_id,
                    relation=GraphRelation.RESULTED_IN,
                )

                # Link source records to rule result
                # INVARIANT: Superseded evidence MUST NOT be linked as supporting any rule result!
                for s_id in r.source_record_ids:
                    if s_id in nodes and nodes[s_id].type == GraphNodeType.EVIDENCE:
                        # Check if evidence is active (not superseded)
                        ev_record = self.container.evidence_repo.get(s_id)
                        if ev_record and ev_record.status != EvidenceStatus.SUPERSEDED:
                            edge_id = f"EDGE-{s_id}-supports-{rule_node_id}"
                            edges[edge_id] = GraphEdge(
                                id=edge_id,
                                source=s_id,
                                target=rule_node_id,
                                relation=GraphRelation.SUPPORTS,
                            )

        # Satellite Observations (from configured observations path)
        observations = self._read_observations(field_id)
        for obs in observations:
            obs_node_id = f"OBS-{obs.id}"
            nodes[obs_node_id] = GraphNode(
                id=obs_node_id,
                type=GraphNodeType.SATELLITE_OBSERVATION,
                label=f"Satellite: {obs.sensor}",
                status=obs.date,
                meta={
                    "date": obs.date,
                    "cloudCoverPercent": obs.cloud_cover_percent,
                    "meanNdvi": obs.mean_ndvi,
                    "meanNdwi": obs.mean_ndwi,
                },
            )
            edge_id = f"EDGE-{obs_node_id}-supports-{field.id}"
            edges[edge_id] = GraphEdge(
                id=edge_id,
                source=obs_node_id,
                target=field.id,
                relation=GraphRelation.SUPPORTS,
            )

        # Review Nodes (Excluded for Farmer role per Amendment 6)
        if not is_farmer:
            reviews, _ = self.container.review_repo.list(filter_fn=lambda r: r.field_id == field_id)
            for rev in reviews:
                nodes[rev.id] = GraphNode(
                    id=rev.id,
                    type=GraphNodeType.REVIEW,
                    label=f"Review: {rev.title}",
                    status=rev.status.value,
                    meta={"severity": rev.severity.value, "assignedTo": rev.assigned_to},
                )
                target_dest = latest_assessment.id if latest_assessment else field.id
                edge_id = f"EDGE-{rev.id}-reviewed_in-{target_dest}"
                edges[edge_id] = GraphEdge(
                    id=edge_id,
                    source=rev.id,
                    target=target_dest,
                    relation=GraphRelation.REVIEWED_IN,
                )

        # Deterministic sorting
        sorted_nodes = sorted(nodes.values(), key=lambda n: (n.type.value, n.id))
        sorted_edges = sorted(edges.values(), key=lambda e: e.id)

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        return EvidenceGraphResponse(
            nodes=sorted_nodes,
            edges=sorted_edges,
            generated_at=now_iso,
            assessment_id=latest_assessment.id if latest_assessment else None,
        )

    def build_project_graph(self, project_id: str, current_user: User) -> EvidenceGraphResponse:
        """Constructs evidence graph across all fields in a project (latest assessment per field)."""
        if current_user.role in (UserRole.BUYER, UserRole.FARMER):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": "Resource not found."},
            )

        project = self.container.project_repo.get(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"code": "NOT_FOUND", "message": f"Project '{project_id}' not found."},
            )

        if current_user.role == UserRole.PROJECT_DEVELOPER and current_user.assigned_project_ids:
            if project_id not in current_user.assigned_project_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={"code": "NOT_FOUND", "message": "Project access denied."},
                )

        # Aggregate across project fields
        fields, _ = self.container.field_repo.list(filter_fn=lambda f: f.project_id == project_id)

        all_nodes: Dict[str, GraphNode] = {}
        all_edges: Dict[str, GraphEdge] = {}

        # Project root node
        all_nodes[project.id] = GraphNode(
            id=project.id,
            type=GraphNodeType.PROJECT,
            label=f"Project: {project.title}",
            status=project.status_label,
            meta={"vintage": project.vintage, "methodology": project.methodology},
        )

        latest_assessment_id = None

        for field in fields:
            field_graph = self.build_field_graph(field.id, current_user)
            if field_graph.assessment_id:
                latest_assessment_id = field_graph.assessment_id
            for n in field_graph.nodes:
                all_nodes[n.id] = n
            for e in field_graph.edges:
                all_edges[e.id] = e

        sorted_nodes = sorted(all_nodes.values(), key=lambda n: (n.type.value, n.id))
        sorted_edges = sorted(all_edges.values(), key=lambda e: e.id)

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        return EvidenceGraphResponse(
            nodes=sorted_nodes,
            edges=sorted_edges,
            generated_at=now_iso,
            assessment_id=latest_assessment_id,
        )
