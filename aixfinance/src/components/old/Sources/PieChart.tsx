import React, { useEffect, useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartProps {
  remaining: number;
  consumed: number;
  size?: number;
  name?: string;
  measureType?: string;
}

const COLORS = ['#d3d3d3', '#28a745'];

const PieChartComponent: React.FC<PieChartProps> = ({ remaining, consumed, size = 150, name, measureType }) => {
  
  const [data, setData] = useState<{ name: string, value: number }[]>([]);

  useEffect(() => {
    setData([
      { name: measureType === 'consumption' ? 'Consumido' : measureType === 'usage' ? 'Usado' : 'Rentabilidad', value: consumed },
      { name: measureType === 'consumption' ? 'Restante' : measureType === 'usage' ? 'Restante' : 'Rentabilidad', value: remaining },
    ]);
  }, [remaining, consumed]);

  return (
    <RechartsPieChart width={size} height={size}>
      <Pie
        data={data}
        cx="55%"
        cy="60%"
        innerRadius={size / 4}
        outerRadius={size / 2 - 10}
        fill="#8884d8"
        paddingAngle={1}
        dataKey="value"
        startAngle={89}
        endAngle={-270}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} align="left"/>
    </RechartsPieChart>
  );
};

export default PieChartComponent;
