import React, {useState, useEffect, useCallback, useRef} from 'react';
import WorldMap from './components/WorldMap';
import YearSlider from './components/YearSlider';
import ToggleButton from './components/ToggleButton';
import Settings from './components/Settings';
import PopUp from './components/PopUp'
import {
    fetchCountryName,
    fetchDemocracyIndex,
    fetchPeaceIndex,
    fetchTotalImports,
    fetchImportSources,
    fetchImportTimeSeries,
    fetchTotalExports,
    fetchExportSources,
    fetchExportTimeSeries,
    fetchConflictsByCountry
} from './api'

import './App.css'

/**
 * Main Application component. Renderd Header, Footer and Worldmap, plus contionally popups for Impressum and Data Sources.
 *
 *
 */
function App() {

    // Touch devices don't have reliable hover, so the map's hover tooltip
    // is suppressed on them (see WorldMap's isMobile prop) rather than
    // attempted and left glitchy.
    const isMobile = Boolean('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

    // Controls which map is shown
    const [mapModeImport, setMapModeImport] = useState(true);

    // PopUp controls
    const [showPopUp, setShowPopUp] = useState('none')

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

    // Color mode: 'light' | 'dark' | 'system', persisted across visits.
    // Applying it is a plain DOM attribute rather than component state that
    // components read - the light/dark split lives entirely in App.css's
    // custom properties, keyed off data-theme on <html> (see the effect
    // below) or, for 'system', the @media (prefers-color-scheme) rules
    // there when no explicit override is set at all.
    const [colorMode, setColorMode] = useState(() => localStorage.getItem('colorMode') || 'system');

    useEffect(() => {
        if (colorMode === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', colorMode);
        }
        localStorage.setItem('colorMode', colorMode);
    }, [colorMode]);


    // Data for sidebar
    const [activeCountryData, setActiveCountryData] = useState({});

    // Needs to be tracked here for updating activeCountryData on year change
    const [activeCountryAlpha2, setActiveCountryAlpha2] = useState('')

    // Drives the "(Click on Country for more Details)" hint - hidden as
    // soon as the user clicks anywhere on the map, not just once they've
    // actually selected a country (a click on open ocean still counts).
    const [hasInteractedWithMap, setHasInteractedWithMap] = useState(false)

    // Tracks whether a country-data fetch is in flight, and the error message
    // if the last one failed - surfaced to the user instead of only logging.
    const [isCountryDataLoading, setIsCountryDataLoading] = useState(false);
    const [countryDataError, setCountryDataError] = useState(null);

    // Tracks the in-flight request so a new selection can cancel a slower,
    // now-stale one instead of letting it resolve later and overwrite
    // newer data.
    const countryDataAbortControllerRef = useRef(null);

    // Fetches data for the given country. Only called from the effect below,
    // which re-runs whenever the selected country or the year/settings
    // change - callers elsewhere should just call setActiveCountryAlpha2 to
    // select a country, not fetch data directly (see the double-invocation
    // bug this replaced: calling this directly *and* relying on the effect
    // fired the whole fetch batch twice per click).
    const fetchCountryData = useCallback(async (alpha2) => {
        countryDataAbortControllerRef.current?.abort();
        const controller = new AbortController();
        countryDataAbortControllerRef.current = controller;
        const { signal } = controller;

        setIsCountryDataLoading(true);
        setCountryDataError(null);
        try {
            const currency = settings.currency.value;

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
                conflictsData
            ] = await Promise.all([
                fetchCountryName(alpha2, signal),
                fetchDemocracyIndex(alpha2, year, signal),
                fetchTotalImports(alpha2, year, currency, signal),
                fetchPeaceIndex(alpha2, year, signal),
                fetchImportSources(alpha2, year, currency, undefined, signal),
                fetchImportTimeSeries(alpha2, currency, signal),
                fetchTotalExports(alpha2, year, currency, signal),
                fetchExportSources(alpha2, year, currency, undefined, signal),
                fetchExportTimeSeries(alpha2, currency, signal),
                fetchConflictsByCountry(alpha2, signal)
            ]);

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
                conflicts: conflictsData
            });


        } catch (error) {
            if (error.name === 'AbortError') return; // superseded by a newer selection, not a real failure
            console.error('Error fetching country data:', error);
            setCountryDataError('Could not load data for this country. Please try again.');
        } finally {
            // Only the still-current request should touch loading state -
            // otherwise a superseded request's finally could clear it while
            // the newer request is still legitimately in flight.
            if (countryDataAbortControllerRef.current === controller) {
                setIsCountryDataLoading(false);
            }
        }
    }, [year, settings])

    // Fetches data whenever the selected country changes, or when
    // fetchCountryData itself changes identity (i.e. year or settings
    // changed) - the sole trigger for country-data fetches.
    useEffect(() => {
        if (activeCountryAlpha2 === '') return;
        fetchCountryData(activeCountryAlpha2)
    }, [activeCountryAlpha2, fetchCountryData])

    // Clears the selected country entirely - the sidebar only renders while
    // activeCountryData has a name, so this is what actually makes it
    // disappear (as opposed to the old collapse, which just visually
    // shrank it while still holding the last country's data).
    const deselectCountry = () => {
        setActiveCountryAlpha2('');
        setActiveCountryData({});
    }


    // Render
    return (
        <div className="app"
            onClick={
                () => {
                    setShowSettings(false)
                }
        }>
            <div className='header'>
                <img className='logo' src="/favicon.png" alt="Taro"/>
                <div className='title'>Arms-Tracker</div>
                <div className='toggle'>
                    <ToggleButton left={"Imports"}
                        right={"Exports"}
                        onToggleChange={toggleComponent}/>
                </div>
                <button className='settings-button'
                    aria-label="Settings"
                    onClick={
                        (e) => {
                            e.stopPropagation();
                            setShowSettings(!showSettings)
                        }
                }>
                    <img className='settings-icon' src='/settings.png' alt=""/>
                </button>
            </div>

            {
            showSettings ? <Settings settings={settings}
                setSettings={setSettings}
                colorMode={colorMode}
                setColorMode={setColorMode}></Settings> : ''
            }

            {
            !hasInteractedWithMap ? <div style={
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
                onCountrySelect={setActiveCountryAlpha2}
                onCountryDeselect={deselectCountry}
                onMapClick={() => setHasInteractedWithMap(true)}
                settings={settings}
                isMobile={isMobile}
                />

            {showPopUp === 'none' ? '' : <PopUp content={showPopUp} setShowPopUp={setShowPopUp}></PopUp>}

            <div>
                <YearSlider onYearChange={handleYearChange}></YearSlider>
            </div>

            <div className='footer'>
                <div className='column'>
                    <span className="footer-link"><button type="button" onClick={() => {showPopUp==='data' ? setShowPopUp('none') : setShowPopUp('data')}}>Data Sources</button>
                    </span>
                    <span className="footer-link"><button type="button" onClick={() => {showPopUp==='impressum' ? setShowPopUp('none') : setShowPopUp('impressum')}}>Impressum</button>
                    </span>
                </div>
                <div className='bar'/>
                <div className='column'>
                    <span className="footer-link">[1]<a href='https://www.eiu.com/n/campaigns/democracy-index-2022/'>Economist Intelligence Unit: Democracy Index Report 2022</a>
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
