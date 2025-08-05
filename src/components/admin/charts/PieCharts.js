import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import PropTypes from 'prop-types'

const PieCharts = ({data}) => {
  const COLORS = ["#32AEAF", "#0175C2", "#25A7FF", "#6E6F73", "#78C6D0", "#7DF9FF"];
  return (
    <div className="d-flex justify-content-center">
      <PieChart width={340} height={300}>
        <Pie
          dataKey="value"
          labelLine={false}
          data={data}
          cx={150}
          cy={50}
          outerRadius={120}
        >
          {data?.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={COLORS[index % COLORS.length]}
              stroke={COLORS[index % COLORS.length]}
              style={{ outline: "none" }}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          align="center"
          style={{ fontSize: "14px" }}
        />
      </PieChart>
    </div>
  );
};

PieCharts.propTypes = {
  data: PropTypes.array,         // 'data' should be an array
};

export default PieCharts;
