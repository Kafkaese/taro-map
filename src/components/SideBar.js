import React, {useState} from "react";
import './SideBar.css'

const SideBar = ({countryData}) => {

     // Handles collapsebale logic
    const [collapsed, setCollapsed] = useState(false)

    const collapse = () => {
        setCollapsed(!collapsed)
        console.log(typeof countryData)
    }

    return (
        <div className="sideBar">
            <div className="panel" style={collapsed ? {width: '0%'} : {width: '30%'}}>
                <div className="title">
                    {countryData.name.value}
                </div>
                <div className="content">
                    Some content
                </div>
            </div>
            <button 
                className="button" 
                style={collapsed ? {left: '0%'} : {left: '30%'}}
                onClick={collapse}
            >
                {collapsed ? ">" : "<"} 
             </button>
        </div>
    )
}

export default SideBar;