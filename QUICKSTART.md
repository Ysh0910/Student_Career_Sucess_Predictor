# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.10+ installed
- [ ] Dataset downloaded from Kaggle

## Step-by-Step Setup

### 1. Clone and Navigate
```bash
cd StudentCareerSuccessPredictor
```

### 2. Download Dataset
1. Go to: https://www.kaggle.com/datasets/adilshamim8/education-and-career-success
2. Download the CSV file
3. Create `backend/data/` directory
4. Place CSV as `backend/data/student_career_data.csv`

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Train Model (One-time)
```bash
# Still in backend directory with venv activated
python scripts/train_model.py
```

Wait for "Training complete!" message.

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

### 6. Run Application

**Option A: Docker (Easiest)**
```bash
# From project root
docker-compose up --build
```

**Option B: Manual**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 7. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Verification Steps

1. **Check Backend Health**
   - Visit http://localhost:8000/health
   - Should see: `{"status": "healthy"}`

2. **Check Dashboard**
   - Visit http://localhost:3000/dashboard
   - Should see model metrics and charts

3. **Make a Prediction**
   - Visit http://localhost:3000/predict
   - Fill in the form
   - Submit and verify you get a result

4. **Check History**
   - Visit http://localhost:3000/history
   - Should see your prediction in the table

## Troubleshooting

### "Model not found" error
- Run the training script: `python backend/scripts/train_model.py`
- Verify `career_predictor.db` was created in the backend directory

### CORS errors
- Check backend is running on port 8000
- Verify `CORS_ORIGINS=http://localhost:3000` in backend/.env

### "Cannot find module" errors (Frontend)
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Import errors (Backend)
- Activate virtual environment
- Run `pip install -r requirements.txt` again

## Next Steps

- Explore the API documentation at http://localhost:8000/docs
- Make predictions with different student profiles
- View the model performance metrics on the dashboard
- Check prediction history to see all past predictions

## Support

For issues, check:
1. README.md for detailed documentation
2. Backend logs for API errors
3. Browser console for frontend errors
4. SQLite database file (career_predictor.db) exists
