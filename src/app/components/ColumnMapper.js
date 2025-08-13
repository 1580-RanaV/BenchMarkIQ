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
  const metricValues = isWideFormat ? [] : [...new Set(data.map(row => 
    row[csvColumns[0]] || row.metric_name || row.metric || row.kpi || ''
  ).filter(Boolean))]

  const handleMappingChange = (standardKPI, csvColumn) => {
    setMappings(prev => ({
      ...prev,
      [standardKPI]: csvColumn
    }))
    setError(null)
  }

  const handleSubmit = () => {
    const selectedMappings = Object.entries(mappings).filter(([_, value]) => value)
    
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
          if (!isNaN(value)) {
            mappedData[standardKPI] = value
          }
        })
      } else {
        // Long format: rows are KPIs
        const valueColumn = csvColumns.find(col => 
          col.toLowerCase().includes('value') || 
          col.toLowerCase().includes('amount') ||
          col.toLowerCase().includes('metric')
        ) || csvColumns[1] // Default to second column

        selectedMappings.forEach(([standardKPI, selectedMetric]) => {
          const dataRow = data.find(row => {
            const metricName = row[csvColumns[0]] || row.metric_name || row.metric
            return metricName === selectedMetric
          })
          
          if (dataRow && valueColumn) {
            const value = parseFloat(dataRow[valueColumn])
            if (!isNaN(value)) {
              mappedData[standardKPI] = value
            }
          }
        })
      }

      if (Object.keys(mappedData).length === 0) {
        setError('No valid numeric data found. Please check your CSV format.')
        return
      }

      onMapping(mappedData)
    } catch (err) {
      setError('Failed to process the data mapping')
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tighter">
            Map Your Data
          </h2>
          <p className="text-gray-600 mt-1">
            Connect your CSV columns to standard KPIs for comparison
          </p>
        </div>
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
      </div>

      {/* Data format detection */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm font-medium text-gray-900">
          Format detected: <span className="text-primary-600">
            {isWideFormat ? 'Wide Format' : 'Long Format'}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isWideFormat 
            ? 'KPIs are column headers with values in rows'
            : 'KPIs are listed in rows with corresponding values'
          }
        </p>
      </div>

      {/* Preview of data */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Data Preview:</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {csvColumns.map(col => (
                  <th key={col} className="text-left font-medium text-gray-700 px-2 py-1">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  {csvColumns.map(col => (
                    <td key={col} className="text-gray-600 px-2 py-1">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 5 && (
            <p className="text-xs text-gray-500 mt-2">
              ...and {data.length - 5} more rows
            </p>
          )}
        </div>
      </div>

      {/* Mapping interface */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Map to Standard KPIs:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(standardKPIs).map(([key, kpi]) => (
            <div key={key} className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  {kpi.name}
                </label>
                <span className="text-xs text-gray-500">
                  {kpi.unit}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                {kpi.description}
              </p>
              
              <select
                value={mappings[key] || ''}
                onChange={(e) => handleMappingChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select {isWideFormat ? 'column' : 'metric'}...</option>
                {(isWideFormat ? csvColumns : metricValues).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-md">
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

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="btn-primary"
        >
          Continue to Industry Selection
        </button>
      </div>
    </div>
  )
}