import React from "react";
import SideBarImports from "./SideBarImports";
import SideBarExports from "./SideBarExports";

const SideBar = ({
    mapModeImport,
    countryData,
    collapsed,
    onCollapse,
    year,
    settings
}) => {

    return (
        <div> {
            mapModeImport ? <SideBarImports countryData={countryData}
                collapsed={collapsed}
                onCollapse={onCollapse}
                year={year}
                settings={settings}/> : <SideBarExports countryData={countryData}
                collapsed={collapsed}
                onCollapse={onCollapse}
                year={year}
                settings={settings}/>
        } </div>
    )

}

export default SideBar;
