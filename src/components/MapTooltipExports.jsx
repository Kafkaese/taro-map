import React from "react";
import { formatUSDvalue, formatUSDorder } from "./formattingUtils";

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
                        <div className="money">
                            {formatUSDvalue(hoveredCountry.totalArmsExports.value)}
                        </div>
                        <div className='annotate'><div className='text'>{formatUSDorder(hoveredCountry.totalArmsExports.value) && `${formatUSDorder(hoveredCountry.totalArmsExports.value)} ${settings.currency.symbol}`}</div></div>
                        <span className='money-label'>Exports</span>
                    </div>

                    </div>
                </div>
            }
        </div>
    )
};

export default MapTooltipExports;