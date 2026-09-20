from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from .database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    complaint_text = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String, nullable=True)
    status = Column(String, default="REPORTED", nullable=False)
    source = Column(String, default="DEMO_AI", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
