import React from "react";
import { BarChart, Bar, CartesianGrid, LineChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {formatUSDorder, formatUSDvalue, formatTooltipValue } from "./formattingUtils";
import SidebarCustomTooltip from "./SidebarCustomTooltip";
import CustomizedTick from "./CustomizedTicks";
import './SideBar.css'

/**
 * Sidebar component for Import Map. Shows info for country currently selected on ImportMap:
 * - name of the country
 * - Source countries and corresponding mport values for the selected year and country in a bar plot
 *  
 * 
 * @param {object} countryData Data to be sidplayed in the side bar for the currently selected country
 * @param {function} onClose Called when the close button is clicked - the parent is responsible for actually hiding the sidebar and un-selecting the country on the map.
 * @param {integer} year Year currently selected on the parent map. Influences the data being displayed.
 */
const SideBarExports = ({countryData, onClose, year, settings}) => {

    return (
        <div className="sideBar">
            <div className="panel">
                <div className="title">
                    {countryData.name.value}
                </div>
                <div className="colorcoded-wrapper">
                    <div className="money-wrapper">
                        <div className="money">
                            {formatUSDvalue(countryData.totalExports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{`${formatUSDorder(countryData.totalExports.value)} ${settings.currency.symbol}`}</div></div>
                        <span className='money-label'>Exports</span>
                    </div>
                </div>
                <div className="barPlot-title">{`\n Export Destination Countries ${year}`}</div>

                <div className="barPlot">
                    <ResponsiveContainer width="100%" height={countryData.exportSources.length*30+20}>
                    { (countryData.exportSources.value !== 'no data') ? <BarChart
                        layout="vertical"
                        barSize={10}
                        barCategoryGap={1}
                        barGap={1}
                        data={countryData.exportSources}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 4,
                            bottom: 5,
                        }}
                    >
                        <YAxis dataKey="name" tick={CustomizedTick} type="category" width={28}/>
                        <XAxis type="number" domain={[0, countryData.totalExports.value]} tick={false}/>
                        <Tooltip content={<SidebarCustomTooltip settings={settings}/>} />
                        <Bar dataKey="value" fill="#06d3fc" background={{ fill: 'var(--deck-chip)' }} name=" "/>
                    </BarChart> : <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <p style={{flex: '0', textDecoration: 'none'}}>No data available</p>
                                </div>}
                    </ResponsiveContainer>
                </div>

                <div className="timeSeries">
                <ResponsiveContainer width="100%" height={300}>
                <LineChart
                width={500}
                height={300}
                data={countryData.exportTimeSeries}
                margin={{
                    top: 5,
                    right: 30,
                    left: 4,
                    bottom: 5,
                }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                        tick={false}
                        width={40}
                        label={{
                            value: `Total Export Value (${settings.currency.value})`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'center',
                    }}/>
                    <Tooltip contentStyle={{background: 'var(--deck-card)', border: '1px solid var(--deck-border)', borderRadius: '8px'}} separator="" itemStyle={{color: 'var(--deck-text)'}} labelStyle={{color: 'var(--deck-text)', textAlign: 'center', fontWeight: 'bolder'}} formatter={formatTooltipValue}/>
                    <Line unit={` ${settings.currency.symbol}`} dot={false} type="monotone" dataKey="value" stroke="#06d3fc" activeDot={{ r: 6, fill: '#06d3fc' }} name=" "/>
                    <ReferenceLine x={year} stroke="red" />
                </LineChart>
                </ResponsiveContainer>
                </div>

                <button
                    className="button"
                    aria-label="Close country details"
                    onClick={onClose}
                >
                    ←
                </button>
            </div>
        </div>
    )
}

export default SideBarExports;