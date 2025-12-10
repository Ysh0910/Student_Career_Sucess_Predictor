# Technical Implementation Guide

## Overview

This document explains the technical implementation of the Student Career Success Predictor, covering both frontend and backend architecture with code examples.

## Backend Implementation

### 1. Database Layer

The application uses SQLite with SQLAlchemy ORM for data persistence. Three main tables store the application data:

```python
class TrainedPipeline(Base):
    __tablename__ = "trained_pipeline"
    id = Column(Integer, primary_key=True)
    pipeline_base64 = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String, default="1.0")
    feature_names = Column(Text)

class ModelMetrics(Base):
    __tablename__ = "model_metrics"
    id = Column(Integer, primary_key=True)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    feature_importances = Column(Text)
    roc_curve = Column(Text)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    input_data = Column(Text, nullable=False)
    predicted_label = Column(Integer, nullable=False)
    probability = Column(Float, nullable=False)
```

The DatabaseService class handles all database operations with methods for retrieving the trained pipeline, saving predictions, and fetching metrics.

### 2. Machine Learning Service

The ML service implements a singleton pattern for pipeline caching to avoid repeated database calls:

```python
_cached_pipeline = None

def load_pipeline():
    global _cached_pipeline
    if _cached_pipeline is not None:
        return _cached_pipeline
    
    db_service = DatabaseService()
    _cached_pipeline = db_service.get_trained_pipeline()
    db_service.close()
    return _cached_pipeline
```

The prediction function preprocesses input data and calculates confidence scores:

```python
def predict(input_data):
    pipeline = load_pipeline()
    df = preprocess_input(input_data)
    predicted_label = int(pipeline.predict(df)[0])
    probability = float(pipeline.predict_proba(df)[0][1])
    return predicted_label, probability

def calculate_confidence(probability):
    return abs(probability - 0.5) * 2
```

The confidence calculation maps probabilities to a 0-1 scale where values near 0.5 indicate low confidence and values near 0 or 1 indicate high confidence.

### 3. API Layer

FastAPI provides the REST API with three main endpoints. The prediction endpoint validates input using Pydantic models:

```python
class StudentInput(BaseModel):
    University_GPA: float = Field(ge=0, le=10)
    Field_of_Study: str = Field(min_length=1)
    Gender: str = Field(min_length=1)
    Internships_Completed: int = Field(ge=0)
    Soft_Skills_Score: float = Field(ge=0, le=10)
    Networking_Score: float = Field(ge=0, le=10)

@router.post("/predict")
async def predict_career_success(student: StudentInput):
    ml_service = MLService()
    db_service = DatabaseService()
    
    input_data = student.model_dump()
    prediction_result = ml_service.make_prediction(input_data)
    
    db_service.save_prediction(
        input_data=input_data,
        predicted_label=prediction_result['predicted_label'],
        probability=prediction_result['probability']
    )
    
    return PredictionResponse(
        predicted_label=prediction_result['predicted_label'],
        probability=prediction_result['probability'],
        confidence=prediction_result['confidence']
    )
```

The metrics endpoint retrieves model performance data from the database:

```python
@router.get("/metrics")
async def get_model_metrics():
    db_service = DatabaseService()
    metrics_data = db_service.get_model_metrics()
    db_service.close()
    
    return ModelMetrics(
        accuracy=metrics_data['accuracy'],
        precision=metrics_data['precision'],
        recall=metrics_data['recall'],
        f1_score=metrics_data['f1_score'],
        roc_auc=metrics_data['roc_auc'],
        feature_importances=metrics_data['feature_importances'],
        roc_curve=metrics_data['roc_curve']
    )
```

The history endpoint returns paginated prediction records:

```python
@router.get("/history")
async def get_prediction_history(limit: int = Query(default=50, ge=1, le=100)):
    db_service = DatabaseService()
    predictions = db_service.get_prediction_history(limit=limit)
    db_service.close()
    
    return [PredictionRecord(**pred) for pred in predictions]
```

### 4. Model Training

The training script processes the dataset and creates a scikit-learn pipeline:

```python
def create_ml_pipeline():
    numerical_features = ['University_GPA', 'Soft_Skills_Score', 
                         'Networking_Score', 'Internships_Completed']
    categorical_features = ['Field_of_Study', 'Gender']
    
    numerical_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])
    
    categorical_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer([
        ('num', numerical_pipeline, numerical_features),
        ('cat', categorical_pipeline, categorical_features)
    ])
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        ))
    ])
    
    return pipeline
```

The target variable is created based on salary and career satisfaction:

