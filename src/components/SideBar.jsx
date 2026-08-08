import React from "react";
import SideBarImports from "./SideBarImports";
import SideBarExports from "./SideBarExports";

const SideBar = ({
    mapModeImport,
    countryData,
    onClose,
    year,
    settings
}) => {

    return (
        <div> {
            mapModeImport ? <SideBarImports countryData={countryData}
                onClose={onClose}
                year={year}
                settings={settings}/> : <SideBarExports countryData={countryData}
                onClose={onClose}
                year={year}
                settings={settings}/>
        } </div>
    )

}

export default SideBar;
