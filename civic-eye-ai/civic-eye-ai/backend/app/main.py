from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from pathlib import Path
from datetime import datetime, timezone
import shutil
import uuid
import os

from .database import Base, engine, get_db
from .models import Report
from .schemas import AnalysisResponse, ReportCreate, ReportResponse, StatusUpdate
from .ai import demo_analyze, validate_image

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Civic Eye AI API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[x.strip() for x in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

def make_complaint_id(db: Session):
    while True:
        value = f"CE-{datetime.now().year}-{uuid.uuid4().hex[:5].upper()}"
        if not db.query(Report).filter(Report.complaint_id == value).first():
            return value

@app.get("/api/health")
def health():
    return {"ok": True, "service": "Civic Eye AI", "demo_mode": os.getenv("DEMO_MODE", "true").lower() == "true"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    allowed = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed:
        raise HTTPException(400, "Only JPG, JPEG, PNG and WEBP images are supported.")
    data = await file.read()
    try:
        validate_image(data)
        return demo_analyze(data)
    except ValueError as e:
        raise HTTPException(400, str(e))

@app.post("/api/reports", response_model=ReportResponse)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    report = Report(
        complaint_id=make_complaint_id(db),
        **payload.model_dump(),
        status="REPORTED",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@app.get("/api/reports", response_model=list[ReportResponse])
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@app.get("/api/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(404, "Report not found")
    return report

@app.patch("/api/reports/{report_id}/status", response_model=ReportResponse)
def update_status(report_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    valid = {"REPORTED", "UNDER REVIEW", "IN PROGRESS", "RESOLVED"}
    if payload.status not in valid:
        raise HTTPException(400, "Invalid status")
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(404, "Report not found")
    report.status = payload.status
    report.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(report)
    return report

@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(404, "Report not found")
    db.delete(report)
    db.commit()
    return {"ok": True}

@app.get("/api/statistics")
def statistics(db: Session = Depends(get_db)):
    total = db.query(func.count(Report.id)).scalar() or 0
    high = db.query(func.count(Report.id)).filter(Report.severity == "HIGH").scalar() or 0
    in_progress = db.query(func.count(Report.id)).filter(Report.status == "IN PROGRESS").scalar() or 0
    resolved = db.query(func.count(Report.id)).filter(Report.status == "RESOLVED").scalar() or 0

    categories = {}
    for category, count in db.query(Report.category, func.count(Report.id)).group_by(Report.category).all():
        categories[category] = count

    severities = {}
    for severity, count in db.query(Report.severity, func.count(Report.id)).group_by(Report.severity).all():
        severities[severity] = count

    statuses = {}
    for status, count in db.query(Report.status, func.count(Report.id)).group_by(Report.status).all():
        statuses[status] = count

    return {
        "total": total,
        "high": high,
        "in_progress": in_progress,
        "resolved": resolved,
        "categories": categories,
        "severities": severities,
        "statuses": statuses,
    }

@app.post("/api/demo/seed")
def seed_demo(db: Session = Depends(get_db)):
    if db.query(Report).count() > 0:
        return {"created": 0, "message": "Reports already exist."}

    samples = [
        ("Pothole", "HIGH", 95, 13.0827, 80.2707, "Reported road-surface damage."),
        ("Garbage / Waste Dumping", "MEDIUM", 89, 13.0674, 80.2376, "Accumulated waste reported."),
        ("Broken Streetlight", "HIGH", 92, 13.0569, 80.2425, "Possible broken streetlight reported."),
        ("Overflowing Drain", "HIGH", 90, 13.0475, 80.2090, "Possible blocked or overflowing drain."),
        ("Road Damage", "MEDIUM", 84, 13.0108, 80.2126, "Deteriorated road surface reported."),
        ("Water Leakage", "LOW", 81, 13.0335, 80.2676, "Possible water leakage reported."),
        ("Damaged Footpath", "MEDIUM", 86, 13.0732, 80.2609, "Damaged pedestrian path reported."),
        ("Traffic Signal Problem", "HIGH", 93, 13.0604, 80.2496, "Possible traffic signal issue reported."),
    ]
    for category, severity, confidence, lat, lng, desc in samples:
        action = "Inspect the location and arrange appropriate civic maintenance."
        r = Report(
            complaint_id=make_complaint_id(db),
            category=category,
            confidence=confidence,
            severity=severity,
            description=desc,
            recommended_action=action,
            complaint_text=f"Civic Eye demo report: {desc} {action}",
            latitude=lat,
            longitude=lng,
            address="Chennai, Tamil Nadu (demo location)",
            status="RESOLVED" if category == "Water Leakage" else "IN PROGRESS",
            source="DEMO_DATA",
        )
        db.add(r)
    db.commit()
    return {"created": len(samples), "message": "Demo reports loaded."}

@app.delete("/api/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    db.query(Report).delete()
    db.commit()
    return {"ok": True}
