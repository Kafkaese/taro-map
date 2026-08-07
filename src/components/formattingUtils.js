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

  // Color coding for peace index. The Global Peace Index's published scale
  // runs ~1 (most peaceful) to ~5 (least peaceful); these are just an even
  // linear split of that range into 5 bands, not an official GPI category.
  const getPeaceColor = (value) => {
    if (value < 1.0) {
      return '#00E676' // green
    } else if (value < 2.0) {
      return '#C6FF00' // green-yellow
    } else if (value < 3.0) {
      return '#d4d400' // yellow
    } else if (value < 4.0) {
      return '#FFD600' // orange
    } else {
      return '#383838' // red
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
