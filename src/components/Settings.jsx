import React from "react";
import {useState} from "react";
import Dropdown from "./Dropdown";

import './Settings.css';

const Settings = ({settings, setSettings}) => {

    const languageOptions = [
        {
            value: 'EN',
            label: 'English'
        }, {
            value: 'DE',
            label: 'Deutsch'
        }, {
            value: 'FR',
            label: 'Français'
        }
    ]
    const changeLanguage = (option) => {
        setSettings({
            ...settings,
            language: option
        })
        console.log(settings)
    }

    return (
        <div className="settings">
            <Dropdown options={languageOptions}
                onSelect={changeLanguage}
                defaultValue={
                    {
                        value: 'EN',
                        label: 'English'
                    }
            }></Dropdown>
        </div>
    )


};

export default Settings;
