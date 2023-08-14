import ReactCountryFlag from "react-country-flag";

/**
 * Custom tick for Rechart axis. Displays the flag of the country given in he payload as value.
 *  
 * 
 * @param {integer} x x-position of tick in chart
 * @param {integer} y y-position of tick in chart
 * @param {object} payload payload for the datat at the current tick. Needs to have field @value with countryCode as 2 character {string}
 */
const CustomizedTick = ({x, y, payload}) => {
    console.log(payload.value)
    return (
        <svg xmlns="http://www.w3.org/2000/svg">
            <foreignObject 
                x={x-20} 
                y={y-10} 
                width={'1.2em'}
                height={'1.2em'}
                >
                <ReactCountryFlag 
                    countryCode={payload.value} 
                    xmlns="http://www.w3.org/1999/xhtml"
                    svg 
                    style={{
                        width: '1.2em',
                        height: '1.2em',
                        }}

                        />
            </foreignObject>
        </svg>
    )
}

export default CustomizedTick;