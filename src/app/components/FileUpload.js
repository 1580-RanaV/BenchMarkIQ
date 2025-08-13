'use client'

import { useState, useRef } from 'react'
import { parseCSV } from '../utils/csvParser'

export default function FileUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const parsedData = await parseCSV(file)
      if (parsedData.length === 0) {
        throw new Error('CSV file appears to be empty')
      }
      onUpload(parsedData)
    } catch (err) {
      setError(err.message || 'Failed to parse CSV file')
    } finally {
      setIsLoading(false)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="card p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tighter">
          Upload Your Company Data
        </h2>
        <p className="text-gray-600">
          Upload a CSV file with your company's KPIs to compare against industry benchmarks
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : error
            ? 'border-danger-300 bg-danger-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Processing CSV file...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <div>
              <p className="text-sm text-gray-900 mb-1">
                <button
                  onClick={openFileDialog}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Click to upload
                </button>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
          </div>
        )}
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

      {/* Sample data format info */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Expected CSV Format:</h4>
        <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border">
          <div>metric_name,value</div>
          <div>Gross Margin,45.2</div>
          <div>CAC,150</div>
          <div>Churn Rate,5.5</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Or use wide format with metrics as column headers
        </p>
      </div>
    </div>
  )
}