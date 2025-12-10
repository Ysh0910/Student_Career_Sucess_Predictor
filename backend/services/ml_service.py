"""
ML service module for model loading and predictions.
Handles pipeline caching and inference operations.
"""
import pandas as pd
from typing import Dict, Any, Tuple, Optional
from .database_service import DatabaseService

# Global pipeline cache (singleton pattern)
_cached_pipeline: Optional[Any] = None


def load_pipeline():
    """
    Loads the ML pipeline from database with caching.
    Uses singleton pattern to avoid repeated database calls.
    
    Returns:
        Pipeline: Cached or newly loaded scikit-learn Pipeline
        
    Raises:
        Exception: If pipeline loading fails
    """
    global _cached_pipeline
    
    if _cached_pipeline is not None:
        return _cached_pipeline
    
    try:
        db_service = DatabaseService()
        _cached_pipeline = db_service.get_trained_pipeline()
        db_service.close()
        return _cached_pipeline
    except Exception as e:
        raise Exception(f"Failed to load pipeline: {str(e)}")


def preprocess_input(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Converts input dictionary to pandas DataFrame with correct column order.
    
    Args:
        data: Dictionary containing student features
        
    Returns:
        pd.DataFrame: Single-row DataFrame ready for pipeline processing
    """
    # Define expected feature order (must match training order)
    feature_columns = [
        'University_GPA',
        'Field_of_Study',
        'Gender',
        'Internships_Completed',
        'Soft_Skills_Score',
        'Networking_Score'
    ]
    
    # Create DataFrame with single row
    df = pd.DataFrame([data], columns=feature_columns)
    
    return df



def calculate_confidence(probability: float) -> float:
    """
    Calculates confidence score from prediction probability.
    
    Confidence is higher when probability is closer to 0 or 1,
    and lower when probability is closer to 0.5.
    
    Formula: abs(probability - 0.5) * 2
    
    Args:
        probability: Prediction probability (0 to 1)
        
    Returns:
        float: Confidence score (0 to 1)
    """
    return abs(probability - 0.5) * 2


def predict(input_data: Dict[str, Any]) -> Tuple[int, float]:
    """
    Makes a career success prediction for a student.
    
    Args:
        input_data: Dictionary containing student features:
            - University_GPA: float (0-10)
            - Field_of_Study: str
            - Gender: str (Male/Female)
            - Internships_Completed: int (>=0)
            - Soft_Skills_Score: float (0-10)
            - Networking_Score: float (0-10)
    
    Returns:
        tuple: (predicted_label, probability)
            - predicted_label: int (0 = Not Successful, 1 = Successful)
            - probability: float (probability of positive class)
            
    Raises:
        Exception: If prediction fails or times out
    """
    try:
        # Load pipeline (cached after first call)
        pipeline = load_pipeline()
        
        # Preprocess input to DataFrame
        df = preprocess_input(input_data)
        
        # Make prediction
        predicted_label = int(pipeline.predict(df)[0])
        
        # Get probability for positive class (index 1)
        probability = float(pipeline.predict_proba(df)[0][1])
        
        return predicted_label, probability
        
    except Exception as e:
        raise Exception(f"Prediction failed: {str(e)}")


class MLService:
    """Service class for ML operations."""
    
    def __init__(self):
        """Initialize ML service."""
        pass
    
    def make_prediction(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Makes a prediction and returns complete response with confidence.
        
        Args:
            input_data: Dictionary containing student features
            
        Returns:
            dict: Contains predicted_label, probability, and confidence
        """
        predicted_label, probability = predict(input_data)
        confidence = calculate_confidence(probability)
        
        return {
            'predicted_label': predicted_label,
            'probability': probability,
            'confidence': confidence
        }
