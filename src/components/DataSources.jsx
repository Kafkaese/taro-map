import React from "react";

const DataSources = () => {

    return (
        <div>
            <h1 style={{textAlign: 'center', color: 'white'}}>Data Sources</h1>
            <div style={{ display: 'table', clear: 'both', marginLeft: '50px', marginRight: '50px', color: 'white', fontSize: '11pt'}}>
                <div style={{float: 'left', width: '49%'}}>
                    <p>The data displayed here regarding the import and export of arms is 
                    directly sourced from the <a href="https://caat.org.uk/" style={{color: '#06d3fc'}}>CAAT</a> github 
                    respository (accessible <a href="https://github.com/caatdata/eu-arms-export-data" style={{color: '#06d3fc'}}>here</a>). 
                    The raw data as provided by CAAT is sourced from the Official Journal of the European Union 
                    annual reports on the European Union Code of Conduct on Arms Exports, published by The 
                    European Union Council Working Party on Conventional Arms Exports. Re-use and -publication
                    is explicitly permited for non-commercial use by the 
                    <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011D0833" style={{color: '#06d3fc'}}> Commission Decision
                    of 12 December 2011 on the reuse of Commission documents</a>.</p>
                    <p>As the data contains only numbers about arms exports and only of some bu not all members of the European Union,
                    all data displayed regarding arms imports, in particular for non-EU countries, is based on aggredated data from EU member states. Therefore the data is to be considered highly incomplete.</p>
                    <p>I make no claims of nor take any responsibility for correctness and/or completeness of the data presented here.</p>
                </div>
                <div style={{marginLeft: '2%', float: 'left', width: '49%'}}>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla aliquet porttitor lacus luctus. Eu mi bibendum neque egestas. Nam at lectus urna duis. Porttitor lacus luctus accumsan tortor. Fringilla ut morbi tincidunt augue interdum velit. Tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Dictum varius duis at consectetur lorem. Rutrum quisque non tellus orci. Ultrices gravida dictum fusce ut placerat orci nulla. Sit amet justo donec enim diam vulputate. Nulla at volutpat diam ut venenatis tellus in metus. Lectus arcu bibendum at varius. Gravida neque convallis a cras semper auctor neque vitae. Cras semper auctor neque vitae tempus quam pellentesque. Id leo in vitae turpis massa sed elementum tempus egestas.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DataSources;