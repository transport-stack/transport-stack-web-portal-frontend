import React, { useState } from "react";
import ButtonComponent from "../button/ButtonComponent";

const TableSearch = ({ placeholder, setSearchValue }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSearch = () => {
    setSearchValue(inputValue)
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchValue(inputValue);
    }
  }
  return (
    <div className="table-search">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <ButtonComponent type="primaryBlue" onClick={() => handleSearch()}>
        Search
      </ButtonComponent>
    </div>
  );
};

export default TableSearch;
