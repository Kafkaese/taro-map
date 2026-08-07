import React from "react";
import { BarChart, Bar, CartesianGrid, LineChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue, formatTooltipValue } from "./formattingUtils";
import SidebarCustomTooltip from "./SidebarCustomTooltip";
import CustomizedTick from "./CustomizedTicks";
import './SideBarImports.css'


/**
 * Sidebar component for Import Map. Shows info for country currently selected on ImportMap:
 * - name of the country
 * - Source countries and corresponding mport values for the selected year and country in a bar plot
 *  
 * 
 * @param {object} countryData Data to be displayed in the side bar for the currently selected country
 * @param {boolean} collapsed Wether or not the side bar is currently collapsed. 
 * @param {function} onCollapse Funcion to be called when the side bar is being (un-)collapsed by the cooresponding button. 
 * @param {integer} year Year currently selected on the parent map. Influences the data being displayed.
 */
const SideBarImports = ({countryData, collapsed, onCollapse, year, settings}) => {

    const collapse = () => {
        onCollapse(!collapsed)
    }


    return (
        <div className="sideBar">
            <div className="panel" style={collapsed ? {width: '0%'} : {maxWidth: '500px', width: '95vw'}}>
                <div className="title">
                    {countryData.name.value}
                </div>
                <div className="colorcoded-wrapper">
                    <div className="money-wrapper" style={{ '--stat-color': getUSDColor(countryData.totalImports.value) }}>
                        <div className="money">
                        {formatUSDvalue(countryData.totalImports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{`${formatUSDorder(countryData.totalImports.value)} ${settings.currency.symbol}`}</div></div>
                        <span className='money-label'>Imports</span>
                    </div>

                    <div className='circle-wrapper' style={{ '--stat-color': getDemocracyColor(countryData.democracyIndex.value) }}>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px'}}>
                        {countryData.democracyIndex.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Democracy Index<sup>[1]</sup></span>
                    </div>

                    <div className='circle-wrapper' style={{ '--stat-color': getPeaceColor(countryData.peaceIndex.value) }}>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px'}}>
                        {countryData.peaceIndex.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Peace Index <sup>[2]</sup></span>
                    </div>
                </div>
                <div className="barPlot-title" style={{width: collapsed ? '0' : '100%'}}>{`\n Import Source Countries ${year}`}</div>
                <div className="barPlot">
                    <ResponsiveContainer width={collapsed ? 0 : "100%"} height={countryData.importSources.length*30+20}>
                    {countryData.importSources.value !== 'no data' ? 
                    <BarChart
                        layout="vertical"
                        barSize={10}
                        barCategoryGap={'5%'}
                        barGap={'5%'}
                        data={countryData.importSources}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        
                        <YAxis dataKey="name" tick={CustomizedTick} type="category"/>
                        <XAxis hide={true} type="number" domain={[0, countryData.totalImports.value]} tick={false} />
                        <Tooltip content={<SidebarCustomTooltip settings={settings}/>} />
                        <Bar dataKey="value" fill="#06d3fc" background={{ fill: '#1c2536' }}  name=" "/>
                    </BarChart> : <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <p style={{'flex': '0'}}>No data available</p>
                                </div>}
                    </ResponsiveContainer>
                </div>

                <div className="timeSeries">
                <ResponsiveContainer width={collapsed ? 0 : "100%"}>
                <LineChart
                data={countryData.importTimeSeries}
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
                            value: `Total Import Value (${settings.currency.value})`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'right',
                            offset: -15,
                    }}/>
                    <Tooltip contentStyle={{background: '#131b2b', border: 'none', borderRadius: '8px'}} formatter={formatTooltipValue} itemStyle={{color: 'white'}} labelStyle={{color: 'white', textAlign: 'center', fontWeight: 'bolder'}} separator=""/>
                    <Line unit={` ${settings.currency.symbol}`} dot={false} type="monotone" dataKey="value" stroke="#06d3fc" activeDot={{ r: 6, fill: '#06d3fc' }} name=" "/>
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

export default SideBarImports;