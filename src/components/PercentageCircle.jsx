import React from 'react';
import { PieChart, Pie, Label} from 'recharts';


const PercentageCircle = ({percentage}) => {

    const translateAngle = (value) => {

        return (value/100) * -360 +90;

      }

    return (
        <PieChart width={70} height={70}>
                {/* background circle full (100%)*/}
                <Pie
                dataKey="value"
                isAnimationActive={false}
                startAngle={90}
                endAngle={-270}
                data={[{value: 1}]}
                cx="50%"
                cy="50%"
                innerRadius={"60%"}
                outerRadius={"100%"}
                fill="var(--deck-chip)"
                />
                {/* colored circle based on percenag*/}
                <Pie
                dataKey="value"
                isAnimationActive={false}
                startAngle={90}
                endAngle={Number.isFinite(percentage) ? translateAngle(percentage) : 90}
                data={[{value: 1}]}
                cx="50%"
                cy="50%"
                innerRadius={"60%"}
                outerRadius={"100%"}
                fill="#06d3fc"
                >
                {/* Label at center of circle*/}
                <Label
                    position="center"
                    fill="var(--deck-text)"
                    style={{ fontWeight: 800, fontSize: '13px' }}
                    >
                    {!Number.isNaN(percentage) && Number.isFinite(percentage) ? (Math.round(percentage) > 0 ?`${Math.round(percentage)}%` : "<1%") : "?%"}
                    </Label>
                </Pie>

                </PieChart>
    )
};

export default PercentageCircle;
