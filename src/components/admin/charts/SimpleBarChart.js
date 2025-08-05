import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PropTypes from 'prop-types'

const SimpleBarChart = ({data}) => {
  const COLORS = ["#25A7FF", "#0175C2"];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <Bar barSize={50} dataKey="services" fill="#25A7FF">
          {data?.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Bar>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          itemStyle={{ color: '#000' }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

SimpleBarChart.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
};

export default SimpleBarChart;
