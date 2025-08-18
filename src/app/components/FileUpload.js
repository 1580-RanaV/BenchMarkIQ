'use client';

import { useState, useRef } from 'react';
import { parseCSV } from '../utils/csvParser';

/**
 * Dark “bento card” upload component
 * - Full black surface with soft inner contrast
 * - Drag/hover state tints
 * - Clear error + loading indicators
 */
export default function FileUpload({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFile(files[0]);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  async function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseCSV(file);
      if (!parsedData?.length) throw new Error('CSV file appears to be empty');
      onUpload(parsedData);
    } catch (err) {
      setError(err.message || 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  }

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-8 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Upload Your Company Data</h2>
        <p className="mt-2 text-sm md:text-base text-neutral-300">
          Upload a CSV with your company KPIs to compare against industry benchmarks.
        </p>
      </div>

      {/* Dropzone */}
      <div
        className={[
          'rounded-2xl border-2 border-dashed p-8 md:p-10 text-center transition-all',
          'bg-white/[0.03] ring-1 ring-white/10',
          isDragging ? 'border-emerald-400/70 bg-emerald-400/10' : '',
          error ? 'border-red-400/70 bg-red-400/10' : 'border-white/20 hover:border-white/40',
        ].join(' ')}
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
          <div className="space-y-4">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-white/20 border-b-transparent animate-spin" />
            <p className="text-sm text-neutral-300">Processing CSV file…</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Icon */}
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-neutral-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <p className="text-sm">
                <button
                  onClick={openFileDialog}
                  className="font-semibold text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 rounded-md"
                >
                  Click to upload
                </button>{' '}
                or drag & drop
              </p>
              <p className="text-xs text-neutral-400">CSV files only</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Format helper */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold tracking-tight mb-2">Expected CSV Format</h4>
        <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-neutral-200">
          <div>metric_name,value</div>
          <div>Gross Margin,45.2</div>
          <div>CAC,150</div>
          <div>Churn Rate,5.5</div>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          You can also use a wide format with metrics as column headers.
        </p>
      </div>
    </div>
  );
}
