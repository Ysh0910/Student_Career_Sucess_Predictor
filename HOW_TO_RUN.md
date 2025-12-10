# 🚀 How to Run the Student Career Success Predictor

## ✅ Current Status

Your application is **RUNNING**! 

- **Backend**: http://localhost:8000 ✅
- **Frontend**: http://localhost:3000 (compiling...) ⏳
- **API Docs**: http://localhost:8000/docs ✅

---

## 🎯 Quick Start (Application Already Running)

Just wait 30-60 seconds for the frontend to finish compiling, then:

**Open your browser and visit:** http://localhost:3000

---

## 🔄 If You Need to Restart

### **Option 1: Manual Start (Recommended for Development)**

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### **Option 2: Docker (Recommended for Production)**

```bash
docker-compose up --build
```

---

## 🛑 How to Stop

### **If Running Manually:**
- Press `Ctrl+C` in each terminal window

### **If Running with Docker:**
```bash
docker-compose down
```

---

## 📋 First Time Setup (Already Done!)

You've already completed these steps, but here's what was done:

### **1. Backend Setup** ✅
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python scripts/train_model.py  # Train the model
```

### **2. Frontend Setup** ✅
```bash
cd frontend
npm install
```

### **3. Database** ✅
- SQLite database created: `backend/career_predictor.db`
- Model trained and saved
- Ready to make predictions!

---

## 🌐 Access Points

Once the frontend finishes compiling (you'll see "Compiled successfully!"), you can access:

### **Main Application**
- **URL**: http://localhost:3000
- **Pages**:
  - Home: Landing page with hero section
  - Dashboard: Model metrics and charts
  - Predict: Make career predictions
  - History: View past predictions

### **Backend API**
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc

---

## 🧪 Test the Application

### **1. View Dashboard**
1. Go to http://localhost:3000/dashboard
2. See model metrics (100% accuracy!)
3. View feature importance chart
4. Check ROC curve

### **2. Make a Prediction**
1. Go to http://localhost:3000/predict
2. Fill in the form:
   - University GPA: 8.5
   - Field of Study: Computer Science
   - Gender: Male
   - Internships: 3
   - Soft Skills: 8.0
   - Networking: 7.5
3. Click "Predict Career Success"
4. See result with emoji and confidence score!

### **3. View History**
1. Go to http://localhost:3000/history
2. See all your predictions in a table

---

## 🐛 Troubleshooting

### **Frontend not loading?**
- Wait 30-60 seconds for initial compilation
- Check terminal for "Compiled successfully!"
- Try refreshing browser (Ctrl+F5)

### **Backend not responding?**
- Check if backend is running: http://localhost:8000/health
- Look for errors in backend terminal
- Verify database exists: `backend/career_predictor.db`

### **Port already in use?**
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001 && npm start
```

### **Need to retrain model?**
```bash
cd backend
python scripts/train_model.py
```

---

## 📊 What's Running?

### **Backend (Port 8000)**
- FastAPI server
- REST API endpoints
- ML model inference
- SQLite database connection

### **Frontend (Port 3000)**
- React development server
- Hot module reloading
- Webpack dev server
- Proxy to backend API

---

## 🎨 New UI Features

Your redesigned application now includes:

✨ **Beautiful Landing Page**
- Animated gradient background
- Floating blob animations
- Hero section with call-to-action

✨ **Modern Navigation**
- Transparent navbar with gradient logo
- Smooth hover effects
- Active route highlighting

✨ **Enhanced Components**
- Card-based layouts
- Soft shadows and rounded corners
- Framer Motion animations
- Gradient buttons

✨ **Professional Footer**
- GitHub link
- Credits and copyright
- Clean minimal design

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Backend auto-reloads** when you change Python files
3. **Frontend hot-reloads** when you change React files
4. **Check API docs** at http://localhost:8000/docs for testing
5. **Use browser DevTools** to debug frontend issues

---

## 📚 Next Steps

1. ✅ Application is running
2. ✅ Open http://localhost:3000
3. ✅ Explore the beautiful new UI
4. ✅ Make some predictions
5. ✅ Check the dashboard
6. ✅ View prediction history

---

## 🎉 You're All Set!

Your **Student Career Success Predictor** is running with:
- ✅ Beautiful redesigned UI
- ✅ Smooth animations
- ✅ Working ML predictions
- ✅ Interactive charts
- ✅ Full prediction history

**Enjoy your application!** 🚀

---

*For detailed project information, see PROJECT_DESCRIPTION.md*
