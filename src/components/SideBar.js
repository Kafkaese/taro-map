import React, {useState} from "react";
import './SideBar.css'

const SideBar = ({countryData}) => {

    const [collapsed, setCollapsed] = useState(false)

    const collapse = () => {
        setCollapsed(!collapsed)
        console.log(typeof countryData)
        console.log(typeof countryData.name === 'undefined')
    }

    return (
        <div className="sideBar">
            <div className="panel" style={collapsed ? {width: '0%'} : {width: '30%'}}>
                <div className="title">
                    {typeof countryData.name !== 'undefined' ? countryData.name.value : ""}
                </div>
                <div className="content">
                    Some content
                </div>
            </div>
            <button 
                className="button" 
                style={collapsed ? {left: '0%'} : {left: '30.45%'}}
                onClick={collapse}
            >
                {collapsed ? ">" : "<"} 
             </button>
        </div>
    )
}

export default SideBar;