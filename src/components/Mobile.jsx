import React from "react";

const Mobile = (setShowPopUp) => {

    return (
        <div style={{color: 'white', marginLeft: '50px', marginRight: '50px',textAlign: 'center'}}>
            <h1><text style={{color: 'red'}}>!</text> Mobile Device Detected <text style={{color: 'red'}}>!</text></h1>
            <p>We detected a mobile device being used.</p> 
            <p>Currently the application is not optimized for 
            mobile deviced, and will not work properly or not at all. 
            </p>
            <p>It is therefore recommended that you use a laptop/desktop computer. </p>
            <p>Should this message show up erroneously, or you want to use the app on your mobile device anyways, just ignore and close this message.</p>
            <button onClick={() => { setShowPopUp.setShowPopUp('none') }} style={{backgroundColor:'#242e41', borderColor: 'white', color: 'white', borderRadius: '5px'}}>I understand / Close</button>
        </div>
    )
}

export default Mobile;