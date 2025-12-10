# Dataset Directory

## Required Dataset

Place the student career dataset CSV file here.

### Download Instructions

1. Visit: https://www.kaggle.com/datasets/adilshamim8/education-and-career-success
2. Download the CSV file
3. Rename it to: `student_career_data.csv`
4. Place it in this directory

### Expected File

```
backend/data/student_career_data.csv
```

### Required Columns

The dataset should contain the following columns:
- University_GPA
- Field_of_Study
- Gender
- Internships_Completed
- Soft_Skills_Score
- Networking_Score
- Salary
- Career_Satisfaction

### After Downloading

Run the training script to train the model:

```bash
cd backend
python scripts/train_model.py
```

This will:
1. Load the data from this directory
2. Train the Random Forest model
3. Upload the model and metrics to Firestore
