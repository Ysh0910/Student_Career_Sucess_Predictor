"""
Prediction endpoint for career success predictions.
Handles POST requests to make predictions and store results.
"""
from fastapi import APIRouter, HTTPException, status
from models.schemas import StudentInput, PredictionResponse, ErrorResponse
from services.ml_service import MLService
from services.database_service import DatabaseService

router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    responses={
        500: {"model": ErrorResponse, "description": "Prediction service unavailable"},
        503: {"model": ErrorResponse, "description": "Database temporarily unavailable"}
    },
    summary="Predict student career success",
    description="Accepts student features and returns career success prediction with probability and confidence score"
)
async def predict_career_success(student: StudentInput):
    """
    Make a career success prediction for a student.
    
    Args:
        student: StudentInput model with validated features
        
    Returns:
        PredictionResponse: Contains predicted_label, probability, and confidence
        
    Raises:
        HTTPException: 500 if prediction fails, 503 if Firestore unavailable
    """
    try:
        # Initialize services
        ml_service = MLService()
        db_service = DatabaseService()
        
        # Convert Pydantic model to dict
        input_data = student.model_dump()
        
        # Make prediction
        prediction_result = ml_service.make_prediction(input_data)
        
        # Save prediction to database
        try:
            db_service.save_prediction(
                input_data=input_data,
                predicted_label=prediction_result['predicted_label'],
                probability=prediction_result['probability']
            )
        except Exception as db_error:
            # Log error but don't fail the request
            print(f"Warning: Failed to save prediction to database: {str(db_error)}")
        finally:
            db_service.close()
        
        # Return prediction response
        return PredictionResponse(
            predicted_label=prediction_result['predicted_label'],
            probability=prediction_result['probability'],
            confidence=prediction_result['confidence']
        )
        
    except Exception as e:
        error_message = str(e)
        
        # Check if it's a database error
        if "database" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable"
            )
        
        # Check if it's a model loading error
        if "pipeline" in error_message.lower() or "model" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Prediction service unavailable"
            )
        
        # Generic error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {error_message}"
        )
