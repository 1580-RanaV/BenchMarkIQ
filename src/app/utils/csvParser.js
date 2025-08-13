import Papa from 'papaparse'

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';'],
      transformHeader: (header) => {
        // Clean up header names
        return header
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_')
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          const criticalErrors = results.errors.filter(
            error => error.type === 'Delimiter' || error.type === 'Quotes'
          )
          
          if (criticalErrors.length > 0) {
            reject(new Error(`CSV parsing failed: ${criticalErrors[0].message}`))
            return
          }
        }

        if (results.data.length === 0) {
          reject(new Error('No data found in CSV file'))
          return
        }

        // Validate that we have at least some non-empty rows
        const validRows = results.data.filter(row => {
          return Object.values(row).some(value => value !== null && value !== '')
        })

        if (validRows.length === 0) {
          reject(new Error('No valid data rows found in CSV file'))
          return
        }

        resolve(validRows)
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      }
    })
  })
}

export const detectCSVFormat = (data) => {
  if (!data || data.length === 0) {
    return { format: 'unknown', confidence: 0 }
  }

  const firstRow = data[0]
  const columnCount = Object.keys(firstRow).length
  const columns = Object.keys(firstRow)

  // Check for wide format (many columns, typically KPIs as headers)
  const potentialKPIColumns = columns.filter(col => {
    const lowerCol = col.toLowerCase()
    return lowerCol.includes('margin') ||
           lowerCol.includes('revenue') ||
           lowerCol.includes('cost') ||
           lowerCol.includes('rate') ||
           lowerCol.includes('ratio') ||
           lowerCol.includes('turnover') ||
           lowerCol.includes('cac') ||
           lowerCol.includes('ltv') ||
           lowerCol.includes('churn') ||
           lowerCol.includes('conversion')
  })

  if (columnCount > 3 && potentialKPIColumns.length > 2) {
    return {
      format: 'wide',
      confidence: 0.8,
      description: 'Wide format detected: KPIs as column headers'
    }
  }

  // Check for long format (few columns, KPIs in rows)
  if (columnCount <= 3) {
    const hasMetricColumn = columns.some(col => {
      const lowerCol = col.toLowerCase()
      return lowerCol.includes('metric') ||
             lowerCol.includes('kpi') ||
             lowerCol.includes('name') ||
             lowerCol.includes('key')
    })

    const hasValueColumn = columns.some(col => {
      const lowerCol = col.toLowerCase()
      return lowerCol.includes('value') ||
             lowerCol.includes('amount') ||
             lowerCol.includes('number')
    })

    if (hasMetricColumn && hasValueColumn) {
      return {
        format: 'long',
        confidence: 0.9,
        description: 'Long format detected: KPIs listed in rows'
      }
    }

    // Check if first column contains metric-like names
    const firstColumnValues = data.slice(0, 5).map(row => 
      Object.values(row)[0]?.toString().toLowerCase() || ''
    )
    
    const metricLikeValues = firstColumnValues.filter(value => 
      value.includes('margin') ||
      value.includes('revenue') ||
      value.includes('cost') ||
      value.includes('rate') ||
      value.includes('cac') ||
      value.includes('ltv') ||
      value.includes('churn')
    )

    if (metricLikeValues.length > 0) {
      return {
        format: 'long',
        confidence: 0.7,
        description: 'Long format detected: Metric names found in first column'
      }
    }
  }

  return {
    format: 'unknown',
    confidence: 0,
    description: 'Could not determine CSV format'
  }
}

export const validateCSVData = (data, mappings) => {
  const errors = []
  const warnings = []

  if (!data || data.length === 0) {
    errors.push('No data provided')
    return { errors, warnings, isValid: false }
  }

  if (!mappings || Object.keys(mappings).length === 0) {
    errors.push('No column mappings provided')
    return { errors, warnings, isValid: false }
  }

  // Check for missing values
  Object.entries(mappings).forEach(([kpi, column]) => {
    if (column) {
      const hasValues = data.some(row => {
        const value = row[column]
        return value !== null && value !== undefined && value !== ''
      })

      if (!hasValues) {
        warnings.push(`No values found for ${kpi} in column ${column}`)
      }
    }
  })

  // Check for non-numeric values where numbers are expected
  Object.entries(mappings).forEach(([kpi, column]) => {
    if (column) {
      const nonNumericValues = data.filter(row => {
        const value = row[column]
        return value !== null && value !== undefined && value !== '' && isNaN(Number(value))
      })

      if (nonNumericValues.length > 0) {
        warnings.push(`Found ${nonNumericValues.length} non-numeric values for ${kpi}`)
      }
    }
  })

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  }
}