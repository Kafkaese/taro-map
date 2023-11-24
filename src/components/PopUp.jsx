import React from 'react';
import './PopUp.css'
import Impressum from './Impressum';

const PopUp = (content, setShowPopUp) => {


    return (
        <div className='popup-container'>
            <div>{setShowPopUp.content}</div>
            <button style={{ position: 'absolute', top: '5px', right: '5px', color: 'white', backgroundColor: '#374151', border: 'none', borderRadius: '10px', textAlign: 'center' }} onClick={() => { content.setShowPopUp('None') }}>X</button>
            <div>
                {{
                    'impressum': <Impressum />,
                    'data': <Impressum className='impressum' />
                }[content.content]}
            </div>
        </div>
    )

}


export default PopUp;