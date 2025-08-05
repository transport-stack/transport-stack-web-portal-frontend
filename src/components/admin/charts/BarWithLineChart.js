import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Text,
} from "recharts";
import PropTypes from 'prop-types'

const BarWithLineChart = ({ data }) => {
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tickFormatter={(tick) => tick.length > 8 ? `${tick.slice(0, 8)}...` : tick}
          tick={{ fill: "#000" }}
          interval={0}
        />
        <Tooltip />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
          label={<CustomizedLabelB />}
        />
        <Tooltip />
        <Bar dataKey="tickets" barSize={70} fill="#0175C2" />
        <Line
          type="linear"
          dataKey="resolved"
          stroke="#32AEAF"
          strokeWidth={2}
          dot={false}
        >
          <LabelList
            dataKey="resolved"
            position="bottom"
            fill="#fff"
            offset={10}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const CustomizedLabelB = () => {
  return (
    <Text
      x={0}
      y={0}
      dx={-200}
      dy={30}
      textAnchor="start"
      width={180}
      transform="rotate(-90)"
      fill="#323232"
      fontSize="14px"
    >
      Total Support Tickets​
    </Text>
  );
};

BarWithLineChart.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
};

export default BarWithLineChart;
