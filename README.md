# Student Career Success Predictor

> **Machine Learning Subject Mini Project**

A full-stack web application that predicts student career success using a pretrained Random Forest model based on academic, skill, and demographic data. This project demonstrates the practical application of machine learning in a real-world web application context.

## 📋 Overlay
The **Student Career Success Predictor** leverages machine learning to predict student career success based on academic performance, skills, and demographic data. The application provides real-time predictions with confidence scores, comprehensive model metrics visualization, and historical prediction tracking.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)             │
│  - User Interface                                            │
│  - Data Visualization                                        │
│  - Form Validation                                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (FastAPI + Python)                │
│  - REST API Endpoints                                        │
│  - ML Model Inference                                        │
│  - Business Logic                                            │
└────────────────────────┬────────────────────────────────────┘
                         │ SQLAlchemy ORM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Database (SQLite)                         │
│  - Trained ML Model Storage                                  │
│  - Model Metrics                                             │
│  - Prediction History                                        │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

- **Dashboard**: View model performance metrics (accuracy, precision, recall, F1, ROC-AUC)
- **Predictions**: Real-time career success predictions with confidence scores
- **Visualizations**: Feature importance bar charts and ROC curves
- **History**: Track all previous predictions
- **Dark Mode**: Professional dark-themed UI with Tailwind CSS
- **Persistent Storage**: All data stored in SQLite database

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** for visualizations
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **FastAPI** (Python)
- **scikit-learn** for ML pipeline
- **SQLAlchemy** for database interactions
- **Uvicorn** ASGI server

### Database
- **SQLite** (local file-based database)

### Deployment
- **Docker** & **Docker Compose**

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Docker and Docker Compose (optional, for containerized deployment)

### 0. Clone the repository

```bash
git clone https://github.com/Ysh0910/Student_Career_Sucess_Predictor.git
cd Student_Career_Sucess_Predictor
```

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional)
cp .env.example .env
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 3. Train and Save Model (Important)

Before running the application, you need to train the model and save it to the database:

```bash
cd backend

# Run the training script
python scripts/train_model.py
```

This script will:
- Load and process the dataset
- Train the Random Forest model
- Calculate performance metrics
- Save the model and metrics to the SQLite database (`career_predictor.db`)

## 🏃 Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# From project root
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🧠 Model Information

- **Algorithm**: Random Forest Classifier
- **Features**: University GPA, Field of Study, Internships, Soft Skills Score, Networking Score
- **Target**: Career Success (Salary >= 50000 AND Career Satisfaction >= 7)
- **Performance**: ~87% accuracy, ~90% ROC-AUC

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── routes/                 # API endpoints
│   ├── services/               # Business logic
│   ├── models/                 # Pydantic schemas
│   ├── scripts/                # Utility scripts
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   └── App.tsx            # Main app component
│   └── package.json           # Node dependencies
├── docker-compose.yml         # Docker Compose config
└── README.md                  # This file
```

## 📄 License

MIT License
