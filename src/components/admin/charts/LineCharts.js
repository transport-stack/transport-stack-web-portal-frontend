import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
  Text,
} from "recharts";
import PropTypes from 'prop-types'

const LineCharts = ({ data = [], yAxisName = '' }) => {

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 30,
        }}
      >
        <XAxis
          dataKey="name"
          padding={{ left: 10, right: 10 }}
          angle={-45}
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        // label={<CustomizedLabelA width={calculateLabelWidth()} />}
        ><Label fill="#323232"
          fontSize="14px" value="Tracking initiated from September" offset={-20} position="insideBottom" /></XAxis>
        <YAxis
          // label="Total # of Registrations"
          label={<CustomizedLabelB yAxisName={yAxisName} />}
          tickLine={false}
          axisLine={{ stroke: "#CACACA" }}
          tick={{ fill: "#000" }}
        >
          <Label position="left" />
        </YAxis>
        <Tooltip />
        {/* <Legend /> */}
        <Line
          type="linear"
          dataKey="count"
          stroke="#25A7FF"
          fill="#25A7FF"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomizedLabelB = ({ yAxisName }) => {
  return (
    <Text
      x={0}
      y={0}
      dx={-230}
      dy={25}
      textAnchor="start"
      width={280}
      transform="rotate(-90)"
      fill="#323232"
      fontSize="14px"

    >
      {yAxisName}
    </Text>
  );
};


const CustomizedLabelA = ({ width }) => {
  return (
    <Text
      dx={100}
      dy={290}
      textAnchor="start"
      fill="#323232"
      fontSize="14px"
      width={width}
    >
      Tracking initiated from September
    </Text>
  );
};


CustomizedLabelB.propTypes = {
  yAxisName: PropTypes.string.isRequired, // yAxisName must be a string and is required
};

LineCharts.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
  yAxisName: PropTypes.string,    // 'yAxisName' should be a string
};

export default LineCharts;
