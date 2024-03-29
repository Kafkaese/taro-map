import React from "react";
import { useState } from "react";

import './ToggleButton.css'

/**
 * A toggle button with two text options. Selected option will be highlighted and state 
 * will be passed up.
 * 
 * @param {string} left Text on the left option
 * @param {string} right Text on right option
 * @param {function} onToggleChangeg Function to pass state up
 * 
 * @returns 
 */
const ToggleButton = ({left, right, onToggleChange}) => {

    const [leftActive, setLeftActive] = useState(true)

    const handleLeftClick = () => {
        setLeftActive(true)
        onToggleChange(true)
    }

    const handleRightClick = () => {
        setLeftActive(false)
        onToggleChange(false)
    }

    return (
        <div className="wrapper">
            <div className= {leftActive ? "text-box-active" : "text-box"} 
                onClick={handleLeftClick}
                data-testid="left-option"
                >
                    <div className="text">{left}</div>
            </div>
            <div className={!leftActive ? "text-box-active" : "text-box"} 
                onClick={handleRightClick}
                data-testid="right-option"
                >
                <div className="text">{right}</div>
            </div>
        </div>
    );
}

export default ToggleButton;