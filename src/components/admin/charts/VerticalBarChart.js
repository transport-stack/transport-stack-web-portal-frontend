import React, { useEffect, useState } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Label,
} from "recharts";
import PropTypes from 'prop-types'

const VerticalBarChart = ({ data, xAxisName }) => {
  const [yAxisWidth, setYAxisWidth] = useState(0);

  // Function to measure text width
  const measureTextWidth = (text, fontSize = 12) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px Arial`;
    return context.measureText(text).width;
  };

  // Calculate the max label width
  const getMaxLabelWidth = (data, fontSize = 12) => {
    let maxWidth = 0;
    data.forEach((item) => {
      const width = measureTextWidth(item.name, fontSize);
      if (width > maxWidth) {
        maxWidth = width+5;
      }
    });
    return maxWidth;
  };

  useEffect(() => {
    const maxLabelWidth = getMaxLabelWidth(data, 12); // Adjust fontSize as needed
    setYAxisWidth(maxLabelWidth + 20); // Add padding for better visibility
  }, []);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        width={400}
        height={400}
        data={data}
        barSize={40}
        margin={{
          top: 30,
          right: 20,
          bottom: 10,
          left: 10,
        }}
      >
        <XAxis type="number">
          <Label value={xAxisName?.length>0 ? xAxisName:''} position="insideBottom" fill="#323232" dy={15} fontSize="14px" />
        </XAxis>
        <YAxis dataKey="name" type="category" width={yAxisWidth / 2} />
        <Tooltip />
        <Bar dataKey="UsersSubscribed" stackId="a" fill="#25A7FF" />
      </BarChart>
    </ResponsiveContainer>
  );
};

VerticalBarChart.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
  xAxisName: PropTypes.string,    // 'xAxisName' should be a string
};

export default VerticalBarChart;
