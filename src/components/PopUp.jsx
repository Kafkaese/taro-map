import React from 'react';
import './PopUp.css'
import Impressum from './Impressum';
import DataSources from './DataSources';

const PopUp = (content, setShowPopUp) => {


    return (
        <div className='popup-container'>
            <div>{setShowPopUp.content}</div>
            <button style={{ position: 'absolute', top: '5px', right: '5px', color: 'white', backgroundColor: '#374151', border: 'none', borderRadius: '10px', textAlign: 'center' }} onClick={() => { content.setShowPopUp('none') }}>X</button>
            <div>
                {{
                    'impressum': <Impressum />,
                    'data': <DataSources />
                }[content.content]}
            </div>
        </div>
    )

}


export default PopUp;