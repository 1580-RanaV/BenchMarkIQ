'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Radar, Bar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
)

export default function ChartsSection({ comparisons }) {
  // Normalize data for radar chart (0-100 scale)
  const normalizeValue = (value, benchmark) => {
    const ratio = value / benchmark
    return Math.min(Math.max(ratio * 50, 0), 100) // Scale around 50 as median
  }

  const radarData = {
    labels: comparisons.map(comp => comp.name),
    datasets: [
      {
        label: 'Your Company',
        data: comparisons.map(comp => 
          normalizeValue(comp.yourValue, comp.benchmark)
        ),
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(14, 165, 233)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(14, 165, 233)',
      },
      {
        label: 'Industry Median',
        data: comparisons.map(() => 50), // Median is always 50 in normalized scale
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgb(107, 114, 128)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(107, 114, 128)',
        pointBorderColor: '#fff',
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const comparison = comparisons[context.dataIndex]
            if (context.datasetIndex === 0) {
              return `Your Company: ${comparison.yourValue}${comparison.unit}`
            } else {
              return `Industry Median: ${comparison.benchmark}${comparison.unit}`
            }
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          display: false,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const barData = {
    labels: comparisons.map(comp => comp.name),
    datasets: [
      {
        label: 'Difference from Median (%)',
        data: comparisons.map(comp => comp.percentDifference),
        backgroundColor: comparisons.map(comp => {
          if (comp.status === 'positive') return 'rgba(34, 197, 94, 0.8)'
          if (comp.status === 'negative') return 'rgba(239, 68, 68, 0.8)'
          return 'rgba(107, 114, 128, 0.8)'
        }),
        borderColor: comparisons.map(comp => {
          if (comp.status === 'positive') return 'rgb(34, 197, 94)'
          if (comp.status === 'negative') return 'rgb(239, 68, 68)'
          return 'rgb(107, 114, 128)'
        }),
        borderWidth: 1,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y
            return `${value > 0 ? '+' : ''}${value}% vs median`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <div className="card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 tracking-tighter">
            Performance Overview
          </h3>
          <p className="text-sm text-gray-600">
            Radar view of all KPIs compared to industry medians
          </p>
        </div>
        <div className="h-80">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 tracking-tighter">
            Variance from Median
          </h3>
          <p className="text-sm text-gray-600">
            Percentage difference from industry benchmarks
          </p>
        </div>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  )
}