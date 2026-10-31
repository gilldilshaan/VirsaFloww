from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class GraphNodeType(str, Enum):
    PROJECT = "project"
    FIELD = "field"
    SEASON = "season"
    ACTIVITY = "activity"
    EVIDENCE = "evidence"
    SATELLITE_OBSERVATION = "satellite_observation"
    RULE_RESULT = "rule_result"
    REVIEW = "review"
    ASSESSMENT = "assessment"

class GraphRelation(str, Enum):
    HAS_FIELD = "has_field"
    HAS_ACTIVITY = "has_activity"
    SUPPORTS = "supports"
    CONTRADICTS = "contradicts"
    SUPERSEDES = "supersedes"
    EVALUATED_BY = "evaluated_by"
    RESULTED_IN = "resulted_in"
    REVIEWED_IN = "reviewed_in"

class GraphNode(BaseSchema):
    id: str
    type: GraphNodeType
    label: str
    status: Optional[str] = None
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
    meta: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseSchema):
    id: str
    source: str
    target: str
    relation: GraphRelation

class EvidenceGraphResponse(BaseSchema):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    generated_at: str = Field(..., alias="generatedAt")
    assessment_id: Optional[str] = Field(default=None, alias="assessmentId")
