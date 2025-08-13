'use client'

import { useMemo } from 'react'
import ChartsSection from './ChartsSection'
import InsightsSection from './InsightsSection'
import { calculateComparisons } from '../utils/calculations'
import { generateInsights } from '../utils/insights'

export default function ResultsDisplay({ data, industry, benchmarks, onBack }) {
  const comparisons = useMemo(() => {
    return calculateComparisons(data, benchmarks)
  }, [data, benchmarks])

  const insights = useMemo(() => {
    return generateInsights(comparisons, industry.name)
  }, [comparisons, industry.name])

  const handleExport = () => {
    window.print()
  }

  const overallScore = useMemo(() => {
    const scores = comparisons.map(comp => {
      if (comp.status === 'positive') return 1
      if (comp.status === 'negative') return -1
      return 0
    })
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round((avgScore + 1) * 50) // Convert to 0-100 scale
  }, [comparisons])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tighter">
              Industry Benchmark Report
            </h2>
            <p className="text-gray-600 mt-1">
              Your company vs {industry.name} industry medians
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleExport}
              className="btn-primary"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Overall Performance Score
              </h3>
              <p className="text-sm text-gray-600">
                Compared to {industry.name} industry medians
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                overallScore >= 70 ? 'text-success-600' :
                overallScore >= 40 ? 'text-warning-600' :
                'text-danger-600'
              }`}>
                {overallScore}
              </div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  overallScore >= 70 ? 'bg-success-600' :
                  overallScore >= 40 ? 'bg-warning-600' :
                  'bg-danger-600'
                }`}
                style={{ width: `${overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className={`card p-4 border-l-4 ${
              comparison.status === 'positive'
                ? 'border-l-success-500'
                : comparison.status === 'negative'
                ? 'border-l-danger-500'
                : 'border-l-gray-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">
                {comparison.name}
              </h4>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comparison.status === 'positive'
                    ? 'bg-success-100 text-success-800'
                    : comparison.status === 'negative'
                    ? 'bg-danger-100 text-danger-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {comparison.status === 'positive'
                  ? '↗ Above'
                  : comparison.status === 'negative'
                  ? '↘ Below'
                  : '→ At'
                } Median
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your Value:</span>
                <span className="font-medium text-gray-900">
                  {comparison.yourValue}{comparison.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Industry Median:</span>
                <span className="font-medium text-gray-700">
                  {comparison.benchmark}{comparison.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Difference:</span>
                <span
                  className={
                    comparison.status === 'positive'
                      ? 'text-success-600'
                      : comparison.status === 'negative'
                      ? 'text-danger-600'
                      : 'text-gray-600'
                  }
                >
                  {comparison.difference > 0 ? '+' : ''}{comparison.difference}{comparison.unit}
                  {' '}({comparison.percentDifference > 0 ? '+' : ''}{comparison.percentDifference}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <ChartsSection comparisons={comparisons} />

      {/* Insights Section */}
      <InsightsSection insights={insights} />
    </div>
  )
}