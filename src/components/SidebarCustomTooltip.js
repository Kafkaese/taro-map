import './SidebarCustomTooltip.css'

/**
 * Custom tooltip for the rechart components in the sidebar. Shows a different label than the one defined in the Rechart axis component.
 * 
 * @param {boolean} active Wether tooltip is active. From @Tooltip
 * @param {object} payload Daata for the œTooltip component. Includes the value and the label
 * @param {string} label Label as defined by the Rechart component. Determined by the data shown and used in the axis components of the 
 *      Chart. Differs from the one we want to show in the tooltip. 
 */
const SidebarCustomTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {
      return (
        <div className="sidebarCustomTooltip">
          <div style={{textDecorationLine: 'underline', fontWeight: 'bold'}} >{payload[0].payload.full_name}</div>
          <div>{`€ ${payload[0].value.toLocaleString('en')}`}</div>
        </div>
      );
    }
  
    return null;
  };

export default SidebarCustomTooltip;