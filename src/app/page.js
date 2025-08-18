'use client'

import { useState, useEffect } from 'react'
import FileUpload from '../app/components/FileUpload'
import ColumnMapper from '../app/components/ColumnMapper'
import IndustrySelector from '../app/components/IndustrySelector'
import ResultsDisplay from '../app/components/ResultsDisplay'

const STEPS = {
  UPLOAD: 'upload',
  MAP: 'map',
  SELECT: 'select',
  RESULTS: 'results'
}

const STEP_INFO = [
  { key: STEPS.UPLOAD, label: 'Upload CSV', number: 1 },
  { key: STEPS.MAP, label: 'Map Columns', number: 2 },
  { key: STEPS.SELECT, label: 'Select Industry', number: 3 },
  { key: STEPS.RESULTS, label: 'View Results', number: 4 },
]

export default function Home() {
  const [step, setStep] = useState(STEPS.UPLOAD)
  const [csvData, setCsvData] = useState(null)
  const [mappedData, setMappedData] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [benchmarks, setBenchmarks] = useState(null)
  const [animatingStep, setAnimatingStep] = useState(null)

  const currentStepIndex = STEP_INFO.findIndex(s => s.key === step)

  const handleFileUpload = (data) => {
    setCsvData(data)
    animateToStep(STEPS.MAP)
  }

  const handleColumnMapping = (mapped) => {
    setMappedData(mapped)
    animateToStep(STEPS.SELECT)
  }

  const handleIndustrySelect = (industry, benchmarkData) => {
    setSelectedIndustry(industry)
    setBenchmarks(benchmarkData)
    animateToStep(STEPS.RESULTS)
  }

  const animateToStep = (newStep) => {
    setAnimatingStep(newStep)
    setTimeout(() => {
      setStep(newStep)
      setAnimatingStep(null)
    }, 300)
  }

  const resetFlow = () => {
    setStep(STEPS.UPLOAD)
    setCsvData(null)
    setMappedData(null)
    setSelectedIndustry(null)
    setBenchmarks(null)
    setAnimatingStep(null)
  }

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'upcoming'
  }

  return (
  <div className="space-y-10">
    {/* Progress Card */}
    <div className="rounded-3xl bg-black text-white ring-1 ring-white/10 shadow-2xl p-8 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Benchmark Analysis Progress
          </h2>
          <p className="text-sm text-neutral-400">
            Step {currentStepIndex + 1} of {STEP_INFO.length}
          </p>
        </div>
        {step !== STEPS.UPLOAD && (
          <button
            onClick={resetFlow}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg 
              bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Start Over
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Line background */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/10 rounded-full"></div>

        {/* Fill */}
        <div
          className="absolute top-6 left-6 h-0.5 bg-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{
            width:
              currentStepIndex > 0
                ? `${(currentStepIndex / (STEP_INFO.length - 1)) * 100}%`
                : '0%',
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEP_INFO.map((stepInfo, index) => {
            const status = getStepStatus(index);
            const isAnimating =
              animatingStep &&
              STEP_INFO.findIndex((s) => s.key === animatingStep) === index;

            return (
              <div key={stepInfo.key} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-500 relative z-10
                    ${
                      status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : status === 'current'
                        ? 'bg-white text-black shadow-lg ring-4 ring-emerald-500/30'
                        : 'bg-white/5 border-2 border-white/20 text-neutral-500'
                    }
                    ${isAnimating ? 'animate-pulse' : ''}
                  `}
                >
                  {status === 'completed' ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepInfo.number
                  )}
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <p
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${
                        status === 'current'
                          ? 'text-white'
                          : status === 'completed'
                          ? 'text-neutral-300'
                          : 'text-neutral-500'
                      }
                    `}
                  >
                    {stepInfo.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Percentage */}
      <div className="mt-8 flex items-center justify-center">
        <div className="rounded-full bg-white/5 px-4 py-2 border border-white/10">
          <span className="text-sm font-medium text-neutral-300">
            {Math.round(((currentStepIndex + 1) / STEP_INFO.length) * 100)}%
            Complete
          </span>
        </div>
      </div>
    </div>

    {/* Step Content */}
    <div className="space-y-6">
      {step === STEPS.UPLOAD && <FileUpload onUpload={handleFileUpload} />}

      {step === STEPS.MAP && csvData && (
        <ColumnMapper
          data={csvData}
          onMapping={handleColumnMapping}
          onBack={() => setStep(STEPS.UPLOAD)}
        />
      )}

      {step === STEPS.SELECT && (
        <IndustrySelector
          onSelect={handleIndustrySelect}
          onBack={() => setStep(STEPS.MAP)}
        />
      )}

      {step === STEPS.RESULTS &&
        mappedData &&
        selectedIndustry &&
        benchmarks && (
          <ResultsDisplay
            data={mappedData}
            industry={selectedIndustry}
            benchmarks={benchmarks}
            onBack={() => setStep(STEPS.SELECT)}
          />
        )}
    </div>
  </div>
);
}