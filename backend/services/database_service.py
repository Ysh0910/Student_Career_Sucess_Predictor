"""
SQLite database service module for database operations.
Handles connection initialization and data access methods.
"""
import os
import base64
import pickle
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Database setup
DATABASE_URL = "sqlite:///./career_predictor.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class TrainedPipeline(Base):
    """Model for storing the trained ML pipeline."""
    __tablename__ = "trained_pipeline"
    
    id = Column(Integer, primary_key=True, index=True)
    pipeline_base64 = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String, default="1.0")
    feature_names = Column(Text)  # JSON string


class ModelMetrics(Base):
    """Model for storing model performance metrics."""
    __tablename__ = "model_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    feature_importances = Column(Text)  # JSON string
    roc_curve = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)


class Prediction(Base):
    """Model for storing prediction records."""
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    input_data = Column(Text, nullable=False)  # JSON string
    predicted_label = Column(Integer, nullable=False)
    probability = Column(Float, nullable=False)


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class DatabaseService:
    """Service class for database operations."""
    
    def __init__(self):
        """Initialize database service with session."""
        self.db: Session = SessionLocal()
    
    def close(self):
        """Close database session."""
        self.db.close()
    
    def get_trained_pipeline(self) -> Any:
        """
        Retrieves and decodes the Base64 encoded ML pipeline from database.
        
        Returns:
            Pipeline: Deserialized scikit-learn Pipeline object
            
        Raises:
            Exception: If pipeline doesn't exist or decoding fails
        """
        try:
            pipeline_record = self.db.query(TrainedPipeline).order_by(
                TrainedPipeline.created_at.desc()
            ).first()
            
            if not pipeline_record:
                raise Exception("Trained pipeline not found in database")
            
            # Decode Base64 and deserialize pipeline
            pipeline_bytes = base64.b64decode(pipeline_record.pipeline_base64)
            pipeline = pickle.loads(pipeline_bytes)
            
            return pipeline
            
        except Exception as e:
            raise Exception(f"Failed to retrieve trained pipeline: {str(e)}")
    
    def get_model_metrics(self) -> Dict[str, Any]:
        """
        Fetches model performance metrics from database.
        
        Returns:
            dict: Model metrics including accuracy, precision, recall, f1_score, 
                  roc_auc, feature_importances, and roc_curve_data
                  
        Raises:
            Exception: If metrics don't exist
        """
        try:
            metrics_record = self.db.query(ModelMetrics).order_by(
                ModelMetrics.created_at.desc()
            ).first()
            
            if not metrics_record:
                raise Exception("Model metrics not found in database")
            
            metrics = {
                'accuracy': metrics_record.accuracy,
                'precision': metrics_record.precision,
                'recall': metrics_record.recall,
                'f1_score': metrics_record.f1_score,
                'roc_auc': metrics_record.roc_auc,
                'feature_importances': json.loads(metrics_record.feature_importances),
                'roc_curve': json.loads(metrics_record.roc_curve)
            }
            
            return metrics
            
        except Exception as e:
            raise Exception(f"Failed to retrieve model metrics: {str(e)}")
    
    def save_prediction(self, input_data: Dict[str, Any], predicted_label: int, 
                       probability: float) -> int:
        """
        Stores a prediction record in database with timestamp.
        
        Args:
            input_data: Dictionary containing student input features
            predicted_label: Predicted career success (0 or 1)
            probability: Prediction probability
            
        Returns:
            int: ID of the saved prediction
            
        Raises:
            Exception: If save operation fails
        """
        try:
            prediction = Prediction(
                input_data=json.dumps(input_data),
                predicted_label=predicted_label,
                probability=probability
            )
            
            self.db.add(prediction)
            self.db.commit()
            self.db.refresh(prediction)
            
            return prediction.id
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to save prediction: {str(e)}")
    
    def get_prediction_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieves recent prediction records sorted by timestamp descending.
        
        Args:
            limit: Maximum number of records to retrieve (default: 50)
            
        Returns:
            list: List of prediction records with id, timestamp, input, 
                  predicted_label, and probability
                  
        Raises:
            Exception: If query fails
        """
        try:
            predictions = self.db.query(Prediction).order_by(
                Prediction.timestamp.desc()
            ).limit(limit).all()
            
            result = []
            for pred in predictions:
                result.append({
                    'id': str(pred.id),
                    'timestamp': pred.timestamp.isoformat(),
                    'input': json.loads(pred.input_data),
                    'predicted_label': pred.predicted_label,
                    'probability': pred.probability
                })
            
            return result
            
        except Exception as e:
            raise Exception(f"Failed to retrieve prediction history: {str(e)}")
    
    def save_trained_pipeline(self, pipeline: Any, feature_names: List[str]) -> int:
        """
        Saves trained pipeline to database.
        
        Args:
            pipeline: Trained scikit-learn Pipeline
            feature_names: List of feature names
            
        Returns:
            int: ID of saved pipeline
        """
        try:
            # Serialize and encode pipeline
            pipeline_bytes = pickle.dumps(pipeline)
            pipeline_base64 = base64.b64encode(pipeline_bytes).decode('utf-8')
            
            pipeline_record = TrainedPipeline(
                pipeline_base64=pipeline_base64,
                feature_names=json.dumps(feature_names)
            )
            
            self.db.add(pipeline_record)
            self.db.commit()
            self.db.refresh(pipeline_record)
            
            return pipeline_record.id
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to save pipeline: {str(e)}")
    
    def save_model_metrics(self, metrics: Dict[str, Any]) -> int:
        """
        Saves model metrics to database.
        
        Args:
            metrics: Dictionary containing model metrics
            
        Returns:
            int: ID of saved metrics
        """
        try:
            metrics_record = ModelMetrics(
                accuracy=metrics['accuracy'],
                precision=metrics['precision'],
                recall=metrics['recall'],
                f1_score=metrics['f1_score'],
                roc_auc=metrics['roc_auc'],
                feature_importances=json.dumps(metrics['feature_importances']),
                roc_curve=json.dumps(metrics['roc_curve'])
            )
            
            self.db.add(metrics_record)
            self.db.commit()
            self.db.refresh(metrics_record)
            
            return metrics_record.id
            
        except Exception as e:
            self.db.rollback()
            raise Exception(f"Failed to save metrics: {str(e)}")
