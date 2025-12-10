import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StudentInput, PredictionResponse, FormErrors, FIELDS_OF_STUDY } from '../types';
import PredictionResult from './PredictionResult';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentInput>({
    University_GPA: 0,
    Field_of_Study: '',
    Gender: '',
    Internships_Completed: 0,
    Soft_Skills_Score: 0,
    Networking_Score: 0,
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'Field_of_Study' || name === 'Gender') ? value : parseFloat(value) || 0
    }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.University_GPA < 0 || formData.University_GPA > 10) {
      newErrors.University_GPA = 'GPA must be between 0 and 10';
    }

    if (!formData.Field_of_Study) {
      newErrors.Field_of_Study = 'Please select a field of study';
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Please select a gender';
    }

    if (formData.Internships_Completed < 0) {
      newErrors.Internships_Completed = 'Internships must be non-negative';
    }

    if (formData.Soft_Skills_Score < 0 || formData.Soft_Skills_Score > 10) {
      newErrors.Soft_Skills_Score = 'Score must be between 0 and 10';
    }

    if (formData.Networking_Score < 0 || formData.Networking_Score > 10) {
      newErrors.Networking_Score = 'Score must be between 0 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setPrediction(null);
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to make prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Career Success Prediction</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* University GPA */}
            <div>
              <label className="block text-sm font-medium mb-2">
                University GPA (0-10)
              </label>
              <input
                type="number"
                name="University_GPA"
                value={formData.University_GPA}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              {errors.University_GPA && (
                <p className="text-red-400 text-sm mt-1">{errors.University_GPA}</p>
              )}
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Field of Study
              </label>
              <select
                name="Field_of_Study"
                value={formData.Field_of_Study}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              >
                <option value="">Select a field</option>
                {FIELDS_OF_STUDY.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
              {errors.Field_of_Study && (
                <p className="text-red-400 text-sm mt-1">{errors.Field_of_Study}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.Gender && (
                <p className="text-red-400 text-sm mt-1">{errors.Gender}</p>
              )}
            </div>

            {/* Internships Completed */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Internships Completed
              </label>
              <input
                type="number"
                name="Internships_Completed"
                value={formData.Internships_Completed}
                onChange={handleChange}
                min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              {errors.Internships_Completed && (
                <p className="text-red-400 text-sm mt-1">{errors.Internships_Completed}</p>
              )}
            </div>

            {/* Soft Skills Score */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Soft Skills Score (0-10)
              </label>
              <input
                type="number"
                name="Soft_Skills_Score"
                value={formData.Soft_Skills_Score}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              {errors.Soft_Skills_Score && (
                <p className="text-red-400 text-sm mt-1">{errors.Soft_Skills_Score}</p>
              )}
            </div>

            {/* Networking Score */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Networking Score (0-10)
              </label>
              <input
                type="number"
                name="Networking_Score"
                value={formData.Networking_Score}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              {errors.Networking_Score && (
                <p className="text-red-400 text-sm mt-1">{errors.Networking_Score}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Predicting...
                </span>
              ) : (
                'Predict Career Success'
              )}
            </button>
          </form>

          {/* Prediction Result */}
          {prediction && (
            <div className="mt-8">
              <PredictionResult
                predicted_label={prediction.predicted_label}
                probability={prediction.probability}
                confidence={prediction.confidence}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
