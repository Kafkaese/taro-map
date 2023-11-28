import React from "react";
import {useState} from "react";
import Dropdown from "./Dropdown";

import './Settings.css';

const Settings = ({settings, setSettings}) => {

    const currencyOptions = [
        {
            value: 'USD',
            label: 'US Dollar',
            symbol: '$'
        }, {
            value: 'EUR',
            label: 'Euro',
            symbol: '€'
        }
    ]
    const changeCurrency = (option) => {
        setSettings({
            ...settings,
            currency: option
        })
        console.log(settings)
    }


    // Handles currency info 
    const [showCurrencyInfo, setShowCurrencyInfo] = useState(false);

    const handleMouseEnterInfoIcon = () => {
        setShowCurrencyInfo(true)
    }
    const handleMouseLeaveInfoIcon = () => {
        setShowCurrencyInfo(false)
    }

    return (
        <div className="settings" onClick={(e) => {e.stopPropagation();}}>
            <h3 className="settings-header">Settings</h3>
            <div className="currency-selection">
                <div className="currency-header">Currency:</div>
                <div className="currency-dropdown">
                <Dropdown  options={currencyOptions}
                    onSelect={changeCurrency}
                    defaultValue={
                        settings.currency
                }></Dropdown>
                </div>
                <div className="currency-info" onMouseOver={handleMouseEnterInfoIcon} onMouseOut={handleMouseLeaveInfoIcon}><img className="icon" src="/information-button.png" alt='i'></img></div>
            </div>
            {showCurrencyInfo ? <p className="currency-info-box">EUR is currency from original data. For USD historical exchange rate for the corresponding year is used.</p> : ''}
        </div>
    )


};

export default Settings;
