'use client'

export default function InsightsSection({ insights }) {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-5 h-5 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'medium':
        return (
          <svg className="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'low':
        return (
          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const getInsightTypeColor = (type) => {
    switch (type) {
      case 'strength':
        return 'bg-success-50 border-success-200 text-success-800'
      case 'weakness':
        return 'bg-danger-50 border-danger-200 text-danger-800'
      case 'opportunity':
        return 'bg-primary-50 border-primary-200 text-primary-800'
      case 'risk':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.priority]) {
      acc[insight.priority] = []
    }
    acc[insight.priority].push(insight)
    return acc
  }, {})

  const priorityOrder = ['high', 'medium', 'low']
  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tighter">
          AI-Generated Insights
        </h3>
        <p className="text-gray-600 mt-1">
          Strategic recommendations based on your benchmark comparison
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-gray-600">No specific insights generated for this dataset.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {priorityOrder.map(priority => {
            const priorityInsights = groupedInsights[priority]
            if (!priorityInsights || priorityInsights.length === 0) return null

            return (
              <div key={priority}>
                <div className="flex items-center mb-4">
                  {getPriorityIcon(priority)}
                  <h4 className="ml-2 text-lg font-medium text-gray-900">
                    {priorityLabels[priority]}
                  </h4>
                  <span className="ml-2 text-sm text-gray-500">
                    ({priorityInsights.length})
                  </span>
                </div>

                <div className="grid gap-4">
                  {priorityInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${getInsightTypeColor(insight.type)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-white bg-opacity-70">
                            {insight.type}
                          </span>
                          <span className="ml-3 font-medium text-sm">
                            {insight.kpi}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Impact: {insight.impact}
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3 leading-relaxed">
                        {insight.message}
                      </p>
                      
                      {insight.recommendations && insight.recommendations.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                            Recommended Actions:
                          </h5>
                          <ul className="space-y-1">
                            {insight.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="text-sm flex items-start">
                                <span className="text-gray-400 mr-2 flex-shrink-0 mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {insights.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-success-600">
                {insights.filter(i => i.type === 'strength').length}
              </div>
              <div className="text-gray-600">Strengths</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-danger-600">
                {insights.filter(i => i.type === 'weakness').length}
              </div>
              <div className="text-gray-600">Weaknesses</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-600">
                {insights.filter(i => i.type === 'opportunity').length}
              </div>
              <div className="text-gray-600">Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-warning-600">
                {insights.filter(i => i.type === 'risk').length}
              </div>
              <div className="text-gray-600">Risks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}