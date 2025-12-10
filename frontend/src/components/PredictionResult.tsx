import React from 'react';

interface PredictionResultProps {
  predicted_label: 0 | 1;
  probability: number;
  confidence: number;
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  predicted_label,
  probability,
  confidence
}) => {
  const isSuccessful = predicted_label === 1;
  const isHighConfidence = confidence > 0.5;

  return (
    <div className={`rounded-lg p-6 border-2 transition-all duration-300 ${
      isSuccessful 
        ? 'bg-green-900/20 border-green-500' 
        : 'bg-red-900/20 border-red-500'
    }`}>
      <div className="text-center">
        <div className="mb-4">
          <div className={`text-6xl mb-2 ${isSuccessful ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccessful ? '✓' : '✗'}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isSuccessful ? 'Successful Career Predicted' : 'Career Success Unlikely'}
          </h2>
          <p className="text-gray-400">
            {isSuccessful 
              ? 'This student is predicted to have a successful career outcome'
              : 'This student may face challenges in achieving career success'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Probability */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Probability</p>
            <p className="text-2xl font-bold text-blue-400">
              {(probability * 100).toFixed(2)}%
            </p>
            <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isSuccessful ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${probability * 100}%` }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Confidence</p>
            <p className="text-2xl font-bold text-purple-400">
              {(confidence * 100).toFixed(2)}%
            </p>
            <div className="mt-2 flex items-center justify-center">
              {isHighConfidence ? (
                <span className="text-green-400 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  High Confidence
                </span>
              ) : (
                <span className="text-yellow-400 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Moderate Confidence
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            The model predicts a <strong>{(probability * 100).toFixed(2)}%</strong> probability 
            of career success with <strong>{(confidence * 100).toFixed(2)}%</strong> confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
