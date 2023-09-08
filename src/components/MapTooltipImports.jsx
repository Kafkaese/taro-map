import React from "react"
import { formatUSDvalue, formatUSDorder, getDemocracyColor, getPeaceColor, getUSDColor } from "./formattingUtils"

const MapTooltip = (hoveredCountry, handleMouseEnterBox) => {

    console.log(hoveredCountry)
    
    return (
        <div>
            {hoveredCountry.totalImports &&
            <div className="hover-box-container" style={{top: hoveredCountry.position.y +5, left: hoveredCountry.position.x +10,}}
                onMouseEnter={handleMouseEnterBox}>
                    <h3>{hoveredCountry.countryName.value}</h3>

                    
                    <div className="circle-container">
                    
                    <div className="money-wrapper">
                        <div className="money" style={{ backgroundColor: getUSDColor(hoveredCountry.totalImports.value) }}>
                        {formatUSDvalue(hoveredCountry.totalImports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(hoveredCountry.totalImports.value)}</div></div>
                        <span className='money-label'>Imports</span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{ backgroundColor: getDemocracyColor(hoveredCountry.democracyIndex.value) }}>
                        {hoveredCountry.democracyIndex.value}
                        </div>
                        <span className='circle-label'>Democracy Index<sup>[1]</sup></span>
                    </div>

                    <div className='circle-wrapper'>
                        <div className="circle" style={{ backgroundColor: getPeaceColor(hoveredCountry.peaceIndex.value) }}>
                        {hoveredCountry.peaceIndex.value}
                        </div>
                        <span className='circle-label'>Peace Index <sup>[2]</sup></span>
                    </div>
                    
                    </div>
                </div>
                }
            </div>
    )
}

export default MapTooltip;