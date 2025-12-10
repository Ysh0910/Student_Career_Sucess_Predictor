import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ModelMetrics, FeatureImportance, ROCCurveData } from '../types';
import FeatureImportanceChart from './FeatureImportanceChart';
import ROCCurveChart from './ROCCurveChart';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ModelMetrics>(`${API_URL}/metrics`);
      setMetrics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Model Dashboard</h1>
            <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold">Model Dashboard</h1>
            <Link to="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
          </div>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchMetrics}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Model Dashboard</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
            ← Back to Home
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <MetricCard title="Accuracy" value={metrics?.accuracy || 0} />
          <MetricCard title="Precision" value={metrics?.precision || 0} />
          <MetricCard title="Recall" value={metrics?.recall || 0} />
          <MetricCard title="F1 Score" value={metrics?.f1_score || 0} />
          <MetricCard title="ROC-AUC" value={metrics?.roc_auc || 0} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Feature Importance</h2>
            {metrics && <FeatureImportanceChart data={metrics.feature_importances} />}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">ROC Curve</h2>
            {metrics && <ROCCurveChart data={metrics.roc_curve} />}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-400">
        {(value * 100).toFixed(2)}%
      </p>
    </div>
  );
};

export default Dashboard;
