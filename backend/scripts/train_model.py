"""
ML Pipeline Training Script
Trains a Random Forest model on student career data and uploads to Firestore.
"""
import pandas as pd
import numpy as np
import base64
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, roc_curve
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.database_service import DatabaseService


def create_target_variable(df):
    """
    Create binary target variable: Career_Success
    Success = 1 if (Starting_Salary >= 50000 AND Career_Satisfaction >= 7) else 0
    """
    df['Career_Success'] = ((df['Starting_Salary'] >= 50000) & (df['Career_Satisfaction'] >= 7)).astype(int)
    return df


def load_and_preprocess_data(csv_path):
    """
    Load data from CSV and create target variable.
    """
    print("Loading data...")
    df = pd.read_csv(csv_path)
    
    print(f"Loaded {len(df)} records")
    
    # Create target variable
    df = create_target_variable(df)
    
    print(f"Target distribution: {df['Career_Success'].value_counts().to_dict()}")
    
    return df


def create_ml_pipeline():
    """
    Create scikit-learn Pipeline with preprocessing and model.
    """
    # Define feature columns
    numerical_features = ['University_GPA', 'Soft_Skills_Score', 'Networking_Score', 'Internships_Completed']
    categorical_features = ['Field_of_Study', 'Gender']
    
    # Numerical pipeline: impute with mean, then scale
    numerical_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])
    
    # Categorical pipeline: impute with most frequent, then one-hot encode
    categorical_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # Combine preprocessing steps
    preprocessor = ColumnTransformer([
        ('num', numerical_pipeline, numerical_features),
        ('cat', categorical_pipeline, categorical_features)
    ])
    
    # Full pipeline with Random Forest
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    return pipeline, numerical_features + categorical_features


def train_model(df, feature_columns):
    """
    Train the model and return pipeline and metrics.
    """
    print("\nPreparing features and target...")
    
    # Select features
    X = df[feature_columns]
    y = df['Career_Success']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Create and train pipeline
    print("\nTraining model...")
    pipeline, _ = create_ml_pipeline()
    pipeline.fit(X_train, y_train)
    
    # Make predictions
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    y_pred_proba = pipeline.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1_score': f1_score(y_test, y_pred),
        'roc_auc': roc_auc_score(y_test, y_pred_proba)
    }
    
    print("\nModel Performance:")
    for metric, value in metrics.items():
        print(f"  {metric}: {value:.4f}")
    
    # Get feature importances
    feature_names = []
    
    # Get feature names from preprocessor
    preprocessor = pipeline.named_steps['preprocessor']
    
    # Numerical features
    num_features = preprocessor.named_transformers_['num']
    feature_names.extend(preprocessor.transformers_[0][2])
    
    # Categorical features (one-hot encoded)
    cat_features = preprocessor.named_transformers_['cat']
    cat_feature_names = cat_features.named_steps['onehot'].get_feature_names_out(
        preprocessor.transformers_[1][2]
    )
    feature_names.extend(cat_feature_names)
    
    # Get importances
    importances = pipeline.named_steps['classifier'].feature_importances_
    
    feature_importances = [
        {'feature': name, 'importance': float(imp)}
        for name, imp in zip(feature_names, importances)
    ]
    
    # Sort by importance
    feature_importances.sort(key=lambda x: x['importance'], reverse=True)
    
    # Calculate ROC curve
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
    roc_curve_data = {
        'fpr': fpr.tolist(),
        'tpr': tpr.tolist()
    }
    
    return pipeline, metrics, feature_importances, roc_curve_data


def save_to_database(pipeline, metrics, feature_importances, roc_curve_data):
    """
    Save trained pipeline and metrics to SQLite database.
    """
    print("\nSaving to database...")
    
    db_service = DatabaseService()
    
    try:
        # Save pipeline
        print("Saving pipeline...")
        feature_names = ['University_GPA', 'Field_of_Study', 'Internships_Completed', 
                        'Soft_Skills_Score', 'Networking_Score']
        db_service.save_trained_pipeline(pipeline, feature_names)
        print("✓ Pipeline saved")
        
        # Save metrics
        print("Saving metrics...")
        metrics_data = {
            'accuracy': metrics['accuracy'],
            'precision': metrics['precision'],
            'recall': metrics['recall'],
            'f1_score': metrics['f1_score'],
            'roc_auc': metrics['roc_auc'],
            'feature_importances': feature_importances[:10],  # Top 10
            'roc_curve': roc_curve_data
        }
        db_service.save_model_metrics(metrics_data)
        print("✓ Metrics saved")
        
        print("\n✓ All data successfully saved to database!")
        
    finally:
        db_service.close()


def main():
    """
    Main training workflow.
    """
    print("=" * 60)
    print("Student Career Success Predictor - Model Training")
    print("=" * 60)
    
    # Check if CSV file exists
    csv_path = 'data/student_career_data.csv'
    
    if not os.path.exists(csv_path):
        print(f"\nError: Data file not found at {csv_path}")
        print("\nPlease download the dataset from:")
        print("https://www.kaggle.com/datasets/adilshamim8/education-and-career-success")
        print("\nAnd place it in the backend/data/ directory")
        return
    
    try:
        # Load data
        df = load_and_preprocess_data(csv_path)
        
        # Define features
        feature_columns = ['University_GPA', 'Field_of_Study', 'Gender', 
                          'Internships_Completed', 'Soft_Skills_Score', 'Networking_Score']
        
        # Train model
        pipeline, metrics, feature_importances, roc_curve_data = train_model(df, feature_columns)
        
        # Save to database
        save_to_database(pipeline, metrics, feature_importances, roc_curve_data)
        
        print("\n" + "=" * 60)
        print("Training complete! You can now start the application.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
