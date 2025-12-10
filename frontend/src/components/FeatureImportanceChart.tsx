import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeatureImportanceChartProps {
  data: Array<{ feature: string; importance: number }>;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  // Sort by importance and take top 10
  const sortedData = [...data]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  const chartData = {
    labels: sortedData.map(item => item.feature),
    datasets: [
      {
        label: 'Importance',
        data: sortedData.map(item => item.importance),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `Importance: ${(context.parsed.x * 100).toFixed(2)}%`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value: any) {
            return (value * 100).toFixed(0) + '%';
          }
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FeatureImportanceChart;
