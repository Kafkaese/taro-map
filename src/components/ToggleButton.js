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
        console.log(leftActive)
    }

    const handleRightClick = () => {
        setLeftActive(false)
        onToggleChange(false)
        console.log(leftActive)
    }

    return (
        <div className="wrapper">
            <div className= {leftActive ? "text-box-active" : "text-box"} onClick={handleLeftClick}><text className="text">{left}</text></div>
            <div className={!leftActive ? "text-box-active" : "text-box"} onClick={handleRightClick}><text className="text">{right}</text></div>
        </div>
    );
}

export default ToggleButton;