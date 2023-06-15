import React, {useState} from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import './SideBar.css'

const SideBar = ({countryData, collapsed, onCollapse}) => {

     // Handles collapsebale logic
    //const [collapsed, setCollapsed] = useState(false)

    const collapse = () => {
        onCollapse(!collapsed)
        console.log(countryData)
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
                        height={200}
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
                        <Tooltip contentStyle={{background: '#101827'}} itemStyle={{color: 'white'}}/>
                        <Bar dataKey="value" fill="#60dbfc" background={{ fill: 'grey' }} unit={" EUR"} name="Import value"/>
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