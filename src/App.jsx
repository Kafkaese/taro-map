import React, {useState, useEffect, useCallback} from 'react';
import WorldMap from './components/WorldMap';
import YearSlider from './components/YearSlider';
import ToggleButton from './components/ToggleButton';
import Settings from './components/Settings';
    
import './App.css'

function App() { // API vars from env

    //const API_HOST = 'localhost'
    //const API_PORT = '8080'

    // Grab API varibles from env_config.js 
    const API_HOST = window._env_.REACT_APP_API_HOST
    const API_PORT = window._env_.REACT_APP_API_PORT

    // Controls which map is shown
    const [mapModeImport, setMapModeImport] = useState(true);

    // Sets map active based on state of the button
    const toggleComponent = (leftActive) => {
        leftActive ? setMapModeImport(true) : setMapModeImport(false);
    };

    // Displayed year
    const [year, setYear] = useState(2020)
    const handleYearChange = (newYear) => {
        setYear(() => newYear);
    }


    // Settings
    // User defined map settings
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        language: "English",
        currency: {
            value: 'USD',
            label: 'US Dollar',
            symbol: '$'
        }
    });


    // Data for sidebar
    const [activeCountryData, setActiveCountryData] = useState({});

    // Needs to be tracked here for updating activeCountryData on year change
    const [activeCountryAlpha2, setActiveCountryAlpha2] = useState('')

    // Fetches data for country currently hovered over
    const updateActiveCountry = useCallback(async (alpha2) => {
        try {

            setActiveCountryAlpha2(alpha2)

            const name = await fetch(`http://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`)
            const democracyIndex = await fetch(`http://${API_HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`);
            const totalImports = await fetch(`http://${API_HOST}:${API_PORT}/arms/imports/total?country_code=${alpha2}&year=${year}&currency=${
                settings.currency
            }`);
            const peaceIndex = await fetch(`http://${API_HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`);
            const importSources = await fetch(`http://${API_HOST}:${API_PORT}/arms/imports/by_country?country_code=${alpha2}&year=${year}&limit=${20}&currency=${
                settings.currency
            }`)
            const importTimeSeries = await fetch(`http://${API_HOST}:${API_PORT}/arms/imports/timeseries?country_code=${alpha2}&currency=${
                settings.currency
            }`)
            const totalExports = await fetch(`http://${API_HOST}:${API_PORT}/arms/exports/total?country_code=${alpha2}&year=${year}&currency=${
                settings.currency
            }`);
            const exportSources = await fetch(`http://${API_HOST}:${API_PORT}/arms/exports/by_country?country_code=${alpha2}&year=${year}&limit=${5}&currency=${
                settings.currency
            }`)
            const exportTimeSeries = await fetch(`http://${API_HOST}:${API_PORT}/arms/exports/timeseries?country_code=${alpha2}&currency=${
                settings.currency
            }`)
            const merchExports = await fetch(`http://${API_HOST}:${API_PORT}/merchandise/exports/total?country_code=${alpha2}&year=${year}&currency=${
                settings.currency
            }`)

            const nameData = await name.json();
            const democracyIndexData = await democracyIndex.json();
            const peaceIndexData = await peaceIndex.json();
            const totalImportsData = await totalImports.json();
            const importSourcesData = await importSources.json()
            const importTimeSeriesData = await importTimeSeries.json()
            const totalExportsData = await totalExports.json();
            const exportSourcesData = await exportSources.json()
            const exportTimeSeriesData = await exportTimeSeries.json()
            const merchExportData = await merchExports.json()

            // update object with new data
            setActiveCountryData({
                name: nameData,
                democracyIndex: democracyIndexData,
                peaceIndex: peaceIndexData,
                totalImports: totalImportsData,
                importSources: importSourcesData,
                importTimeSeries: importTimeSeriesData,
                totalExports: totalExportsData,
                exportSources: exportSourcesData,
                exportTimeSeries: exportTimeSeriesData,
                merchExports: merchExportData
            });


        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    }, [API_HOST, API_PORT, year, settings])

    // Effect to update country on year change only once the state has actually been updated
    useEffect(() => {
        updateActiveCountry(activeCountryAlpha2)
    }, [year, activeCountryAlpha2, updateActiveCountry])

    return (
        <div className="app"
            onClick={
                () => {
                    setShowSettings(false)
                }
        }>
            <style jsx="true" global="true">
                {`
        body {
          margin: 0px;
          padding: 0px;
        }
      `} </style>
            <div className='header'>
                <img className='logo' src="/favicon.png" alt="Taro"/>
                <div className='title'>Arms-Tracker</div>
                <button className='settings-button'
                    onClick={
                        (e) => {
                            e.stopPropagation();
                            setShowSettings(!showSettings)
                        }
                }>
                    <img className='settings-icon' src='/settings.png' alt="Settings"/>
                </button>
            </div>

            <div className='toggle'>
                <ToggleButton left={"Imports"}
                    right={"Exports"}
                    onToggleChange={toggleComponent}/>
            </div>

            {
            showSettings ? <Settings settings={settings}
                setSettings={setSettings}></Settings> : ''
        }

            {
            activeCountryAlpha2 === '' ? <div style={
                {
                    color: 'whitesmoke',
                    position: 'absolute',
                    top: '50%',
                    left: '40%'
                }
            }>(Click on Country for more Details)</div> : ''
        }
            <WorldMap mapModeImport={mapModeImport}
                className='map'
                year={year}
                activeCountryData={activeCountryData}
                updateActiveCountry={updateActiveCountry}
                settings={settings}
                API_HOST={API_HOST}
                API_PORT={API_PORT}
                />

            <div className='slider-container'>
                <YearSlider onYearChange={handleYearChange}></YearSlider>
            </div>

            <div className='footer'>
                <div className='column'>
                    <span><a className="footer-link" href='https://www.eiu.com/n/campaigns/democracy-index-2022/?utm_source=google&utm_medium=paid-search&utm_campaign=democracy-index-2022&gclid=CjwKCAjwscGjBhAXEiwAswQqNCehS0oTsWPWJxsIzvWrjv1LLuuN1smbXTqRXXEMllm3gkV0glNrYBoCg28QAvD_BwE'>Data Sources</a>
                    </span>
                    <span><a className="footer-link" href='https://www.visionofhumanity.org/'>Impressum/Disclaimer</a>
                    </span>
                </div>
                <div className='bar'/>
                <div className='column'>
                    <span>[1]<a className="footer-link" href='https://www.eiu.com/n/campaigns/democracy-index-2022/?utm_source=google&utm_medium=paid-search&utm_campaign=democracy-index-2022&gclid=CjwKCAjwscGjBhAXEiwAswQqNCehS0oTsWPWJxsIzvWrjv1LLuuN1smbXTqRXXEMllm3gkV0glNrYBoCg28QAvD_BwE'>Economist Intelligence Unit: Democracy Index Report 2022</a>
                    </span>
                    <span>[2]<a className="footer-link" href='https://www.visionofhumanity.org/'>Visions of Humanity: Global Peace Index</a>
                    </span>
                </div>
                <div className='bar'/>
                <div className='column'>
                    <a className="footer-link" href="https://www.flaticon.com/free-icons/settings" title="settings icons">Settings icons created by Freepik - Flaticon</a>
                    <a className="footer-link" href="https://www.flaticon.com/free-icons/info" title="info icons">Info icons created by Freepik - Flaticon</a>
                </div>
            </div>
        </div>
    );
};

export default App;
