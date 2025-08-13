// Standard KPI definitions with metadata
export const standardKPIs = {
  gross_margin: {
    name: 'Gross Margin',
    description: 'Revenue minus cost of goods sold, expressed as percentage',
    unit: '%',
    category: 'profitability',
    higher_is_better: true
  },
  cac: {
    name: 'Customer Acquisition Cost',
    description: 'Average cost to acquire one new customer',
    unit: '$',
    category: 'marketing',
    higher_is_better: false
  },
  ltv: {
    name: 'Customer Lifetime Value',
    description: 'Total revenue expected from a customer over their lifetime',
    unit: '$',
    category: 'marketing',
    higher_is_better: true
  },
  churn_rate: {
    name: 'Churn Rate',
    description: 'Percentage of customers who stop using service in a period',
    unit: '%',
    category: 'retention',
    higher_is_better: false
  },
  arr_growth: {
    name: 'ARR Growth',
    description: 'Annual recurring revenue growth rate',
    unit: '%',
    category: 'growth',
    higher_is_better: true
  },
  burn_rate: {
    name: 'Burn Rate',
    description: 'Monthly cash consumption rate',
    unit: '$',
    category: 'financial',
    higher_is_better: false
  },
  inventory_turnover: {
    name: 'Inventory Turnover',
    description: 'How many times inventory is sold and replaced over a period',
    unit: 'x',
    category: 'operations',
    higher_is_better: true
  },
  conversion_rate: {
    name: 'Conversion Rate',
    description: 'Percentage of visitors who complete desired action',
    unit: '%',
    category: 'marketing',
    higher_is_better: true
  },
  aov: {
    name: 'Average Order Value',
    description: 'Average dollar amount spent per order',
    unit: '$',
    category: 'sales',
    higher_is_better: true
  },
  return_rate: {
    name: 'Return Rate',
    description: 'Percentage of products returned by customers',
    unit: '%',
    category: 'operations',
    higher_is_better: false
  },
  oee: {
    name: 'Overall Equipment Effectiveness',
    description: 'Measure of manufacturing productivity',
    unit: '%',
    category: 'manufacturing',
    higher_is_better: true
  },
  defect_rate: {
    name: 'Defect Rate',
    description: 'Percentage of products with defects',
    unit: '%',
    category: 'quality',
    higher_is_better: false
  },
  lead_time: {
    name: 'Lead Time',
    description: 'Time between order and delivery',
    unit: ' days',
    category: 'operations',
    higher_is_better: false
  },
  capacity_utilization: {
    name: 'Capacity Utilization',
    description: 'Percentage of available capacity being used',
    unit: '%',
    category: 'operations',
    higher_is_better: true
  },
  transaction_volume: {
    name: 'Transaction Volume',
    description: 'Total value of transactions processed',
    unit: '$',
    category: 'financial',
    higher_is_better: true
  },
  fraud_rate: {
    name: 'Fraud Rate',
    description: 'Percentage of transactions flagged as fraudulent',
    unit: '%',
    category: 'risk',
    higher_is_better: false
  },
  regulatory_capital: {
    name: 'Regulatory Capital',
    description: 'Capital ratio required by regulators',
    unit: '%',
    category: 'compliance',
    higher_is_better: true
  },
  patient_acquisition: {
    name: 'Patient Acquisition Cost',
    description: 'Cost to acquire one new patient',
    unit: '$',
    category: 'healthcare',
    higher_is_better: false
  },
  patient_retention: {
    name: 'Patient Retention',
    description: 'Percentage of patients retained over a period',
    unit: '%',
    category: 'healthcare',
    higher_is_better: true
  },
  compliance_score: {
    name: 'Compliance Score',
    description: 'Overall regulatory compliance rating',
    unit: '%',
    category: 'compliance',
    higher_is_better: true
  },
  readmission_rate: {
    name: 'Readmission Rate',
    description: 'Percentage of patients readmitted within 30 days',
    unit: '%',
    category: 'healthcare',
    higher_is_better: false
  },
  nps: {
    name: 'Net Promoter Score',
    description: 'Customer satisfaction and loyalty metric',
    unit: '',
    category: 'satisfaction',
    higher_is_better: true
  },
  cart_abandonment: {
    name: 'Cart Abandonment Rate',
    description: 'Percentage of shopping carts abandoned before checkout',
    unit: '%',
    category: 'ecommerce',
    higher_is_better: false
  }
}

