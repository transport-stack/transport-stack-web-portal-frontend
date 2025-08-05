import React from "react";
import { Table } from "react-bootstrap";
import "./TableComponent.scss";
const TableComponent = ({ data = [], actions }) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Table className="customTable">
      <thead className="customThead">
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>{row[column]}</td>
            ))}
            <td className="d-flex"></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;
