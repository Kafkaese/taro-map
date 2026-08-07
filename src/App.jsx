import React, {useState, useEffect, useCallback} from 'react';
import WorldMap from './components/WorldMap';
import YearSlider from './components/YearSlider';
import ToggleButton from './components/ToggleButton';
import Settings from './components/Settings';
import PopUp from './components/PopUp'
    
import './App.css'

/**
 * Main Application component. Renderd Header, Footer and Worldmap, plus contionally popups for Impressum, Data Sources and warning for mobile users.
 * 
 * 
 */
function App() { // API vars from env

    // Grab API varibles:
    // from env_config.js  if production/staging/testing
    // from process env    if development  
    
    const API_HOST = (window._env_ === undefined) ? process.env.REACT_APP_API_HOST : window._env_.REACT_APP_API_HOST
    const API_PORT = (window._env_ === undefined) ? process.env.REACT_APP_API_PORT : window._env_.REACT_APP_API_PORT

    

    // Check for mobile device to display warning message
    const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
    
    // Controls which map is shown
    const [mapModeImport, setMapModeImport] = useState(true);

    // PopUp controls
    const [showPopUp, setShowPopUp] = useState('none')
    const [showMobilePopUp, setShowMobilePopUp] = useState('true')
  
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

    // Tracks whether a country-data fetch is in flight, and the error message
    // if the last one failed - surfaced to the user instead of only logging.
    const [isCountryDataLoading, setIsCountryDataLoading] = useState(false);
    const [countryDataError, setCountryDataError] = useState(null);

    // Fetches data for country currently hovered over
    const updateActiveCountry = useCallback(async (alpha2) => {
        setIsCountryDataLoading(true);
        setCountryDataError(null);
        try {

            setActiveCountryAlpha2(alpha2)

            const fetchPromises = [
                fetch(`https://${API_HOST}:${API_PORT}/metadata/name/short?country_code=${alpha2}`),
                fetch(`https://${API_HOST}:${API_PORT}/metadata/democracy_index?country_code=${alpha2}&year=${year}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/imports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/metadata/peace_index?country_code=${alpha2}&year=${year}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/imports/by_country?country_code=${alpha2}&year=${year}&limit=${20}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/imports/timeseries?country_code=${alpha2}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/exports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/exports/by_country?country_code=${alpha2}&year=${year}&limit=${5}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/arms/exports/timeseries?country_code=${alpha2}&currency=${settings.currency.value}`),
                fetch(`https://${API_HOST}:${API_PORT}/merchandise/exports/total?country_code=${alpha2}&year=${year}&currency=${settings.currency.value}`)
            ];

            const responses = await Promise.all(fetchPromises);

            if (responses.some(response => !response.ok)) {
                throw new Error('One or more fetch requests failed');
            }

            const [
                nameData,
                democracyIndexData,
                totalImportsData,
                peaceIndexData,
                importSourcesData,
                importTimeSeriesData,
                totalExportsData,
                exportSourcesData,
                exportTimeSeriesData,
                merchExportData
            ] = await Promise.all(responses.map(response => response.json()));

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
            setCountryDataError('Could not load data for this country. Please try again.');
        } finally {
            setIsCountryDataLoading(false);
        }
    }, [API_HOST, API_PORT, year, settings])

    // Effect to update country on year change only once the state has actually been updated
    useEffect(() => {
        if (activeCountryAlpha2 === '') return;
        updateActiveCountry(activeCountryAlpha2)
    }, [year, activeCountryAlpha2, updateActiveCountry])

    
    // Render
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

            {isCountryDataLoading ? <div className="country-data-status">Loading country data…</div> : ''}
            {countryDataError ? <div className="country-data-status country-data-status--error">{countryDataError}</div> : ''}



            <WorldMap mapModeImport={mapModeImport}
                className='map'
                year={year}
                activeCountryData={activeCountryData}
                updateActiveCountry={updateActiveCountry}
                settings={settings}
                API_HOST={API_HOST}
                API_PORT={API_PORT}
                />

            {isMobile && showMobilePopUp === 'true' ? <PopUp content='mobile' setShowPopUp={setShowMobilePopUp}></PopUp> : ''}
            {showPopUp === 'none' ? '' : <PopUp content={showPopUp} setShowPopUp={setShowPopUp}></PopUp>}

            <div>
                <YearSlider onYearChange={handleYearChange}></YearSlider>
            </div>

            <div className='footer'>
                <div className='column'>
                    <span className="footer-link"><div onClick={() => {showPopUp==='data' ? setShowPopUp('none') : setShowPopUp('data')}}>Data Sources</div>
                    </span>
                    <span className="footer-link"><div  onClick={() => {showPopUp==='impressum' ? setShowPopUp('none') : setShowPopUp('impressum')}}>Impressum</div>
                    </span>
                </div>
                <div className='bar'/>
                <div className='column'>
                    <span className="footer-link">[1]<a href='https://www.eiu.com/n/campaigns/democracy-index-2022/?utm_source=google&utm_medium=paid-search&utm_campaign=democracy-index-2022&gclid=CjwKCAjwscGjBhAXEiwAswQqNCehS0oTsWPWJxsIzvWrjv1LLuuN1smbXTqRXXEMllm3gkV0glNrYBoCg28QAvD_BwE'>Economist Intelligence Unit: Democracy Index Report 2022</a>
                    </span>
                    <span className="footer-link">[2]<a href='https://www.visionofhumanity.org/resources/?type=research'>Visions of Humanity: Global Peace Index</a>
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