export const calculateComparisons = (userData, benchmarks) => {
  const comparisons = []

  Object.entries(userData).forEach(([kpiKey, userValue]) => {
    const benchmarkValue = benchmarks[kpiKey]
    const kpiInfo = standardKPIs[kpiKey]

    if (benchmarkValue !== undefined && kpiInfo && userValue !== null && userValue !== undefined) {
      const difference = userValue - benchmarkValue
      const percentDifference = Math.round(((userValue - benchmarkValue) / benchmarkValue) * 100)
      
      // Determine if this is positive, negative, or neutral
      let status = 'neutral'
      const threshold = 5 // 5% threshold for neutral zone
      
      if (Math.abs(percentDifference) > threshold) {
        if (kpiInfo.higher_is_better) {
          status = userValue > benchmarkValue ? 'positive' : 'negative'
        } else {
          status = userValue < benchmarkValue ? 'positive' : 'negative'
        }
      }

      comparisons.push({
        kpi: kpiKey,
        name: kpiInfo.name,
        yourValue: formatValue(userValue, kpiInfo.unit),
        benchmark: formatValue(benchmarkValue, kpiInfo.unit),
        difference: formatValue(difference, kpiInfo.unit, true),
        percentDifference,
        status,
        unit: kpiInfo.unit,
        category: kpiInfo.category,
        higher_is_better: kpiInfo.higher_is_better
      })
    }
  })

  return comparisons.sort((a, b) => {
    // Sort by status (negative issues first), then by absolute percentage difference
    if (a.status === 'negative' && b.status !== 'negative') return -1
    if (b.status === 'negative' && a.status !== 'negative') return 1
    return Math.abs(b.percentDifference) - Math.abs(a.percentDifference)
  })
}

const formatValue = (value, unit, showSign = false) => {
  if (value === null || value === undefined) return 'N/A'
  
  let formattedValue
  
  // Handle different units
  if (unit === '$') {
    if (Math.abs(value) >= 1000000) {
      formattedValue = (value / 1000000).toFixed(1) + 'M'
    } else if (Math.abs(value) >= 1000) {
      formattedValue = (value / 1000).toFixed(1) + 'K'
    } else {
      formattedValue = Math.round(value).toLocaleString()
    }
  } else if (unit === '%') {
    formattedValue = value.toFixed(1)
  } else if (unit === 'x' || unit === '') {
    formattedValue = value.toFixed(1)
  } else {
    formattedValue = Math.round(value).toLocaleString()
  }
  
  if (showSign && value > 0) {
    formattedValue = '+' + formattedValue
  }
  
  return formattedValue
}

export const calculateOverallHealth = (comparisons) => {
  if (comparisons.length === 0) return { score: 50, level: 'average' }
  
  const weights = {
    'positive': 1,
    'neutral': 0,
    'negative': -1
  }
  
  const weightedSum = comparisons.reduce((sum, comp) => {
    const weight = weights[comp.status] || 0
    const importance = getKPIImportance(comp.category)
    return sum + (weight * importance)
  }, 0)
  
  const maxPossibleScore = comparisons.reduce((sum, comp) => {
    return sum + getKPIImportance(comp.category)
  }, 0)
  
  const normalizedScore = (weightedSum / maxPossibleScore + 1) * 50 // Convert to 0-100 scale
  const score = Math.max(0, Math.min(100, Math.round(normalizedScore)))
  
  let level
  if (score >= 75) level = 'excellent'
  else if (score >= 60) level = 'good'
  else if (score >= 40) level = 'average'
  else level = 'needs-improvement'
  
  return { score, level }
}

const getKPIImportance = (category) => {
  const importance = {
    'profitability': 3,
    'growth': 3,
    'financial': 2.5,
    'marketing': 2,
    'retention': 2,
    'operations': 1.5,
    'quality': 1.5,
    'compliance': 2,
    'risk': 2,
    'satisfaction': 1.5
  }
  
  return importance[category] || 1
}