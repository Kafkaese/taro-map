import React, {useState} from "react";
import './SideBar.css'

const SideBar = () => {

    const [collapsed, setCollapsed] = useState(false)

    const collapse = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div className="sideBar">
            <div className="panel" style={collapsed ? {width: '0%'} : {width: '30%'}}>

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