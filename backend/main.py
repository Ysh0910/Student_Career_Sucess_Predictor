"""
Main FastAPI application entry point.
Configures CORS, middleware, routes, and exception handlers.
"""
import logging
import sys
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import predict, metrics, history

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Student Career Success Predictor API",
    description="API for predicting student career success using machine learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Include routers
app.include_router(predict.router, tags=["Predictions"])
app.include_router(metrics.router, tags=["Metrics"])
app.include_router(history.router, tags=["History"])


# Custom exception handlers
class DatabaseError(Exception):
    """Custom exception for database-related errors."""
    pass


class ModelLoadError(Exception):
    """Custom exception for model loading errors."""
    pass


@app.exception_handler(DatabaseError)
async def database_exception_handler(request: Request, exc: DatabaseError):
    """
    Handle database connection and operation errors.
    
    Returns:
        JSONResponse: 503 Service Unavailable
    """
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Database temporarily unavailable"}
    )


@app.exception_handler(ModelLoadError)
async def model_exception_handler(request: Request, exc: ModelLoadError):
    """
    Handle model loading and prediction errors.
    
    Returns:
        JSONResponse: 500 Internal Server Error
    """
    logger.error(f"Model load failed: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Prediction service unavailable"}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle all other unhandled exceptions.
    
    Returns:
        JSONResponse: 500 Internal Server Error
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred"}
    )


# Middleware for request/response logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all incoming requests and outgoing responses.
    """
    # Generate correlation ID for request tracking
    import uuid
    correlation_id = str(uuid.uuid4())
    
    # Log incoming request
    logger.info(f'{{"correlation_id": "{correlation_id}", "method": "{request.method}", "path": "{request.url.path}"}}')
    
    # Process request
    response = await call_next(request)
    
    # Log response
    logger.info(f'{{"correlation_id": "{correlation_id}", "status_code": {response.status_code}}}')
    
    return response


# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint for health check.
    
    Returns:
        dict: API status and version
    """
    return {
        "status": "healthy",
        "service": "Student Career Success Predictor API",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        dict: Service health status
    """
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
