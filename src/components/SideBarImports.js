import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ReferenceLine} from 'recharts';
import { getDemocracyColor, getPeaceColor, getUSDColor, formatUSDorder, formatUSDvalue } from "./formattingUtils";
import './SideBarImports.css'

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
const SideBarImports = ({countryData, collapsed, onCollapse, year}) => {

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
                        <div className="money" style={{ backgroundColor: getUSDColor(countryData.totalImports.value) }}>
                        {formatUSDvalue(countryData.totalImports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(countryData.totalImports.value)}</div></div>
                        <span className='money-label'>Imports</span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px', backgroundColor: getDemocracyColor(countryData.democracyIndex.value) }}>
                        {countryData.democracyIndex.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Democracy Index<sup>[1]</sup></span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{width: collapsed ? '0%' : '70px', backgroundColor: getPeaceColor(countryData.peaceIndex.value) }}>
                        {countryData.peaceIndex.value}
                        </div>
                        <span className='circle-label' style={{width: collapsed ? '0%' : '100%'}}>Peace Index <sup>[2]</sup></span>
                    </div>
                </div>
                <div className="barPlot">
                    <div style={{width: collapsed ? '0' : '100%', overflow: "hidden"}}>{`Distribution of Imports ${year}`}</div>
                    <BarChart
                        layout="vertical"
                        barSize={10}
                        width={collapsed ? 0 : 500}
                        height={200}
                        barCategoryGap={1}
                        barGap={1}
                        data={countryData.importSources}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        
                        <YAxis dataKey="full_name" type="category"/>
                        <XAxis type="number" domain={[0, countryData.totalImports.value]} tick={false} />
                        <Tooltip contentStyle={{background: '#101827'}} itemStyle={{color: 'white'}}/>
                        <Bar dataKey="value" fill="#60dbfc" background={{ fill: 'grey' }}  unit={" EUR"} name="Import value"/>
                    </BarChart>
                    
                </div>

                <div className="timeSeries">
                <LineChart
                width={collapsed ? 0 : 500}
                height={300}
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
                            value: `Total Import Value (EUR)`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'right',
                            offset: -15,
                    }}/>
                    <Tooltip contentStyle={{background: '#101827'}} itemStyle={{color: 'white'}} labelStyle={{color: 'white', textAlign: 'center', fontWeight: 'bolder'}}/>
                    <Line type="monotone" dataKey="value" stroke="#60dbfc" activeDot={{ r: 8 }} unit={" EUR"} name="Import value"/>
                    <ReferenceLine x={year} stroke="red" />
                </LineChart>
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