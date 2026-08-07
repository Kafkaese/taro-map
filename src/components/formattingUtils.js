  // Color coding for democracy index. Thresholds approximate the EIU
  // Democracy Index's own four regime categories (full/flawed/hybrid/
  // authoritarian: officially 8.01/6.01/4.01), rounded here to 9.0/7.0/4.0.
  const getDemocracyColor = (value) => {
    if (value >= 9.0) {
      return '#008000'
    } else if (value >= 7.0) {
      return '#98fb98'
    } else if (value >= 4.0) {
      return '#ffae42'
    } else if (value >= 0.0) {
      return '#8b0000'
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

  // Color coding for USD import/export values. Unlike the two thresholds
  // above, 4713.75 and 342.5 don't correspond to any known public dataset
  // or documented rationale - origin unclear. If you're the one who picked
  // these, please replace this comment with the actual reasoning.
  const getUSDColor = (value) => {
    if (value >= 4713.75) {
      return '#8b0000'
    } else if (value >= 342.5) {
      return '#ffae42'
    } else if (value >= 0) {
      return '#008000'
    } else {
      return '#383838'}
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


  export {getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue, formatTooltipValue};
