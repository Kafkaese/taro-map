import React, { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, LineChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import { getDemocracyColor, getPeaceColor, formatUSDorder, formatUSDvalue, formatTooltipValue } from "./formattingUtils";
import SidebarCustomTooltip from "./SidebarCustomTooltip";
import CustomizedTick from "./CustomizedTicks";
import OngoingConflicts from "./OngoingConflicts";
import './SideBar.css'

// Collapsed default for the import-sources bar plot - full data (up to 20,
// see fetchImportSources' default limit) is already fetched, so expanding
// is a client-side slice, no extra request.
const COLLAPSED_SOURCE_COUNT = 5;

/**
 * Sidebar component for Import Map. Shows info for country currently selected on ImportMap:
 * - name of the country
 * - Source countries and corresponding mport values for the selected year and country in a bar plot
 *
 *
 * @param {object} countryData Data to be displayed in the side bar for the currently selected country
 * @param {function} onClose Called when the close button is clicked - the parent is responsible for actually hiding the sidebar and un-selecting the country on the map.
 * @param {integer} year Year currently selected on the parent map. Influences the data being displayed.
 */
const SideBarImports = ({countryData, onClose, year, settings}) => {

    const [showAllSources, setShowAllSources] = useState(false);

    // Collapses back to the top 5 whenever a new country is selected, so an
    // expanded view of one country doesn't carry over and look like it
    // applies to the next.
    useEffect(() => {
        setShowAllSources(false);
    }, [countryData.name.value]);

    const hasImportSources = countryData.importSources.value !== 'no data';
    const visibleSources = hasImportSources
        ? (showAllSources ? countryData.importSources : countryData.importSources.slice(0, COLLAPSED_SOURCE_COUNT))
        : [];

    return (
        <div className="sideBar">
            <div className="panel">
                <div className="title">
                    {countryData.name.value}
                </div>
                <div className="colorcoded-wrapper">
                    <div className="money-wrapper">
                        <div className="money">
                        {formatUSDvalue(countryData.totalImports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{`${formatUSDorder(countryData.totalImports.value)} ${settings.currency.symbol}`}</div></div>
                        <span className='money-label'>Imports</span>
                    </div>

                    <div className='circle-wrapper' style={{ '--stat-color': getDemocracyColor(countryData.democracyIndex.value) }}>
                        <div className="circle">
                        {countryData.democracyIndex.value}
                        </div>
                        <span className='circle-label'>Democracy Index<sup>[1]</sup></span>
                    </div>

                    <div className='circle-wrapper' style={{ '--stat-color': getPeaceColor(countryData.peaceIndex.value) }}>
                        <div className="circle">
                        {countryData.peaceIndex.value}
                        </div>
                        <span className='circle-label'>Peace Index <sup>[2]</sup></span>
                    </div>
                </div>

                <div className="scrollable-content">
                    <div className="barPlot-title">{`\n Import Source Countries ${year}`}</div>
                    <div className="barPlot">
                        <ResponsiveContainer width="100%" height={visibleSources.length*30+20}>
                        {hasImportSources ?
                        <BarChart
                            layout="vertical"
                            barSize={10}
                            barCategoryGap={'5%'}
                            barGap={'5%'}
                            data={visibleSources}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >

                            <YAxis dataKey="name" tick={CustomizedTick} type="category"/>
                            <XAxis hide={true} type="number" domain={[0, countryData.totalImports.value]} tick={false} />
                            <Tooltip content={<SidebarCustomTooltip settings={settings}/>} />
                            <Bar dataKey="value" fill="#06d3fc" background={{ fill: 'var(--deck-chip)' }}  name=" "/>
                        </BarChart> : <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <p style={{'flex': '0'}}>No data available</p>
                                    </div>}
                        </ResponsiveContainer>
                    </div>
                    {hasImportSources && countryData.importSources.length > COLLAPSED_SOURCE_COUNT && (
                        <button
                            type="button"
                            className="expand-sources-button"
                            onClick={() => setShowAllSources((prev) => !prev)}
                        >
                            {showAllSources ? 'Show top 5' : `Show all ${countryData.importSources.length}`}
                        </button>
                    )}

                    <div className="barPlot-title">Import Value Over Time</div>
                    <div className="timeSeries">
                    <ResponsiveContainer width="100%" height={200}>
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
                        <Tooltip contentStyle={{background: 'var(--deck-card)', border: '1px solid var(--deck-border)', borderRadius: '8px'}} formatter={formatTooltipValue} itemStyle={{color: 'var(--deck-text)'}} labelStyle={{color: 'var(--deck-text)', textAlign: 'center', fontWeight: 'bolder'}} separator=""/>
                        <Line unit={` ${settings.currency.symbol}`} dot={false} type="monotone" dataKey="value" stroke="#06d3fc" activeDot={{ r: 6, fill: '#06d3fc' }} name=" "/>
                        <ReferenceLine x={year} stroke="red" />
                    </LineChart>
                    </ResponsiveContainer>
                    </div>

                    <OngoingConflicts conflicts={countryData.conflicts} />
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

export default SideBarImports;