```python
def create_target_variable(df):
    df['Career_Success'] = (
        (df['Starting_Salary'] >= 50000) & 
        (df['Career_Satisfaction'] >= 7)
    ).astype(int)
    return df
```

## Frontend Implementation

### 1. Type System

TypeScript interfaces ensure type safety across the application:

```typescript
interface StudentInput {
  University_GPA: number;
  Field_of_Study: string;
  Gender: string;
  Internships_Completed: number;
  Soft_Skills_Score: number;
  Networking_Score: number;
}

interface PredictionResponse {
  predicted_label: 0 | 1;
  probability: number;
  confidence: number;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  feature_importances: FeatureImportance[];
  roc_curve: ROCCurveData;
}
```

### 2. Routing and Layout

The App component sets up routing with React Router and includes the navigation and footer:

```typescript
function App() {
  return (
    <ErrorBoundary>
      <div className="dark">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Router>
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predict" element={<PredictionForm />} />
                <Route path="/history" element={<HistoryTable />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </div>
      </div>
    </ErrorBoundary>
  );
}
```

### 3. Prediction Form

The form component manages state and handles validation:

```typescript
const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentInput>({
    University_GPA: 0,
    Field_of_Study: '',
    Gender: '',
    Internships_Completed: 0,
    Soft_Skills_Score: 0,
    Networking_Score: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'Field_of_Study' || name === 'Gender') 
        ? value 
        : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const response = await axios.post<PredictionResponse>(
      `${API_URL}/predict`, 
      formData
    );
    setPrediction(response.data);
  };
```

Form validation ensures data integrity before submission:

```typescript
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (formData.University_GPA < 0 || formData.University_GPA > 10) {
    newErrors.University_GPA = 'GPA must be between 0 and 10';
  }
  
  if (!formData.Gender) {
    newErrors.Gender = 'Please select a gender';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4. Dashboard Component

The dashboard fetches and displays metrics using React hooks:

```typescript
const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get<ModelMetrics>(`${API_URL}/metrics`);
      setMetrics(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };
```

Metric cards display performance indicators:

```typescript
const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-400">
        {(value * 100).toFixed(2)}%
      </p>
    </div>
  );
};
```

### 5. Data Visualization

Chart.js integration for feature importance visualization:

```typescript
const FeatureImportanceChart: React.FC = ({ data }) => {
  const sortedData = [...data]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  const chartData = {
    labels: sortedData.map(item => item.feature),
    datasets: [{
      label: 'Importance',
      data: sortedData.map(item => item.importance),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  return <Bar data={chartData} options={options} />;
};
```

### 6. History Table

The history component displays past predictions in a table format:

```typescript
const HistoryTable: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await axios.get<PredictionRecord[]>(
        `${API_URL}/history?limit=50`
      );
      setPredictions(response.data);
    };
    fetchHistory();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>GPA</th>
          <th>Field of Study</th>
          <th>Prediction</th>
          <th>Probability</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map(record => (
          <tr key={record.id}>
            <td>{formatTimestamp(record.timestamp)}</td>
            <td>{record.input.University_GPA}</td>
            <td>{record.input.Field_of_Study}</td>
            <td>{record.predicted_label === 1 ? 'Successful' : 'Not Successful'}</td>
            <td>{(record.probability * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Key Design Patterns

### Backend Patterns

1. Singleton Pattern: ML pipeline caching to avoid repeated database loads
2. Repository Pattern: DatabaseService abstracts data access logic
3. Service Layer: Separates business logic from API routes
4. Dependency Injection: Services instantiated per request

### Frontend Patterns

1. Component Composition: Reusable components with props
2. Custom Hooks: Encapsulate stateful logic
3. Controlled Components: Form inputs managed by React state
4. Error Boundaries: Graceful error handling at component level

## Data Flow

The complete prediction flow follows this sequence:

1. User inputs data in PredictionForm component
2. Frontend validates input client-side
3. POST request sent to backend predict endpoint
4. Pydantic validates request data
5. MLService loads cached pipeline from database
6. Input preprocessed and converted to DataFrame
7. Pipeline applies encoding and scaling
8. RandomForest model generates prediction
9. Confidence score calculated from probability
10. Prediction saved to database
11. Response returned to frontend
12. PredictionResult component displays outcome

## Performance Optimizations

Backend optimizations include pipeline caching, database connection pooling, and efficient query design. Frontend optimizations include code splitting, lazy loading of chart components, and memoization of expensive computations.

The application achieves sub-2-second response times for predictions and maintains smooth UI interactions through proper state management and loading indicators.
