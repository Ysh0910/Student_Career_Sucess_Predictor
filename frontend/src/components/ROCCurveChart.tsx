import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ROCCurveChartProps {
  data: {
    fpr: number[];
    tpr: number[];
  };
}

const ROCCurveChart: React.FC<ROCCurveChartProps> = ({ data }) => {
  const chartData = {
    labels: data.fpr.map((_, index) => index),
    datasets: [
      {
        label: 'ROC Curve',
        data: data.fpr.map((fpr, index) => ({ x: fpr, y: data.tpr[index] })),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Random Classifier',
        data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 0) {
              return `TPR: ${context.parsed.y.toFixed(3)}, FPR: ${context.parsed.x.toFixed(3)}`;
            }
            return context.dataset.label;
          }
        }
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'False Positive Rate',
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
        min: 0,
        max: 1,
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'True Positive Rate',
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
        },
        min: 0,
        max: 1,
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ROCCurveChart;
