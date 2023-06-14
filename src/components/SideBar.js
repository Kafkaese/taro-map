import React, {useState} from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './SideBar.css'

const SideBar = ({countryData}) => {

     // Handles collapsebale logic
    const [collapsed, setCollapsed] = useState(false)

    const collapse = () => {
        setCollapsed(!collapsed)
        console.log(countryData)
    }

      // Color coding for democracy index
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
      // Color coding for peace index
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

  // Color coding for USD import values
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

    return (
        <div className="sideBar">
            <div className="panel" style={collapsed ? {width: '0%'} : {width: '30%'}}>
                <div className="title">
                    {countryData.name.value}
                </div>
                <div className="colorcoded-wrapper">
                    <div className="money-wrapper">
                        <div className="money" style={{ backgroundColor: getUSDColor(countryData.total_imports.value) }}>
                        {formatUSDvalue(countryData.total_imports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(countryData.total_imports.value)}</div></div>
                        <span className='money-label'>Imports</span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px', backgroundColor: getDemocracyColor(countryData.democracy_index.value) }}>
                        {countryData.democracy_index.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Democracy Index<sup>[1]</sup></span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px', backgroundColor: getPeaceColor(countryData.peace_index.value) }}>
                        {countryData.peace_index.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Peace Index <sup>[2]</sup></span>
                    </div>
                </div>
                <div className="barPlot">
                    <div style={{width: collapsed ? '0' : '100%', overflow: "hidden"}}>Distribution of Imports</div>
                    <BarChart
                        layout="vertical"
                        barSize={10}
                        width={collapsed ? 0 : 500}
                        height={500}
                        barCategoryGap={1}
                        barGap={1}
                        data={countryData.sources}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <YAxis dataKey="name" type="category"/>
                        <XAxis type="number" domain={[0, countryData.total_imports.value]} tick={false}/>
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" background={{ fill: '#eee' }} unit={" EUR"} name="Import value"/>
                    </BarChart>
                    
                </div>

                <div className="timeSeries">
                    Time Series
                </div>

                <button 
                    className="button" 
                    style={collapsed ? {left: '0%'} : {left: '100%'}}
                    onClick={collapse}
                >
                    {collapsed ? ">" : "<"} 
                </button>
            </div>
        </div>
    )
}

export default SideBar;