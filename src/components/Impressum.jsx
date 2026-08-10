import React from "react";
import './Impressum.css';

const Impressum = () => {
    return (
        <div className="impressum">
            <h1>Impressum</h1>
            <div className="content">
                <p>Frederik Laubisch</p>
                <p>Germany</p>
                <br/>
                <p>
                    <a href="mailto:f.laubisch@posteo.de">f.laubisch@posteo.de</a>
                </p>
                <p>
                    <a href="https://github.com/Kafkaese">github.com/Kafkaese</a>
                </p>
                <br/>
                <p>Responsible for the content in accordance with  §18 Abs. 2 MStV: Frederik Laubisch</p>
                <a href="https://github.com/Kafkaese/taro">
                    <img className="github-icon" src='/github-mark.png' alt=''></img>
                    arms-tracker on github
                </a>
            </div>
        </div>
    )
}

export default Impressum;
