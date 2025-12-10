"""
Metrics endpoint for model performance data.
Handles GET requests to retrieve model metrics and feature importances.
"""
from fastapi import APIRouter, HTTPException, status
from models.schemas import ModelMetrics, ErrorResponse
from services.database_service import DatabaseService

router = APIRouter()


@router.get(
    "/metrics",
    response_model=ModelMetrics,
    status_code=status.HTTP_200_OK,
    responses={
        404: {"model": ErrorResponse, "description": "Metrics not found"},
        503: {"model": ErrorResponse, "description": "Database temporarily unavailable"}
    },
    summary="Get model performance metrics",
    description="Returns model evaluation metrics, feature importances, and ROC curve data"
)
async def get_model_metrics():
    """
    Retrieve model performance metrics from Firestore.
    
    Returns:
        ModelMetrics: Contains accuracy, precision, recall, f1_score, roc_auc,
                      feature_importances, and roc_curve_data
        
    Raises:
        HTTPException: 404 if metrics don't exist, 503 if Firestore unavailable
    """
    try:
        # Initialize database service
        db_service = DatabaseService()
        
        # Retrieve metrics from database
        metrics_data = db_service.get_model_metrics()
        db_service.close()
        
        # Return metrics response
        return ModelMetrics(
            accuracy=metrics_data['accuracy'],
            precision=metrics_data['precision'],
            recall=metrics_data['recall'],
            f1_score=metrics_data['f1_score'],
            roc_auc=metrics_data['roc_auc'],
            feature_importances=metrics_data.get('feature_importances', []),
            roc_curve=metrics_data.get('roc_curve', {'fpr': [], 'tpr': []})
        )
        
    except Exception as e:
        error_message = str(e)
        
        # Check if metrics don't exist
        if "not found" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model metrics not found in database"
            )
        
        # Check if it's a database error
        if "database" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable"
            )
        
        # Generic error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve metrics: {error_message}"
        )
