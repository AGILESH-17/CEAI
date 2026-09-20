from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AnalysisResponse(BaseModel):
    category: str
    confidence: float = Field(ge=0, le=100)
    severity: str
    description: str
    recommended_action: str
    complaint_text: str
    source: str

class ReportCreate(BaseModel):
    category: str
    confidence: float
    severity: str
    description: str
    recommended_action: str
    complaint_text: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    image_url: Optional[str] = None
    source: str = "DEMO_AI"

class StatusUpdate(BaseModel):
    status: str

class ReportResponse(ReportCreate):
    id: int
    complaint_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
