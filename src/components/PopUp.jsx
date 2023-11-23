import React from 'react';
import './PopUp.css'
import Impressum from './Impressum';

const PopUp = (content) => {


return (
    <div className='popup-container'>
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