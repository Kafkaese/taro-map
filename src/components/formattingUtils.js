  // Color coding for democracy index (EIU scale, 0-10). Reuses the same
  // 5 official GPI peace-index colors (see getPeaceColor below) as every
  // other integer step, best (10) to worst (0), with the 4 in-between
  // steps interpolated as the midpoint RGB of their neighbors, plus one
  // final step (0-1) that's the midpoint between the worst peace color
  // and black - a dark red beyond anything the peace palette itself has.
  const getDemocracyColor = (value) => {
    if (value >= 9.0) {
      return '#048581' // GPI "very high" - reused as-is
    } else if (value >= 8.0) {
      return '#2CA396' // midpoint of the two neighboring steps
    } else if (value >= 7.0) {
      return '#53C1AB' // GPI "high" - reused as-is
    } else if (value >= 6.0) {
      return '#A6D29A'
    } else if (value >= 5.0) {
      return '#FAE389' // GPI "medium" - reused as-is
    } else if (value >= 4.0) {
      return '#F6AA6E'
    } else if (value >= 3.0) {
      return '#F37053' // GPI "low" - reused as-is
    } else if (value >= 2.0) {
      return '#F0463C'
    } else if (value >= 1.0) {
      return '#ED1D24' // GPI "very low" - reused as-is
    } else if (value >= 0.0) {
      return '#760E12' // midpoint of '#ED1D24' and black
    } else {
      return '#383838'
    }

  }

  // Color coding for peace index. Colors and cutoffs match the official
  // GPI "state of peace" five-band map legend (very high/high/medium/low/
  // very low), read directly off the 2026 Global Peace Index report
  // (https://gpi.economicsandpeace.org/data/GPI-2026-web.pdf, p.10-11).
  // IEP doesn't publish an exact numeric cutoff table - countries are
  // colored by score, so these are the rough midpoints between the last
  // country of one band and the first of the next in the report's ranked
  // table: very high/high between Singapore 1.435 and Finland 1.478,
  // high/medium between Turkmenistan 1.903 and Sri Lanka 1.91,
  // medium/low between Brazil 2.333 and Libya 2.361, low/very low between
  // Burkina Faso 2.882 and Central African Republic 2.906.
  const getPeaceColor = (value) => {
    if (value < 1.45) {
      return '#048581' // very high
    } else if (value < 1.905) {
      return '#53C1AB' // high
    } else if (value < 2.35) {
      return '#FAE389' // medium
    } else if (value < 2.9) {
      return '#F37053' // low
    } else if (value >= 2.9) {
      return '#ED1D24' // very low
    } else {
      return '#383838' // N/A
    }

  }

  // Formatting for USD import values to k, mn or bn
  const formatUSDvalue = (value) => {
    if (value > 1000000000) {
      return `${(value / 1000000000).toFixed(2)}`
    } else if (value > 1000000) {
      return `${(value / 1000000).toFixed(2)}`
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(2)}`
    }else {
      return value
    }
  }

  const formatUSDorder = (value) => {
    if (value > 1000000000) {
      return "billion"
    } else if (value > 1000000) {
      return "million"
    } else if (value > 1000) {
      return "thousand"
    }else {
      return ""
    }
  }

  // Format values for plot tooltips
  const formatTooltipValue = (value, name, props) => {
    return `${value.toLocaleString('en')}`
  }

  // Severity buckets for the Ongoing Conflicts sidebar section, keyed off
  // total_deaths_est. The floor (10,000) matches the dataset's own
  // definition of "major conflict" - every conflict surfaced here already
  // cleared that bar just to be included, so there's no "below active" tier.
  const getConflictSeverityColor = (totalDeathsEst) => {
    if (totalDeathsEst >= 1000000) {
      return 'var(--conflict-severity-critical)'
    } else if (totalDeathsEst >= 100000) {
      return 'var(--conflict-severity-major)'
    } else {
      return 'var(--conflict-severity-active)'
    }
  }

  const getConflictSeverityLabel = (totalDeathsEst) => {
    if (totalDeathsEst >= 1000000) {
      return 'Critical'
    } else if (totalDeathsEst >= 100000) {
      return 'Major'
    } else {
      return 'Active'
    }
  }

  // Compact single-value formatting for large casualty/displacement
  // figures, e.g. 258000 -> "258K", 1600000 -> "1.6M". Distinct from
  // formatUSDvalue/formatUSDorder above (which split a currency value into
  // a separate number + unit-word pair for the money-wrapper stat card) -
  // this is a single inline string for prose-like labels ("~258K killed").
  const formatCompactNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}K`
    } else {
      return `${value}`
    }
  }


  export {getDemocracyColor, getPeaceColor, formatUSDorder, formatUSDvalue, formatTooltipValue, getConflictSeverityColor, getConflictSeverityLabel, formatCompactNumber};
