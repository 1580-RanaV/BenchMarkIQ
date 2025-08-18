'use client';

import { useMemo, useEffect, useState } from 'react';
import ChartsSection from './ChartsSection';
import InsightsSection from './InsightsSection';
import { calculateComparisons } from '../utils/calculations';
import { getInsights } from '../lib/getInsights';

export default function ResultsDisplay({ data, industry, benchmarks, onBack }) {
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'fallback', 'error'

  // Build comparisons once from your data + benchmarks
  const comparisons = useMemo(
    () => calculateComparisons(data, benchmarks),
    [data, benchmarks]
  );

  // Fetch AI insights with detailed status tracking
  useEffect(() => {
    let cancelled = false;
    
    const fetchInsights = async () => {
      try {
        console.log('🚀 Starting insights fetch process...');
        setInsightsLoading(true);
        setAiStatus('loading');
        
        const startTime = Date.now();
        
        const result = await getInsights({
          comparisons,
          industryName: industry?.name || 'Industry',
        });
        
        const duration = Date.now() - startTime;
        console.log(`⏱️  Total insights fetch time: ${duration}ms`);
        
        if (!cancelled) {
          setInsights(Array.isArray(result) ? result : []);
          setAiStatus('success');
          console.log('✅ Insights loaded successfully:', result?.length, 'insights');
        }
      } catch (error) {
        console.error('❌ Insights fetch failed:', error);
        if (!cancelled) {
          setInsights([]);
          setAiStatus('error');
        }
      } finally {
        if (!cancelled) {
          setInsightsLoading(false);
        }
      }
    };

    fetchInsights();
    
    return () => {
      cancelled = true;
    };
  }, [comparisons, industry?.name]);

  const handleExport = () => window.print();

  const overallScore = useMemo(() => {
    const scores = comparisons.map((c) =>
      c.status === 'positive' ? 1 : c.status === 'negative' ? -1 : 0
    );
    const avgScore =
      (scores.reduce((a, b) => a + b, 0) / (scores.length || 1)) || 0;
    return Math.round((avgScore + 1) * 50); // 0–100
  }, [comparisons]);

  // Debug component to show AI status (remove in production)
  const AIDebugStatus = () => (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg font-mono z-50">
      <div>AI Status: {aiStatus}</div>
      <div>Loading: {insightsLoading ? 'Yes' : 'No'}</div>
      <div>Insights: {insights.length}</div>
    </div>
  );

  return (
    <div className="space-y-8 text-xs md:text-lg">
      {/* Debug status indicator - remove in production */}
      <AIDebugStatus />

      {/* Bento: Header + Overall Score */}
      <section
        className="
          rounded-3xl bg-neutral-950 text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8
          [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]
          [background-size:14px_14px] [background-position:0_0]
        "
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Industry Benchmark Report</h2>
            <p className="text-sm text-neutral-400 mt-1">
              Your company vs {industry.name} industry medians
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="
                px-4 py-2 rounded-xl text-sm font-medium
                bg-white/10 hover:bg-white/15 text-white
                border border-white/10 transition-colors
              "
            >
              Back
            </button>
            <button
              onClick={handleExport}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-emerald-500 hover:bg-emerald-600 text-white
                shadow-sm transition-colors
              "
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Performance Score</h3>
              <p className="text-sm text-neutral-400">
                Compared to {industry.name} industry medians
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-4xl font-extrabold leading-none ${
                  overallScore >= 70
                    ? 'text-emerald-400'
                    : overallScore >= 40
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {overallScore}
              </div>
              <div className="text-sm text-neutral-400 mt-1">out of 100</div>
            </div>
          </div>

          <div className="mt-5">
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
      </section>

      {/* Bento: KPI Comparison Cards */}
      <section
        className="
          rounded-3xl bg-neutral-950 text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8
          [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]
          [background-size:14px_14px] [background-position:0_0]
        "
      >
        <div className="mb-5">
          <h3 className="text-lg font-semibold">KPI Comparison</h3>
          <p className="text-sm text-neutral-400">Your values vs industry medians</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {comparisons.map((comparison, idx) => (
            <div
              key={idx}
              className="
                rounded-2xl bg-white/5 border border-white/10 p-5
                backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md
              "
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white/90">{comparison.name}</h4>
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
                  <span className="text-neutral-400">Your Value</span>
                  <span className="font-medium text-white">
                    {comparison.yourValue}
                    {comparison.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Industry Median</span>
                  <span className="font-medium text-neutral-200">
                    {comparison.benchmark}
                    {comparison.unit}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-400">Difference</span>
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
      </section>

      {/* Bento: Charts */}
      <section
        className="
          rounded-3xl bg-neutral-950 text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8
          [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]
          [background-size:14px_14px] [background-position:0_0]
        "
      >
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Visualizations</h3>
          <p className="text-sm text-neutral-400">
            Radar overview and variance from median
          </p>
        </div>
        <ChartsSection comparisons={comparisons} />
      </section>

      {/* Bento: AI Insights */}
      <section
        className="
          rounded-3xl bg-neutral-950 text-white ring-1 ring-white/10 shadow-2xl p-6 md:p-8
          [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)]
          [background-size:14px_14px] [background-position:0_0]
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
            <p className="text-sm text-neutral-400">
              AI can make mistakes, it is always good to double check before taking any decisions.
            </p>
          </div>
          
          {/* AI Status Indicator */}
          {insightsLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
              <span>AI Generating...</span>
            </div>
          )}
          
          {!insightsLoading && aiStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 border border-emerald-400 rounded-full px-3 py-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>AI</span>
            </div>
          )}
        </div>

        {/* Debug: Show raw insights data */}
        {process.env.NODE_ENV === 'development' && insights.length > 0 && (
          <div className="mb-4 p-3 bg-blue-900/20 rounded-lg text-xs">
            <details>
              <summary className="cursor-pointer text-blue-300">🐛 Debug: Raw Insights Data</summary>
              <pre className="mt-2 text-blue-200 overflow-auto">
                {JSON.stringify(insights, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <InsightsSection insights={insights} loading={insightsLoading} />
      </section>
    </div>
  );
}