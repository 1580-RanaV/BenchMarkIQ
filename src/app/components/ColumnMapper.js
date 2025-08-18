'use client'

import { useState } from 'react'
import { standardKPIs } from '../utils/calculations'

export default function ColumnMapper({ data, onMapping, onBack }) {
  const [mappings, setMappings] = useState({})
  const [error, setError] = useState(null)

  // Detect if data is in wide or long format
  const isWideFormat = data.length > 0 && Object.keys(data[0]).length > 2

  // Get available columns from the CSV
  const csvColumns = data.length > 0 ? Object.keys(data[0]) : []

  // Get potential metric values from long format
  const metricValues = isWideFormat
    ? []
    : [
        ...new Set(
          data
            .map(
              (row) =>
                row[csvColumns[0]] || row.metric_name || row.metric || row.kpi || ''
            )
            .filter(Boolean)
        ),
      ]

  const handleMappingChange = (standardKPI, csvColumn) => {
    setMappings((prev) => ({
      ...prev,
      [standardKPI]: csvColumn,
    }))
    setError(null)
  }

  const handleSubmit = () => {
    const selectedMappings = Object.entries(mappings).filter(
      ([_, value]) => value
    )

    if (selectedMappings.length === 0) {
      setError('Please map at least one KPI to continue')
      return
    }

    try {
      let mappedData = {}

      if (isWideFormat) {
        // Wide format: columns are KPIs
        const row = data[0] // Assuming single row of data
        selectedMappings.forEach(([standardKPI, csvColumn]) => {
          const value = parseFloat(row[csvColumn])
          if (!isNaN(value)) mappedData[standardKPI] = value
        })
      } else {
        // Long format: rows are KPIs
        const valueColumn =
          csvColumns.find(
            (col) =>
              col.toLowerCase().includes('value') ||
              col.toLowerCase().includes('amount') ||
              col.toLowerCase().includes('metric')
          ) || csvColumns[1] // Default to second column

        selectedMappings.forEach(([standardKPI, selectedMetric]) => {
          const dataRow = data.find((row) => {
            const metricName =
              row[csvColumns[0]] || row.metric_name || row.metric
            return metricName === selectedMetric
          })

          if (dataRow && valueColumn) {
            const value = parseFloat(dataRow[valueColumn])
            if (!isNaN(value)) mappedData[standardKPI] = value
          }
        })
      }

      if (Object.keys(mappedData).length === 0) {
        setError('No valid numeric data found. Please check your CSV format.')
        return
      }

      onMapping(mappedData)
    } catch {
      setError('Failed to process the data mapping')
    }
  }

  const selectClass =
    'w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/40 ' +
    'placeholder:text-neutral-400'

  return (
    <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Map Your Data</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Connect your CSV columns to standard KPIs for comparison
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium
                     bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Format badge */}
      <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
        <p className="text-sm font-medium text-white">
          Format detected:{' '}
          <span className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
            {isWideFormat ? 'Wide Format' : 'Long Format'}
          </span>
        </p>
        <p className="text-xs text-neutral-400 mt-2">
          {isWideFormat
            ? 'KPIs are column headers with values in rows'
            : 'KPIs are listed in rows with corresponding values'}
        </p>
      </div>

      {/* Data preview */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3">Data Preview</h3>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {csvColumns.map((col) => (
                  <th
                    key={col}
                    className="text-left font-semibold text-neutral-200 px-2 py-1"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="odd:bg-white/0 even:bg-white/0">
                  {csvColumns.map((col) => (
                    <td key={col} className="text-neutral-300 px-2 py-1">
                      {String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 5 && (
            <p className="text-xs text-neutral-400 mt-2">
              …and {data.length - 5} more rows
            </p>
          )}
        </div>
      </div>

      {/* Mapping grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white mb-2">Map to Standard KPIs</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(standardKPIs).map(([key, kpi]) => (
            <div
              key={key}
              className="rounded-2xl bg-white/5 border border-white/10 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white">{kpi.name}</label>
                <span className="text-xs text-neutral-400">{kpi.unit}</span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">{kpi.description}</p>

              <select
                value={mappings[key] || ''}
                onChange={(e) => handleMappingChange(key, e.target.value)}
                className={selectClass}
              >
                <option value="">Select {isWideFormat ? 'column' : 'metric'}…</option>
                {(isWideFormat ? csvColumns : metricValues).map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-400/20 p-4">
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

      {/* Actions */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center rounded-xl bg-white text-black font-semibold 
                     px-5 py-2.5 shadow-sm hover:bg-neutral-100 transition-colors"
        >
          Continue to Industry Selection
        </button>
      </div>
    </div>
  )
}
