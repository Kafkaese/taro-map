import React from "react";
import { BarChart, Bar, CartesianGrid, LineChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {getUSDColor, formatUSDorder, formatUSDvalue, formatTooltipValue } from "./formattingUtils";
import PercentageCircle from "./PercentageCircle";
import SidebarCustomTooltip from "./SidebarCustomTooltip";
import CustomizedTick from "./CustomizedTicks";

/**
 * Sidebar component for Import Map. Shows info for country currently selected on ImportMap:
 * - name of the country
 * - Source countries and corresponding mport values for the selected year and country in a bar plot
 *  
 * 
 * @param {object} countryData Data to be sidplayed in the side bar for the currently selected country
 * @param {boolean} collapsed Wether or not the side bar is currently collapsed. 
 * @param {function} onCollapse Funcion to be called when the side bar is being (un-)collapsed by the cooresponding button. 
 * @param {integer} year Year currently selected on the parent map. Influences the data being displayed.
 */
const SideBarExports = ({countryData, collapsed, onCollapse, year, settings}) => {

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
                    <div className="money-wrapper" style={{widht: collapsed ? '0px' : '70px', overflow: "hidden"}}>
                        <div className="money" style={{ backgroundColor: getUSDColor(countryData.totalExports.value) }}>
                            {formatUSDvalue(countryData.totalExports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(countryData.totalExports.value)}</div></div>
                        <span className='money-label'>Exports</span>
                    </div>

                    <div className='circle-wrapper' style={{widht: collapsed ? '0px' : '70px', overflow: "hidden"}}>
                        <PercentageCircle percentage={((countryData.totalExports.value/1000000) / countryData.merchExports.value) * 100} style={{widht: collapsed ? '0px' : '70px', overflow: "hidden"}}/>
                        <span className='circle-label' style={{width: collapsed ? '0' : '100%', }}>Percentage of Exports<sup>[1]</sup></span>
                    </div>
                </div>
                <div style={{color: 'white', textAlign: 'center', textDecoration: 'underline', width: collapsed ? '0' : '100%', overflow: "hidden"}}>{`Export Destination Countries ${year}`}</div>

                <div className="barPlot">
                    <ResponsiveContainer width={collapsed ? 0 : "100%"} height={countryData.exportSources.length*30+20}>
                    { (countryData.exportSources.value !== 'no data') ? <BarChart
                        layout="vertical"
                        barSize={10}
                        barCategoryGap={1}
                        barGap={1}
                        data={countryData.exportSources}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <YAxis dataKey="name" tick={CustomizedTick} type="category"/>
                        <XAxis type="number" domain={[0, countryData.totalExports.value]} tick={false}/>
                        <Tooltip content={<SidebarCustomTooltip settings={settings}/>} />
                        <Bar dataKey="value" fill="#60dbfc" background={{ fill: 'grey' }} name=" "/>
                    </BarChart> : <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <p style={{flex: '0', textDecoration: 'none'}}>No data available</p>
                                </div>}
                    </ResponsiveContainer>
                </div>

                <div className="timeSeries">
                <ResponsiveContainer width={collapsed ? 0 : "100%"} height={300}>
                <LineChart
                width={collapsed ? 0 : 500}
                height={300}
                data={countryData.exportTimeSeries}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis 
                        tick={false} 
                        label={{
                            value: `Total Export Value (${settings.currency.value})`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'right',
                            offset: -15,
                    }}/>
                    <Tooltip contentStyle={{background: '#101827', borderRadius: '8px'}} separator="" itemStyle={{color: 'white'}} labelStyle={{color: 'white', textAlign: 'center', fontWeight: 'bolder'}} formatter={formatTooltipValue}/>
                    <Line unit={` ${settings.currency.symbol}`} dot={false} type="monotone" dataKey="value" stroke="#60dbfc" activeDot={{ r: 8 }} name=" "/>
                    <ReferenceLine x={year} stroke="red" />
                </LineChart>
                </ResponsiveContainer>
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

export default SideBarExports;