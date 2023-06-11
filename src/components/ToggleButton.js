import React from "react";
import { useState } from "react";

import './ToggleButton.css'

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