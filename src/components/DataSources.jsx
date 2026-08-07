import React from "react";
import './DataSources.css';

const DataSources = () => {

    return (
        <div className="data-sources">
            <h1>Data Sources</h1>
            <div className="columns">
                <div className="column">
                    <p>The data displayed here regarding the import and export of arms is
                    directly sourced from the <a href="https://caat.org.uk/">CAAT</a> github
                    respository (accessible <a href="https://github.com/caatdata/eu-arms-export-data">here</a>).
                    The raw data as provided by CAAT is sourced from the Official Journal of the European Union
                    annual reports on the European Union Code of Conduct on Arms Exports, published by The
                    European Union Council Working Party on Conventional Arms Exports. Re-use and -publication
                    is explicitly permited for non-commercial use by the
                    <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011D0833"> Commission Decision
                    of 12 December 2011 on the reuse of Commission documents</a>.</p>
                    <p>As the data contains only numbers about arms exports and only of some bu not all members of the European Union,
                    all data displayed regarding arms imports, in particular for non-EU countries, is based on aggredated data from EU member states. Therefore the data is to be considered highly incomplete.</p>
                    <p>I make no claims of nor take any responsibility for correctness and/or completeness of the data presented here.</p>
                </div>
                <div className="column">
                    <p>
                    Democracy Index data is sourced directly from <a href="https://en.wikipedia.org/wiki/The_Economist_Democracy_Index">Wikipedia</a> and is based on
                    the annual report by the <a href="https://www.eiu.com/n/">Economist Intelligence Unit</a>.
                    More information, including the most recent report is
                    available via the link in footnote [1].
                    </p>
                    <br/>
                    <p>Peace Index data is sourced directly from <a href="https://en.wikipedia.org/wiki/Global_Peace_Index">Wikipedia</a> and is based on
                    the annual report by <a href="https://www.visionofhumanity.org/">Visions of Humanity</a>.  More information, including the most recent report is
                    available via the link in footnote [2]. </p>
                    <br/>
                    <p>I make no claims of nor take any responsibility for correctness and/or completeness of the data presented here.</p>
                </div>
            </div>
        </div>
    )
}

export default DataSources;
