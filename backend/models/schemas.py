"""
Pydantic models for request/response validation.
Defines data schemas for API endpoints.
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class StudentInput(BaseModel):
    """
    Input model for student career prediction request.
    Validates all student features with appropriate constraints.
    """
    University_GPA: float = Field(
        ge=0, 
        le=10, 
        description="University GPA score between 0 and 10"
    )
    Field_of_Study: str = Field(
        min_length=1,
        description="Student's field of study"
    )
    Gender: str = Field(
        min_length=1,
        description="Student's gender (Male/Female)"
    )
    Internships_Completed: int = Field(
        ge=0,
        description="Number of internships completed (non-negative)"
    )
    Soft_Skills_Score: float = Field(
        ge=0,
        le=10,
        description="Soft skills score between 0 and 10"
    )
    Networking_Score: float = Field(
        ge=0,
        le=10,
        description="Networking score between 0 and 10"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "University_GPA": 8.2,
                "Field_of_Study": "Computer Science",
                "Gender": "Male",
                "Internships_Completed": 2,
                "Soft_Skills_Score": 7.5,
                "Networking_Score": 8.0
            }
        }


class PredictionResponse(BaseModel):
    """
    Response model for career success prediction.
    Contains prediction label, probability, and confidence score.
    """
    predicted_label: int = Field(
        description="Predicted career success: 0 = Not Successful, 1 = Successful"
    )
    probability: float = Field(
        ge=0,
        le=1,
        description="Probability of successful career outcome"
    )
    confidence: float = Field(
        ge=0,
        le=1,
        description="Confidence score of the prediction"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "predicted_label": 1,
                "probability": 0.91,
                "confidence": 0.82
            }
        }


class FeatureImportance(BaseModel):
    """Model for individual feature importance."""
    feature: str = Field(description="Feature name")
    importance: float = Field(description="Importance value")


class ROCCurveData(BaseModel):
    """Model for ROC curve data."""
    fpr: List[float] = Field(description="False Positive Rate values")
    tpr: List[float] = Field(description="True Positive Rate values")


class ModelMetrics(BaseModel):
    """
    Response model for model performance metrics.
    Contains all evaluation metrics and feature importances.
    """
    accuracy: float = Field(description="Model accuracy score")
    precision: float = Field(description="Model precision score")
    recall: float = Field(description="Model recall score")
    f1_score: float = Field(description="Model F1 score")
    roc_auc: float = Field(description="ROC-AUC score")
    feature_importances: List[Dict[str, Any]] = Field(
        description="List of feature importance objects"
    )
    roc_curve: Dict[str, List[float]] = Field(
        description="ROC curve data with fpr and tpr arrays"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "accuracy": 0.87,
                "precision": 0.85,
                "recall": 0.86,
                "f1_score": 0.85,
                "roc_auc": 0.90,
                "feature_importances": [
                    {"feature": "University_GPA", "importance": 0.35},
                    {"feature": "Internships_Completed", "importance": 0.25}
                ],
                "roc_curve": {
                    "fpr": [0.0, 0.1, 0.2, 1.0],
                    "tpr": [0.0, 0.7, 0.9, 1.0]
                }
            }
        }


class PredictionRecord(BaseModel):
    """
    Model for prediction history record.
    Contains historical prediction data.
    """
    id: str = Field(description="Firestore document ID")
    timestamp: Optional[Any] = Field(description="Prediction timestamp")
    input: Dict[str, Any] = Field(description="Input features used for prediction")
    predicted_label: int = Field(description="Predicted label (0 or 1)")
    probability: float = Field(description="Prediction probability")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "abc123xyz",
                "timestamp": "2025-11-10T17:30:00Z",
                "input": {
                    "University_GPA": 8.2,
                    "Field_of_Study": "Computer Science",
                    "Internships_Completed": 2,
                    "Soft_Skills_Score": 7.5,
                    "Networking_Score": 8.0
                },
                "predicted_label": 1,
                "probability": 0.91
            }
        }


class ErrorResponse(BaseModel):
    """Model for error responses."""
    detail: str = Field(description="Error message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Database temporarily unavailable"
            }
        }
