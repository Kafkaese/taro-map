import React from "react";
import {useState} from "react";
import Dropdown from "./Dropdown";

import './Settings.css';

const colorModeOptions = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' }
]

const Settings = ({settings, setSettings, colorMode, setColorMode}) => {

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
    }

    const changeColorMode = (option) => {
        setColorMode(option.value)
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
            <div className="settings-row">
                <div className="settings-row-label">Currency:</div>
                <div className="settings-row-dropdown">
                <Dropdown  options={currencyOptions}
                    onSelect={changeCurrency}
                    value={settings.currency}
                    ariaLabel="Currency"
                ></Dropdown>
                </div>
                <button
                    type="button"
                    className="settings-row-info"
                    onMouseOver={handleMouseEnterInfoIcon}
                    onMouseOut={handleMouseLeaveInfoIcon}
                    onFocus={handleMouseEnterInfoIcon}
                    onBlur={handleMouseLeaveInfoIcon}
                    aria-label="Currency information"
                ><span className="icon" aria-hidden="true"></span></button>
            </div>
            <div className="settings-row">
                <div className="settings-row-label">Theme:</div>
                <div className="settings-row-dropdown">
                <Dropdown options={colorModeOptions}
                    onSelect={changeColorMode}
                    value={colorModeOptions.find((option) => option.value === colorMode)}
                    ariaLabel="Theme"
                ></Dropdown>
                </div>
            </div>
            {showCurrencyInfo ? <p className="currency-info-box">EUR is currency from original data. For USD historical exchange rate for the corresponding year is used.</p> : ''}
        </div>
    )


};

export default Settings;
