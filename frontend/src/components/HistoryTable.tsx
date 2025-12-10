import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PredictionRecord } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const HistoryTable: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<PredictionRecord[]>(`${API_URL}/history?limit=50`);
      setPredictions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Prediction History</h1>
            <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Prediction History</h1>
            <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          </div>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchHistory}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Prediction History</h1>
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              ← Back to Home
            </Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">No Predictions Yet</h2>
            <p className="text-gray-400 mb-6">
              Start making predictions to see them appear here
            </p>
            <Link
              to="/predict"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Make a Prediction
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Prediction History</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Field of Study
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Internships
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Soft Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Networking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Prediction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Probability
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {predictions.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                    } hover:bg-gray-700 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatTimestamp(record.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.University_GPA.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.Field_of_Study}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.Gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.Internships_Completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.Soft_Skills_Score.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {record.input.Networking_Score.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.predicted_label === 1
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {record.predicted_label === 1 ? 'Successful' : 'Not Successful'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {(record.probability * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-500 text-sm">
          Showing {predictions.length} most recent predictions
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
