import React, {useState} from "react";
import './SideBar.css'

const SideBar = () => {

    const [collapsed, setCollapsed] = useState(true)
    return (
        <div className="sideBar" style={collapsed ? {width: '0%'} : {width: '30%'}}>

        </div>
    )
}

export default SideBar;