/**
 * TypeScript interfaces and types for the Student Career Success Predictor.
 * These types match the backend Pydantic models for type safety.
 */

/**
 * Student input data for career success prediction.
 */
export interface StudentInput {
  University_GPA: number;
  Field_of_Study: string;
  Gender: string;
  Internships_Completed: number;
  Soft_Skills_Score: number;
  Networking_Score: number;
}

/**
 * Prediction response from the API.
 */
export interface PredictionResponse {
  predicted_label: 0 | 1;
  probability: number;
  confidence: number;
}

/**
 * Model performance metrics.
 */
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  feature_importances: FeatureImportance[];
  roc_curve: ROCCurveData;
}

/**
 * Individual feature importance data.
 */
export interface FeatureImportance {
  feature: string;
  importance: number;
}

/**
 * ROC curve data for visualization.
 */
export interface ROCCurveData {
  fpr: number[];
  tpr: number[];
}

/**
 * Historical prediction record.
 */
export interface PredictionRecord {
  id: string;
  timestamp: string;
  input: StudentInput;
  predicted_label: 0 | 1;
  probability: number;
}

/**
 * API error response.
 */
export interface ErrorResponse {
  detail: string;
}

/**
 * Form validation errors.
 */
export interface FormErrors {
  University_GPA?: string;
  Field_of_Study?: string;
  Gender?: string;
  Internships_Completed?: string;
  Soft_Skills_Score?: string;
  Networking_Score?: string;
}

/**
 * Available fields of study options.
 */
export const FIELDS_OF_STUDY = [
  'Computer Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Psychology',
  'Sociology',
  'Political Science',
  'English Literature',
  'History',
  'Other'
] as const;

export type FieldOfStudy = typeof FIELDS_OF_STUDY[number];
