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
      if (!response.ok) {
        throw new Error('Failed to load industry benchmarks')
      }
      const data = await response.json()
      setIndustries(Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      })))
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

    const industry = industries.find(ind => ind.id === selectedIndustry)
    if (industry) {
      onSelect(industry, industry.metrics)
    }
  }

  const handleIndustrySelect = (industryId) => {
    setSelectedIndustry(industryId)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading industries...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tighter">
            Select Industry
          </h2>
          <p className="text-gray-600 mt-1">
            Choose your industry to compare against relevant benchmarks
          </p>
        </div>
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-md">
          <div className="flex">
            <svg className="w-5 h-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-sm text-danger-800">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {industries.map(industry => (
          <div
            key={industry.id}
            onClick={() => handleIndustrySelect(industry.id)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedIndustry === industry.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {industry.name}
              </h3>
              {selectedIndustry === industry.id && (
                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-2">Key Benchmarks:</p>
              {Object.entries(industry.metrics).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium">
                    {typeof value === 'number' ? 
                      (value % 1 === 0 ? value.toLocaleString() : value.toFixed(1)) : 
                      value
                    }
                    {key.includes('rate') || key.includes('margin') ? '%' : ''}
                  </span>
                </div>
              ))}
              {Object.keys(industry.metrics).length > 4 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{Object.keys(industry.metrics).length - 4} more metrics
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedIndustry}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            selectedIndustry
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Benchmark Report
        </button>
      </div>
    </div>
  )
}