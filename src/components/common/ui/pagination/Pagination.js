import React from "react";
import "./Pagination.scss";
import DoubleArrowLeft from "../../../../assets/images/double-arrow-left.svg";
import DoubleArrowRight from "../../../../assets/images/double-arrow-right.svg";
import ArrowLeft from "../../../../assets/images/arrow-left.svg";
import ArrowRight from "../../../../assets/images/arrow-right.svg";
const Pagination = ({ totalPages = 1, currentPage = 1, setCurrentPage, className='' }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
    let endPage = startPage + maxPageNumbers - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
          className={`pageButton ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      {(totalPages > 1) && (<div className={"pagination "+className}>
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={`pageButtonLeft`}
        >
          <img src={DoubleArrowLeft} alt="double arrow left" />
        </button>
        <button
          onClick={() => handlePrevPage()}
          disabled={currentPage === 1}
          className={`pageButtonLeft`}
        >
          <img src={ArrowLeft} alt="arrow left" />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handleNextPage()}
          disabled={currentPage === totalPages}
          className={`pageButtonRight`}
        >
          <img src={ArrowRight} alt="arrow right" />
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={`pageButtonRight`}
        >
          <img src={DoubleArrowRight} alt="double arrow right" />
        </button>
      </div>)}
    </>
  );
};

export default Pagination;
