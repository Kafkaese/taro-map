import React, { useState } from 'react';
import { PieChart, Pie, Label} from 'recharts';


const PercentageCircle = ({percentage}) => {

    const translateAngle = (value) => {
        return (value/100) * -360 +90;
      }

    return (
        <PieChart width={70} height={70}>
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
                fill="#808080"
                />
                <Pie
                dataKey="value"
                isAnimationActive={false}
                startAngle={90}
                endAngle={translateAngle(percentage)}
                data={[{value: 1}]}
                cx="50%"
                cy="50%"
                innerRadius={"60%"}
                outerRadius={"100%"}
                fill="#8884d8"
                >
                <Label 
                    position="center"
                    >
                    {`${Math.round(percentage)}%`}
                    </Label>
                </Pie>

                </PieChart>
    )
};

export default PercentageCircle;
