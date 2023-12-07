import React from "react";

const Impressum = () => {
    return (
        <div className="impressum">
            <h1 style={{textAlign: 'center'}}>Impressum</h1>
            <div style={{marginLeft: '100px', marginRight: '100px'}}>
                <p>Frederik Laubisch</p>
                <p>Allerstr. 43</p>
                <p>12049 Berlin</p>
                <p>Germany</p>
                <br/>
                <p>
                    <a style={{color: 'white'}} href="mailto:f.laubisch@posteo.de">f.laubisch@posteo.de</a>
                </p>
                <p>
                    <a style={{color: 'white'}} href="github.com/Kafkaese">github.com/Kafkaese</a>
                </p>
                <br/>
                <p>Responsible for the content in accordance with  §18 Abs. 2 MStV: Frederik Laubisch</p>
                <a style={{color: 'white'}} href="https://github.com/Kafkaese/taro">
                    <img style={{width:'20px', height: '20px', marginBottom: '-5px'}} src='https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png' alt=''></img>
                    arms-tracker on github
                </a>
            </div>
        </div>
    )
}

export default Impressum;