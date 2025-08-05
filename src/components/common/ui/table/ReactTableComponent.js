import React, { useEffect, useRef, useState } from "react";
import { useTable, usePagination } from "react-table";
import "./TableComponent.scss";
import Pagination from "../pagination/Pagination";
import ArrowUp from "../../../../assets/images/select_up_arrow.png";
import ArrowDown from "../../../../assets/images/select_down_arrow.png";

const ReactTableComponent = ({
  columns,
  data,
  totalPages,
  currentPage,
  setCurrentPage,
  setSortingId,
  setSortingOrder,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
    },
    usePagination
  );

  const setSorting = (colData, index) => {
    let filterHeader = columns;
    filterHeader.forEach((element, i) => {
      if (element?.sortKey && i !== index) element.sortKey = "Inactive";
    });
    if (filterHeader[index].sortKey === "Active") {
      filterHeader[index].sortKey = "Inactive";
      setSortingOrder("desc");
    } else {
      filterHeader[index].sortKey = "Active";
      setSortingOrder("asc");
    }
    setSortingId(colData.id);
  };

  return (
    <div>
      <div className="table_component">
      <table {...getTableProps()} className="customTable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th {...column.getHeaderProps()}>
                  <span className="header_name">
                    <span>{column.render("Header")}</span>
                    <span
                      onClick={() => {
                        setSorting(column, index);
                      }}
                    >
                      {column?.sortKey === "Active" ? (
                        <img
                          src={ArrowUp}
                          alt="up arrow"
                          className="header_images"
                        />
                      ) : null}
                      {column?.sortKey === "Inactive" ? (
                        <img
                          src={ArrowDown}
                          alt="down arrow"
                          className="header_images"
                        />
                      ) : null}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{typeof cell.value === 'boolean' ? (cell.value?'Yes':'No') : ((cell.value || cell.column.Header==="Action")?cell.render("Cell"):<span id="empty_value">-</span>)}</td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td className="noData" colSpan={headerGroups[0].headers.length}>
                No Data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ReactTableComponent;
