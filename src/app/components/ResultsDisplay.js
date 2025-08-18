'use client'

import { useMemo } from 'react'
import ChartsSection from './ChartsSection'
import InsightsSection from './InsightsSection'
import { calculateComparisons } from '../utils/calculations'
import { generateInsights } from '../utils/insights'

export default function ResultsDisplay({ data, industry, benchmarks, onBack }) {
  const comparisons = useMemo(() => calculateComparisons(data, benchmarks), [data, benchmarks])
  const insights = useMemo(() => generateInsights(comparisons, industry.name), [comparisons, industry.name])

  const handleExport = () => window.print()

  const overallScore = useMemo(() => {
    const scores = comparisons.map(comp => {
      if (comp.status === 'positive') return 1
      if (comp.status === 'negative') return -1
      return 0
    })
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round((avgScore + 1) * 50) // 0–100 scale
  }, [comparisons])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Industry Benchmark Report
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Your company vs {industry.name} industry medians
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Overall Performance Score
              </h3>
              <p className="text-sm text-neutral-400">
                Compared to {industry.name} industry medians
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${
                  overallScore >= 70
                    ? 'text-emerald-400'
                    : overallScore >= 40
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {overallScore}
              </div>
              <div className="text-sm text-neutral-400">out of 100</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  overallScore >= 70
                    ? 'bg-emerald-400'
                    : overallScore >= 40
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className={`rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white/90">
                {comparison.name}
              </h4>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comparison.status === 'positive'
                    ? 'bg-emerald-400/20 text-emerald-300'
                    : comparison.status === 'negative'
                    ? 'bg-red-400/20 text-red-300'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                {comparison.status === 'positive'
                  ? '↗ Above'
                  : comparison.status === 'negative'
                  ? '↘ Below'
                  : '→ At'}{' '}
                Median
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Your Value:</span>
                <span className="font-medium text-white">
                  {comparison.yourValue}
                  {comparison.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Industry Median:</span>
                <span className="font-medium text-neutral-200">
                  {comparison.benchmark}
                  {comparison.unit}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-neutral-400">Difference:</span>
                <span
                  className={
                    comparison.status === 'positive'
                      ? 'text-emerald-400'
                      : comparison.status === 'negative'
                      ? 'text-red-400'
                      : 'text-neutral-300'
                  }
                >
                  {comparison.difference > 0 ? '+' : ''}
                  {comparison.difference}
                  {comparison.unit}{' '}
                  ({comparison.percentDifference > 0 ? '+' : ''}
                  {comparison.percentDifference}%)
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
