import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PropTypes from 'prop-types'

const BarCharts = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        barGap={0}
        barSize={50}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 25,
        }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000", angle: -45, textAnchor: "end"}}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        />
        <Tooltip />
        {/* <Tooltip shared={false} trigger="click" /> */}
        <Legend
          wrapperStyle={{
            position: 'relative'
          }}
        />
        <Bar dataKey="Availed" fill="#25A7FF" />
        <Bar dataKey="Available" fill="#0175C2" />
      </BarChart>
    </ResponsiveContainer>
  );
};

BarCharts.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
};

export default BarCharts;
