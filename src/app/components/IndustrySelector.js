'use client'

import { useState, useEffect } from 'react'

export default function IndustrySelector({ onSelect, onBack }) {
  const [industries, setIndustries] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadIndustries()
  }, [])

  const loadIndustries = async () => {
    try {
      const response = await fetch('/benchmarks.json')
      if (!response.ok) throw new Error('Failed to load industry benchmarks')
      const data = await response.json()
      setIndustries(
        Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedIndustry) {
      setError('Please select an industry to continue')
      return
    }
    const industry = industries.find((ind) => ind.id === selectedIndustry)
    if (industry) onSelect(industry, industry.metrics)
  }

  const handleIndustrySelect = (industryId) => {
    setSelectedIndustry(industryId)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/80" />
          <span className="ml-3 text-neutral-300">Loading industries…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Select Industry</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Choose your industry to compare against relevant benchmarks
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium
                     bg-white text-black hover:bg-neutral-100 border border-white/10 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-400/20 p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Industry cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {industries.map((industry) => {
          const selected = selectedIndustry === industry.id
          return (
            <button
              key={industry.id}
              type="button"
              onClick={() => handleIndustrySelect(industry.id)}
              className={[
                'text-left rounded-2xl p-6 transition-all border backdrop-blur-sm',
                'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20',
                selected
                  ? 'ring-2 ring-emerald-400/30 bg-emerald-500/10 border-emerald-400/20'
                  : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{industry.name}</h3>
                {selected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-sm text-neutral-300">
                <p className="font-medium text-neutral-200 mb-2">Key Benchmarks</p>
                {Object.entries(industry.metrics)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-neutral-400">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-neutral-100">
                        {typeof value === 'number'
                          ? value % 1 === 0
                            ? value.toLocaleString()
                            : value.toFixed(1)
                          : value}
                        {(key.includes('rate') || key.includes('margin')) && '%'}
                      </span>
                    </div>
                  ))}
                {Object.keys(industry.metrics).length > 4 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    +{Object.keys(industry.metrics).length - 4} more metrics
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedIndustry}
          className={[
            'px-6 py-2 rounded-xl font-semibold transition-colors border',
            selectedIndustry
              ? 'bg-white text-black hover:bg-neutral-100 border-white/10'
              : 'bg-white/5 text-neutral-400 border-white/10 cursor-not-allowed',
          ].join(' ')}
        >
          Generate Benchmark Report
        </button>
      </div>
    </div>
  )
}
