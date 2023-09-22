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
                <div className="currency-info">INFO</div>
            </div>
        </div>
    )


};

export default Settings;
