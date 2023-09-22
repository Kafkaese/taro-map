import React from "react";
import {useState} from "react";
import Dropdown from "./Dropdown";

import './Settings.css';

const Settings = ({settings, setSettings}) => {

    const currencyOptions = [
        {
            value: 'USD',
            label: 'US Dollar'
        }, {
            value: 'EUR',
            label: 'Euro'
        }
    ]
    const changeCurrency = (option) => {
        setSettings({
            ...settings,
            currency: option
        })
        console.log(settings)
    }

    return (
        <div className="settings">
            <h3 className="settings-header">Settings</h3>
            <div className="currency-selection">
                <div className="currency-header">Currency:</div>
                <div className="currency-dropdown">
                <Dropdown  options={currencyOptions}
                    onSelect={changeCurrency}
                    defaultValue={
                        {
                            value: 'EUR',
                            label: 'Euro'
                        }
                }></Dropdown>
                </div>
                <div className="currency-info"><img className="icon" src="/information-button.png" alt='i'></img></div>
            </div>
            <p className="currency-info-box">As Data displays the currency for every individual instance as in the original data source. If specific currency is picked, the historical exchange rate will be used.</p>
        </div>
    )


};

export default Settings;
