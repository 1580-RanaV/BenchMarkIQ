'use client'

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

  // Radar chart data
  const radarData = {
    labels: comparisons.map((comp) => comp.name),
    datasets: [
      {
        label: 'Your Company',
        data: comparisons.map((comp) =>
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
          font: { size: 12 },
          color: 'rgba(255,255,255,0.85)',
        },
      },
      tooltip: {
        titleColor: '#fff',
        bodyColor: '#fff',
        backgroundColor: 'rgba(17,17,17,0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const comparison = comparisons[context.dataIndex]
            if (context.datasetIndex === 0) {
              return `Your Company: ${comparison.yourValue}${comparison.unit}`
            } else {
              return `Industry Median: ${comparison.benchmark}${comparison.unit}`
            }
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        grid: { color: 'rgba(255,255,255,0.12)' },
        angleLines: { color: 'rgba(255,255,255,0.12)' },
        pointLabels: { color: 'rgba(255,255,255,0.85)' },
        ticks: {
          display: false,
          backdropColor: 'transparent',
          color: 'rgba(255,255,255,0.8)',
        },
      },
    },
  }

  // Bar chart data
  const barData = {
    labels: comparisons.map((comp) => comp.name),
    datasets: [
      {
        label: 'Difference from Median (%)',
        data: comparisons.map((comp) => comp.percentDifference),
        backgroundColor: comparisons.map((comp) => {
          if (comp.status === 'positive') return 'rgba(34, 197, 94, 0.8)'
          if (comp.status === 'negative') return 'rgba(239, 68, 68, 0.8)'
          return 'rgba(107, 114, 128, 0.8)'
        }),
        borderColor: comparisons.map((comp) => {
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
      legend: { display: false },
      tooltip: {
        titleColor: '#fff',
        bodyColor: '#fff',
        backgroundColor: 'rgba(17,17,17,0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y
            return `${value > 0 ? '+' : ''}${value}% vs median`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.08)' },
        ticks: {
          color: 'rgba(255,255,255,0.8)',
          maxRotation: 45,
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.08)' },
        ticks: {
          color: 'rgba(255,255,255,0.8)',
          callback: function (value) {
            return value + '%'
          },
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Card */}
      <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 p-6 md:p-8 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            Performance Overview
          </h3>
          <p className="text-sm text-neutral-400">
            Radar view of all KPIs compared to industry medians
          </p>
        </div>
        <div className="h-80">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      {/* Bar Card */}
      <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 p-6 md:p-8 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            Variance from Median
          </h3>
          <p className="text-sm text-neutral-400">
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
