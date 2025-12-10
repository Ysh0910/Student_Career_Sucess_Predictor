"""
History endpoint for prediction records.
Handles GET requests to retrieve prediction history.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import List
from models.schemas import PredictionRecord, ErrorResponse
from services.database_service import DatabaseService

router = APIRouter()


@router.get(
    "/history",
    response_model=List[PredictionRecord],
    status_code=status.HTTP_200_OK,
    responses={
        503: {"model": ErrorResponse, "description": "Database temporarily unavailable"}
    },
    summary="Get prediction history",
    description="Returns a list of recent prediction records sorted by timestamp descending"
)
async def get_prediction_history(
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
        description="Maximum number of records to retrieve"
    )
):
    """
    Retrieve prediction history from Firestore.
    
    Args:
        limit: Maximum number of records to return (default: 50, max: 100)
        
    Returns:
        List[PredictionRecord]: List of prediction records with id, timestamp,
                                input, predicted_label, and probability
        
    Raises:
        HTTPException: 503 if Firestore unavailable
    """
    try:
        # Initialize database service
        db_service = DatabaseService()
        
        # Retrieve prediction history
        predictions = db_service.get_prediction_history(limit=limit)
        db_service.close()
        
        # If no predictions exist, return empty list
        if not predictions:
            return []
        
        # Convert to PredictionRecord models
        prediction_records = []
        for pred in predictions:
            prediction_records.append(
                PredictionRecord(
                    id=pred['id'],
                    timestamp=pred['timestamp'],
                    input=pred['input'],
                    predicted_label=pred['predicted_label'],
                    probability=pred['probability']
                )
            )
        
        return prediction_records
        
    except Exception as e:
        error_message = str(e)
        
        # Check if it's a database error
        if "database" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable"
            )
        
        # Generic error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve prediction history: {error_message}"
        )
