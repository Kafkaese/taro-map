import React from "react";
import PercentageCircle from "./PercentageCircle";
import { formatUSDvalue, formatUSDorder, getUSDColor } from "./formattingUtils";

/**
 * Renders Tooltip with export data on the WorldMap.
 * 
 * @param {object} hoveredCountry Country data
 * @param {function} handleMouseEnterBox Function on parent that handles mouse being over the tooltip.
 * 
 */
const MapTooltipExports = (hoveredCountry, settings) => {

    return (
        <div>
            {hoveredCountry.totalArmsExports && 
            <div className="hover-box-container" style={{top: hoveredCountry.position.y +5, left: hoveredCountry.position.x +10,}}
                >
                    <h3>{hoveredCountry.countryName.value}</h3>

                    
                    <div className="circle-container">
                    
                    <div className="money-wrapper">
                        <div className="money" style={{ backgroundColor: getUSDColor(hoveredCountry.totalArmsExports.value) }}>
                            {formatUSDvalue(hoveredCountry.totalArmsExports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(hoveredCountry.totalArmsExports.value) && `${formatUSDorder(hoveredCountry.totalArmsExports.value)} ${settings.currency.symbol}`}</div></div>
                        <span className='money-label'>Exports</span>
                    </div>

                    <div className='circle-wrapper'>
                        <PercentageCircle percentage={((hoveredCountry.totalArmsExports.value/1000000) / hoveredCountry.totalMerchExports.value) * 100}/>
                        <span className='circle-label'>Percentage of Exports<sup>[1]</sup></span>
                    </div>
                    
                    </div>
                </div>
            }
        </div>
    )
};

export default MapTooltipExports;