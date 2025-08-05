import React, { useState, useRef, useEffect } from "react";
import "./SelectComponent.scss";
import uniqid from "uniqid";

const SelectComponent = ({ options = [], label = "", className = "", onSelectChange }) => {
  const [shown, setShown] = useState(false);
  const [selected, setSelected] = useState('');
  const [focused, setFocused] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [searchText, setSearchText] = useState("");
  const listRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = uniqid("select-box-");

  const toggleShown = () => {
    setShown((s) => !s);
  };

  const handleKeypress = (e) => {
    e.persist();
    e.preventDefault();
    const isUpKey = e.key === "ArrowUp";
    const isDownKey = e.key === "ArrowDown";
    const isEnter = e.key === "Enter";
    const isTab = e.key === "Tab";
    const isEsc = e.key === "Escape";
    const currentIndex = options.findIndex(
      (option) => option.value === focused
    );

    if (currentIndex !== options.length - 1 && isDownKey) {
      setFocused(options[currentIndex + 1].value);
      return;
    }

    if (currentIndex !== 0 && isUpKey) {
      setFocused(options[currentIndex - 1].value);
      return;
    }

    if (isEnter) {
      setSelected(focused);
      setSearchText("");
      toggleShown();
      return;
    }

    if (isTab || isEsc) {
      toggleShown();
      return;
    }

    if (e.keyCode >= 65 && e.keyCode <= 90) {
      // its a letter
      const text = searchText + e.key;
      const matchedOptions = options.filter((option) =>
        option.label.toLowerCase().startsWith(text.toLowerCase())
      );
      if (matchedOptions.length) {
        setFocused(matchedOptions[0].value);
        setSearchText(text);
      }
    }

    setDirty(true);
  };

  const handleListItemSelect = (value) => (e) => {
    setSelected(value);
    setFocused(value);
    toggleShown();
    e.stopPropagation();
    setDirty(true);
  };

  const handleButtonKeypress = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      toggleShown();
      setDirty(true);
    } else {
      return;
    }
  };

  const handleButtonClick = () => {
    toggleShown();
    setDirty(true);
  };

  useEffect(() => {
    if (shown && dirty) {
      listRef.current.focus();
    } else {
      listRef.current.setAttribute("tab-index", "-1");
      if (dirty) {
        buttonRef.current.focus();
      }
    }

    const clickListener = (e) => {
      if (e.target !== listRef.current && e.target !== buttonRef.current) {
        toggleShown();
      }
    };

    if (shown) {
      window.addEventListener("click", clickListener);
    } else {
      window.removeEventListener("click", clickListener);
    }

    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [shown]);

  useEffect(() => {
    if (onSelectChange) {
      onSelectChange(selected);
    }
  }, [selected])

  const selectedItem = options.find((o) => o.value === selected);
  const selectedLabel = (selectedItem && selectedItem?.label) || "All";

  return (
    <div className={"select-box " + className}>
      {label && (
        <label
          className="select-box__label"
          id={`${listId}_label`}
          htmlFor={`${listId}_button`}
        >
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        className={`select-box__input ${shown ? "list-visible" : ""}`}
        onClick={handleButtonClick}
        onKeyDown={handleButtonKeypress}
        aria-haspopup="listbox"
        aria-labelledby={`${listId}_label ${listId}_button`}
        id={`${listId}_button`}
      >
        {selectedLabel}
      </button>
      <ul
        tabIndex="-1"
        className={`select-box__list ${shown ? "" : "hide"}`}
        ref={listRef}
        onKeyDown={handleKeypress}
        role="listbox"
        aria-labelledby={listId}
        aria-activedescendant={`${listId}_${focused}`}
      >
        {/* {options.length > 1 && */}
          <li
            tabIndex="-1"
            role="option"
            key="all"
            value=""
            className={`select-box__item
            ${selected === "" ? "is-selected" : ""}
            ${focused === "" ? "is-focused" : ""}
          `}
            onClick={handleListItemSelect("")}
            onKeyPress={handleListItemSelect("")}
            aria-label="All"
            id={`${listId}-default`}
          >
            All
          </li>
        {/* } */}
        {options.map((option, i) => (
          <li
            tabIndex="-1"
            role="option"
            key={option.value}
            value={option.value}
            className={`select-box__item
            ${selected === option.value ? "is-selected" : ""}
            ${focused === option.value ? "is-focused" : ""}
          `}
            onClick={handleListItemSelect(option.value)}
            onKeyPress={handleListItemSelect(option.value)}
            aria-label={option.label}
            id={`${listId}_${option.value}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectComponent;
