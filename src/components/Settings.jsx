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
            <div className="language-selection">
                <div className="language-selection-header">Language</div>
                <Dropdown options={languageOptions}
                    onSelect={changeLanguage}
                    defaultValue={
                        {
                            value: 'EN',
                            label: 'English'
                        }
                }></Dropdown>
            </div>
        </div>
    )


};

export default Settings;
