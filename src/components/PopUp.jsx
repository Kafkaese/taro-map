import React from 'react';
import './PopUp.css'
import Impressum from './Impressum';
import DataSources from './DataSources';
import Attributions from './Attributions';

/**
 * Renders PopUp at center of screen to be filled with content.
 *
 * @param {string} content Type of content to be displayed. ust be one of [impressum, data, attributions]
 * @param {function} setShowPopUp Function that controlled wether the popup is enabled. Passed from App.
 *
 */
const PopUp = ({ content, setShowPopUp }) => {

    let boxWidth = '500px'
    let boxLeftMargin = '-250px'

    if (content === 'data') {boxWidth = '1000px'; boxLeftMargin = '-500px'}

    return (
        <div className='popup-container' style={{width: boxWidth, marginLeft: boxLeftMargin}}>
            <button aria-label="Close" style={{ position: 'absolute', top: '5px', right: '5px', color: 'var(--deck-text, #ffffff)', backgroundColor: 'var(--deck-chip, #1c2536)', border: 'none', borderRadius: '10px', textAlign: 'center' }} onClick={() => { setShowPopUp('none') }}>X</button>
            <div>
                {{
                    'impressum': <Impressum />,
                    'data': <DataSources />,
                    'attributions': <Attributions />
                }[content]}
            </div>
        </div>
    )

}


export default PopUp;