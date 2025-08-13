import { standardKPIs } from './calculations'

// Rule-based insight generation
export const generateInsights = (comparisons, industryName) => {
  const insights = []

  comparisons.forEach(comparison => {
    const kpiInfo = standardKPIs[comparison.kpi]
    if (!kpiInfo) return

    const absPercentDiff = Math.abs(comparison.percentDifference)
    let priority = 'low'
    let impact = 'Low'

    // Determine priority and impact based on percentage difference
    if (absPercentDiff >= 30) {
      priority = 'high'
      impact = 'High'
    } else if (absPercentDiff >= 15) {
      priority = 'medium'  
      impact = 'Medium'
    }

    // Generate insights based on KPI and performance
    const insight = generateKPIInsight(comparison, kpiInfo, industryName, priority, impact)
    if (insight) {
      insights.push(insight)
    }
  })

  // Add strategic insights based on combinations of KPIs
  const strategicInsights = generateStrategicInsights(comparisons, industryName)
  insights.push(...strategicInsights)

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

const generateKPIInsight = (comparison, kpiInfo, industryName, priority, impact) => {
  const { kpi, percentDifference, status, name } = comparison
  const isNegativelyImpacting = 
    (kpiInfo.higher_is_better && status === 'negative') || 
    (!kpiInfo.higher_is_better && status === 'negative')

  const insights = {
    gross_margin: {
      positive: {
        type: 'strength',
        message: `Your gross margin is ${Math.abs(percentDifference)}% above the ${industryName} median. This indicates strong pricing power and/or efficient cost management.`,
        recommendations: [
          'Maintain current pricing strategy',
          'Consider premium product positioning',
          'Invest savings in growth initiatives'
        ]
      },
      negative: {
        type: 'weakness',
        message: `Your gross margin is ${Math.abs(percentDifference)}% below the ${industryName} median. This suggests pricing pressure or high cost of goods sold.`,
        recommendations: [
          'Analyze cost structure and identify reduction opportunities',
          'Review pricing strategy and competitor positioning',
          'Negotiate better terms with suppliers',
          'Consider product mix optimization'
        ]
      }
    },
    cac: {
      positive: {
        type: 'strength',
        message: `Your customer acquisition cost is ${Math.abs(percentDifference)}% below the ${industryName} median. Your marketing efficiency is excellent.`,
        recommendations: [
          'Scale successful acquisition channels',
          'Document and replicate best practices',
          'Consider increasing marketing spend for growth'
        ]
      },
      negative: {
        type: 'weakness',
        message: `Your customer acquisition cost is ${Math.abs(percentDifference)}% above the ${industryName} median. Marketing efficiency needs improvement.`,
        recommendations: [
          'Audit marketing channels for ROI performance',
          'Improve conversion funnel optimization',
          'Test lower-cost acquisition channels',
          'Enhance targeting and segmentation'
        ]
      }
    },
    churn_rate: {
      positive: {
        type: 'strength',
        message: `Your churn rate is ${Math.abs(percentDifference)}% below the ${industryName} median. Customer retention is a key competitive advantage.`,
        recommendations: [
          'Document retention best practices',
          'Invest in customer success programs',
          'Use retention strength in marketing messaging'
        ]
      },
      negative: {
        type: 'weakness',
        message: `Your churn rate is ${Math.abs(percentDifference)}% above the ${industryName} median. Customer retention is a critical issue requiring immediate attention.`,
        recommendations: [
          'Implement customer health scoring',
          'Develop proactive retention campaigns',
          'Analyze exit interviews for improvement areas',
          'Enhance onboarding and customer success'
        ]
      }
    },
    conversion_rate: {
      positive: {
        type: 'strength',
        message: `Your conversion rate is ${Math.abs(percentDifference)}% above the ${industryName} median. Your sales process or website is highly effective.`,
        recommendations: [
          'Scale traffic to capitalize on high conversion',
          'A/B test to maintain conversion excellence',
          'Share conversion best practices across channels'
        ]
      },
      negative: {
        type: 'weakness',
        message: `Your conversion rate is ${Math.abs(percentDifference)}% below the ${industryName} median. There are significant optimization opportunities.`,
        recommendations: [
          'Conduct user experience audits',
          'Implement A/B testing program',
          'Optimize landing pages and checkout flow',
          'Analyze customer journey friction points'
        ]
      }
    },
    inventory_turnover: {
      positive: {
        type: 'strength',
        message: `Your inventory turnover is ${Math.abs(percentDifference)}% above the ${industryName} median. Inventory management is very efficient.`,
        recommendations: [
          'Maintain optimal stock levels',
          'Consider just-in-time inventory strategies',
          'Use freed cash flow for growth investments'
        ]
      },
      negative: {
        type: 'weakness',
        message: `Your inventory turnover is ${Math.abs(percentDifference)}% below the ${industryName} median. Excess inventory is tying up capital.`,
        recommendations: [
          'Implement demand forecasting improvements',
          'Review slow-moving inventory for clearance',
          'Optimize supplier relationships and lead times',
          'Consider inventory management software'
        ]
      }
    },
    ltv: {
      positive: {
        type: 'strength',
        message: `Your customer lifetime value is ${Math.abs(percentDifference)}% above the ${industryName} median. Customers are highly valuable.`,
        recommendations: [
          'Focus on acquiring similar high-value customers',
          'Develop loyalty and upselling programs',
          'Invest in customer experience improvements'
        ]
      },
      negative: {
        type: 'opportunity',
        message: `Your customer lifetime value is ${Math.abs(percentDifference)}% below the ${industryName} median. There's opportunity to increase customer value.`,
        recommendations: [
          'Develop upselling and cross-selling strategies',
          'Improve customer engagement and retention',
          'Consider subscription or recurring revenue models',
          'Analyze high-value customer characteristics'
        ]
      }
    }
  }

  const kpiInsights = insights[kpi]
  if (!kpiInsights) {
    // Generate generic insight for unmapped KPIs
    return {
      kpi: name,
      type: isNegativelyImpacting ? 'weakness' : 'strength',
      priority,
      impact,
      message: `Your ${name} is ${Math.abs(percentDifference)}% ${status === 'positive' ? 'above' : 'below'} the ${industryName} industry median.`,
      recommendations: [
        `Analyze factors contributing to ${name} performance`,
        `Benchmark against industry best practices`,
        `Consider strategic adjustments if needed`
      ]
    }
  }

  const insightTemplate = status === 'positive' || status === 'neutral' ? 
    kpiInsights.positive : 
    kpiInsights.negative

  if (!insightTemplate) return null

  return {
    kpi: name,
    type: insightTemplate.type,
    priority,
    impact,
    message: insightTemplate.message,
    recommendations: insightTemplate.recommendations
  }
}

const generateStrategicInsights = (comparisons, industryName) => {
  const strategicInsights = []
  
  // Find high-performing and low-performing areas
  const strengths = comparisons.filter(c => c.status === 'positive' && Math.abs(c.percentDifference) >= 20)
  const weaknesses = comparisons.filter(c => c.status === 'negative' && Math.abs(c.percentDifference) >= 20)
  
  // Overall performance insight
  if (strengths.length >= 3 && weaknesses.length <= 1) {
    strategicInsights.push({
      kpi: 'Overall Performance',
      type: 'strength',
      priority: 'high',
      impact: 'High',
      message: `Your company is performing exceptionally well across most key metrics compared to ${industryName} peers. You have strong competitive positioning.`,
      recommendations: [
        'Leverage strengths for market expansion',
        'Consider premium positioning strategy',
        'Document and scale successful practices',
        'Address remaining weak areas for optimization'
      ]
    })
  } else if (weaknesses.length >= 3 && strengths.length <= 1) {
    strategicInsights.push({
      kpi: 'Overall Performance',
      type: 'risk',
      priority: 'high',
      impact: 'High',
      message: `Multiple key metrics are underperforming compared to ${industryName} standards. Comprehensive performance improvement is needed.`,
      recommendations: [
        'Conduct thorough operational review',
        'Prioritize critical performance gaps',
        'Consider bringing in industry expertise',
        'Develop systematic improvement plan'
      ]
    })
  }

  // Specific strategic combinations
  const grossMarginComp = comparisons.find(c => c.kpi === 'gross_margin')
  const cacComp = comparisons.find(c => c.kpi === 'cac')
  const ltvComp = comparisons.find(c => c.kpi === 'ltv')

  // Unit economics insight
  if (cacComp && ltvComp) {
    const ltvCacRatio = parseFloat(ltvComp.yourValue) / parseFloat(cacComp.yourValue)
    if (ltvCacRatio < 3) {
      strategicInsights.push({
        kpi: 'Unit Economics',
        type: 'risk',
        priority: 'high',
        impact: 'High',
        message: `Your LTV:CAC ratio is ${ltvCacRatio.toFixed(1)}:1, which is below the healthy 3:1 threshold. This indicates unsustainable unit economics.`,
        recommendations: [
          'Focus on increasing customer lifetime value',
          'Optimize customer acquisition costs',
          'Improve retention and reduce churn',
          'Consider pricing strategy adjustments'
        ]
      })
    } else if (ltvCacRatio > 5) {
      strategicInsights.push({
        kpi: 'Unit Economics',
        type: 'opportunity',
        priority: 'medium',
        impact: 'Medium',
        message: `Your LTV:CAC ratio is ${ltvCacRatio.toFixed(1)}:1, which is excellent. You may be under-investing in growth.`,
        recommendations: [
          'Consider increasing marketing spend',
          'Scale successful acquisition channels',
          'Explore new market segments',
          'Invest in product development'
        ]
      })
    }
  }

  // Efficiency vs Growth insight
  const conversionComp = comparisons.find(c => c.kpi === 'conversion_rate')
  const churnComp = comparisons.find(c => c.kpi === 'churn_rate')
  
  if (conversionComp && churnComp) {
    if (conversionComp.status === 'positive' && churnComp.status === 'negative') {
      strategicInsights.push({
        kpi: 'Growth Strategy',
        type: 'opportunity',
        priority: 'medium',
        impact: 'Medium',
        message: 'You excel at acquiring customers but struggle with retention. Focus on the full customer lifecycle.',
        recommendations: [
          'Implement customer onboarding improvements',
          'Develop customer success programs',
          'Analyze why customers leave despite good acquisition',
          'Create retention-focused KPIs and incentives'
        ]
      })
    } else if (conversionComp.status === 'negative' && churnComp.status === 'positive') {
      strategicInsights.push({
        kpi: 'Growth Strategy',
        type: 'opportunity',
        priority: 'medium',
        impact: 'Medium',
        message: 'You retain customers well but have acquisition challenges. Leverage retention strength for growth.',
        recommendations: [
          'Implement referral programs leveraging loyal customers',
          'Use customer testimonials in acquisition marketing',
          'Analyze successful customer profiles for targeting',
          'Optimize conversion funnel based on retention insights'
        ]
      })
    }
  }

  // Operational efficiency insight
  const inventoryComp = comparisons.find(c => c.kpi === 'inventory_turnover')
  const defectComp = comparisons.find(c => c.kpi === 'defect_rate')
  
  if (inventoryComp && defectComp && inventoryComp.status === 'negative' && defectComp.status === 'negative') {
    strategicInsights.push({
      kpi: 'Operational Excellence',
      type: 'weakness',
      priority: 'high',
      impact: 'High',
      message: 'Both inventory management and quality control are below industry standards. Operational improvements are critical.',
      recommendations: [
        'Implement lean manufacturing principles',
        'Invest in quality management systems',
        'Review and optimize supply chain processes',
        'Consider operational consulting or training'
      ]
    })
  }

  // Financial health insight
  if (grossMarginComp && grossMarginComp.status === 'negative') {
    const burnRateComp = comparisons.find(c => c.kpi === 'burn_rate')
    if (burnRateComp && burnRateComp.status === 'negative') {
      strategicInsights.push({
        kpi: 'Financial Health',
        type: 'risk',
        priority: 'high',
        impact: 'High',
        message: 'Low gross margins combined with high burn rate create financial sustainability risks.',
        recommendations: [
          'Immediately review cost structure',
          'Consider pricing strategy adjustments',
          'Evaluate non-essential expenses',
          'Develop scenario planning for cash management'
        ]
      })
    }
  }

  return strategicInsights
}

// Helper function to categorize insights by business area
export const categorizeInsights = (insights) => {
  const categories = {
    financial: [],
    operational: [],
    marketing: [],
    strategic: [],
    risk: []
  }

  insights.forEach(insight => {
    const kpi = insight.kpi.toLowerCase()
    
    if (kpi.includes('margin') || kpi.includes('revenue') || kpi.includes('burn') || kpi.includes('financial')) {
      categories.financial.push(insight)
    } else if (kpi.includes('inventory') || kpi.includes('defect') || kpi.includes('efficiency') || kpi.includes('operational')) {
      categories.operational.push(insight)
    } else if (kpi.includes('cac') || kpi.includes('conversion') || kpi.includes('acquisition') || kpi.includes('marketing')) {
      categories.marketing.push(insight)
    } else if (insight.type === 'risk' || insight.priority === 'high') {
      categories.risk.push(insight)
    } else {
      categories.strategic.push(insight)
    }
  })

  return categories
}

// Generate executive summary
export const generateExecutiveSummary = (comparisons, insights, industryName) => {
  const strengths = comparisons.filter(c => c.status === 'positive').length
  const weaknesses = comparisons.filter(c => c.status === 'negative').length
  const total = comparisons.length

  const highPriorityInsights = insights.filter(i => i.priority === 'high')
  const criticalIssues = insights.filter(i => i.type === 'weakness' || i.type === 'risk')

  let performanceLevel = 'mixed'
  if (strengths > weaknesses && strengths >= total * 0.6) {
    performanceLevel = 'strong'
  } else if (weaknesses > strengths && weaknesses >= total * 0.6) {
    performanceLevel = 'concerning'
  }

  return {
    performanceLevel,
    totalMetrics: total,
    strengths,
    weaknesses,
    highPriorityItems: highPriorityInsights.length,
    criticalIssues: criticalIssues.length,
    summary: generateSummaryText(performanceLevel, strengths, weaknesses, total, industryName),
    topRecommendations: getTopRecommendations(insights)
  }
}

const generateSummaryText = (performanceLevel, strengths, weaknesses, total, industryName) => {
  switch (performanceLevel) {
    case 'strong':
      return `Your company demonstrates strong performance compared to ${industryName} industry benchmarks, with ${strengths} out of ${total} metrics above median. Focus on maintaining strengths while addressing remaining gaps.`
    case 'concerning':
      return `Performance analysis reveals ${weaknesses} out of ${total} metrics below ${industryName} industry medians. Immediate strategic attention is required to address underperformance.`
    default:
      return `Your company shows mixed performance against ${industryName} benchmarks with ${strengths} strengths and ${weaknesses} areas for improvement. Balanced approach to optimization recommended.`
  }
}

const getTopRecommendations = (insights) => {
  const highPriorityInsights = insights.filter(i => i.priority === 'high')
  const allRecommendations = highPriorityInsights.flatMap(i => i.recommendations || [])
  
  // Return top 5 most common/important recommendations
  const recommendationCounts = allRecommendations.reduce((acc, rec) => {
    acc[rec] = (acc[rec] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(recommendationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([rec]) => rec)
}