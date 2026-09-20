from PIL import Image
import hashlib
import io

CATEGORIES = [
    "Pothole", "Garbage / Waste Dumping", "Overflowing Drain",
    "Broken Streetlight", "Road Damage", "Water Leakage",
    "Damaged Footpath", "Illegal Dumping", "Traffic Signal Problem",
    "Other Civic Issue"
]

def demo_analyze(image_bytes: bytes):
    """Deterministic demo analysis. It does not claim to be real computer vision."""
    digest = hashlib.sha256(image_bytes).digest()
    idx = digest[0] % len(CATEGORIES)
    category = CATEGORIES[idx]
    severity = ["LOW", "MEDIUM", "HIGH"][digest[1] % 3]
    confidence = float(78 + digest[2] % 21)

    descriptions = {
        "Pothole": "A road-surface defect consistent with a pothole is being reported.",
        "Garbage / Waste Dumping": "Accumulated waste is visible in a public-area context.",
        "Overflowing Drain": "The image is being classified as a possible overflowing or blocked drain.",
        "Broken Streetlight": "A possible damaged or non-functional streetlight is being reported.",
        "Road Damage": "Visible deterioration of the road surface is being reported.",
        "Water Leakage": "The image is being classified as a possible water leakage issue.",
        "Damaged Footpath": "Possible damage to a pedestrian footpath is being reported.",
        "Illegal Dumping": "The image is being classified as a possible unauthorized dumping location.",
        "Traffic Signal Problem": "A possible traffic-signal or signal-equipment issue is being reported.",
        "Other Civic Issue": "The image does not map cleanly to the supported civic categories."
    }
    actions = {
        "Pothole": "Inspect the road and repair the damaged surface.",
        "Garbage / Waste Dumping": "Arrange waste collection and inspect the location.",
        "Overflowing Drain": "Inspect and clear the drain; check for blockage.",
        "Broken Streetlight": "Inspect the lighting unit and restore service.",
        "Road Damage": "Inspect the affected road section and schedule repair.",
        "Water Leakage": "Inspect the water line and stop the leak.",
        "Damaged Footpath": "Inspect the pedestrian path and repair unsafe sections.",
        "Illegal Dumping": "Inspect the location and arrange appropriate waste removal.",
        "Traffic Signal Problem": "Inspect the signal equipment and restore safe operation.",
        "Other Civic Issue": "Route the report for manual civic inspection."
    }
    description = descriptions[category]
    action = actions[category]
    complaint = (
        f"Civic infrastructure issue reported as {category} with {severity.lower()} severity. "
        f"{description} {action}"
    )
    return {
        "category": category,
        "confidence": confidence,
        "severity": severity,
        "description": description,
        "recommended_action": action,
        "complaint_text": complaint,
        "source": "DEMO_AI"
    }

def validate_image(image_bytes: bytes):
    if len(image_bytes) > 8 * 1024 * 1024:
        raise ValueError("Image is larger than the 8 MB limit.")
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
    except Exception:
        raise ValueError("Please upload a valid JPG, JPEG, PNG, or WEBP image.")
