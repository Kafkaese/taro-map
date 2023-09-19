import React from "react";
import SideBarImports from "./SideBarImports";
import SideBarExports from "./SideBarExports";

const SideBar = ({
    mapModeImport,
    countryData,
    collapsed,
    onCollapse,
    year
}) => {

    return (
        <div> {
            mapModeImport ? <SideBarImports countryData={countryData}
                collapsed={collapsed}
                onCollapse={onCollapse}
                year={year}/> : <SideBarExports countryData={countryData}
                collapsed={collapsed}
                onCollapse={onCollapse}
                year={year}/>
        } </div>
    )

}

export default SideBar;
