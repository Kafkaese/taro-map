import React from "react";
import { useState } from "react";

import './ToggleButton.css'

const ToggleButton = ({left, right}) => {



    return (
        <div className="wrapper">
            <div className="text-box"><text className="text">{left}</text></div>
            <div className="text-box"><text className="text">{right}</text></div>
        </div>
    );
}

export default ToggleButton;