# Civic Eye AI

AI-powered civic issue reporting platform for hackathons.

## Features
- Civic issue image upload
- Demo AI analysis (works without an API key)
- Optional vision API integration point
- Severity and confidence
- Browser geolocation + manual location
- SQLite persistence
- Civic map using Leaflet/OpenStreetMap
- Admin dashboard
- Analytics
- Report status tracking
- Responsive React UI

## Run

### Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually http://localhost:5173.

No API key is required. The default `DEMO_MODE=true` provides deterministic demo AI analysis.

## Optional AI
The project includes an abstraction for a real vision provider. Set an AI provider/key in `backend/.env` and replace the implementation in `backend/app/ai.py` with the provider SDK/API you are allowed to use at the hackathon. Never commit secrets.

## Demo flow
1. Report Issue
2. Upload any image
3. Run AI Analysis
4. Allow location or enter coordinates
5. Review and submit
6. Open Dashboard/Map
7. Open Admin and change status
