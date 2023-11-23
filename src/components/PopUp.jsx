import React from 'react';
import './PopUp.css'
import Impressum from './Impressum';

const PopUp = (content, setShowPopUp) => {


return (
    <div className='popup-container'>
        <div>{setShowPopUp.content}</div>
        <button onClick={() => {content.setShowPopUp('None')}}>x</button>
        <div>
            {{
            'impressum': <Impressum/>,
            'data': <Impressum className='impressum'/>
            }[content.content]}
        </div>
    </div>
)
    
}


export default PopUp;