from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4

class GeospatialCommandData(BaseModel):
    """Pydantic model for the commandData JSON object."""
    entity_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    marker_id: Optional[str] = None
    label: Optional[str] = None
    start_location: Optional[Dict[str, float]] = None
    end_location: Optional[Dict[str, float]] = None
    duration_seconds_on_map: Optional[float] = None
    animation_style: Optional[str] = None
    travel_mode: Optional[str] = None
    path_polyline: Optional[str] = None
    # Add other fields as needed for specific command types (e.g., area highlights)

class GeospatialCommandResponse(BaseModel):
    """Pydantic model for a single GeospatialCommand object, as returned by this service."""
    command_id: str = Field(default_factory=lambda: str(uuid4()))
    video_id: str
    command_type: str
    start_time_offset_seconds: float
    end_time_offset_seconds: Optional[float] = None
    command_data_json: GeospatialCommandData # Nested Pydantic model
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class GeospatialProcessingRequest(BaseModel):
    """Pydantic model for the request body sent to this service."""
    video_id: str
    transcribed_text: str
    duration_seconds: float # Total duration of the original video

class GeospatialProcessingResponse(BaseModel):
    """Pydantic model for the overall response from this service."""
    video_id: str
    geospatial_commands: List[GeospatialCommandResponse]
    message: str