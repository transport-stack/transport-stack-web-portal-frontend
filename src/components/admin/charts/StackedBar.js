import React, { useEffect, useState } from "react";
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

const StackedBar = ({ data }) => {
  const [barData, setBarData] = useState([]);
  const [colors] = useState([
    "#25A7FF",
    "#0175C2",
    "#32AEAF",
    "#6E6F73",
    "#6E6F83",
    "#6E6E73",
  ]);
  useEffect(() => {
    let barList = [];
    if (data.length > 0) {
      Object?.keys(data[0]).forEach((key, index) => {
        if (index > 0) {
          let obj = {
            name: key,
            color: colors[index - 1],
          };
          barList.push(obj);
        }
      });
    }
    setBarData(barList);
  }, [data,colors]);

  const CustomTick = ({ x, y, payload }) => {
    const text = payload.value.length > 8 ? `${payload.value.slice(0, 8)}...` : payload.value;
    return (
      <text
        x={x}
        y={y}
        fill="#000"
        fontSize={11}
        textAnchor="middle"
        dy={16}
      >
        {text}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        barSize={70}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom:20
        }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={<CustomTick />}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        />
        <Tooltip />
        <Legend />
        {barData.map((item) => {
          return <Bar key={item.name} dataKey={item.name} stackId="a" fill={item.color} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

StackedBar.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
};

export default StackedBar;
