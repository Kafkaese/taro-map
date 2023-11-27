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
                    Democracy Index data is sourced directly from <a href="https://en.wikipedia.org/wiki/The_Economist_Democracy_Index" style={{color: '#06d3fc'}}>Wikipedia</a> and is based on
                    the annual report by the <a href="https://www.eiu.com/n/" style={{color: '#06d3fc'}}>Economist Intelligence Unit</a>.
                    More information, including the most recent report is
                    available via the link in footnote [1]. 
                    </p>
                    <br/>
                    <p>Peace Index data is sourced directly from <a href="https://en.wikipedia.org/wiki/Global_Peace_Index" style={{color: '#06d3fc'}}>Wikipedia</a> and is based on
                    the annual report by <a href="https://www.visionofhumanity.org/" style={{color: '#06d3fc'}}>Visions of Humanity</a>.  More information, including the most recent report is
                    available via the link in footnote [2]. </p>
                    <br/>
                    <p>I make no claims of nor take any responsibility for correctness and/or completeness of the data presented here.</p>
                </div>
            </div>
        </div>
    )
}

export default DataSources;