import React, { useEffect, useRef, useState } from 'react'
import './CustomSelect.scss'
const CustomSelect = ({ options, placeholder, onSelectChange, disabled = false, defaultValue = '+91' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    //Toggle the dropdown
    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
            if (!isOpen) {
                setSearchTerm("")
            }
        }
    }

    //Handle select option
    const handleSelect = (value) => {
        if (disabled) return
        setSelectedValue(value);
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
    }

    //Handle keyboard event
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) =>
                Math.min(prev + 1, filteredOptions.length - 1)
            )
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) =>
                Math.max(prev - 1, 0)
            )
        } else if (e.key === "Enter" || e.key === " ") {
            if (isOpen && focusedIndex !== -1) {
                e.preventDefault();
                handleSelect(filteredOptions[focusedIndex].value2);
            } else {
                toggleDropdown();
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (onSelectChange) {
            onSelectChange(selectedValue);
        }
    }, [selectedValue])


    useEffect(() => {
        if (searchTerm === "") {
            setFilteredOptions(options);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            setFilteredOptions(
                options.filter((option) =>
                    option.label.toLowerCase().includes(lowercasedSearchTerm)))
        }
    }, [searchTerm, options]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.addEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div className={`custom-select ${isOpen ? 'is-open' : ''} ${disabled ? "disabled" : ""}`}
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}>
            <div
                className="custom-select__selected"
                onClick={toggleDropdown}
                role="buton"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedValue || placeholder}
                {/* <span>{isOpen ? "" : ""}</span> */}
            </div>

            {isOpen && (
                <div className='custom-select__dropdown'>
                    <input
                        type="text"
                        className='custom-select__search'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />

                    <div
                        className='custom-select__options'
                        role="listbox"
                        aria-activedescendant={focusedIndex !== -1 ? `option-${focusedIndex}` : undefined}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option.value}
                                    className={`custom-select__option${focusedIndex === index ? " focused" : ""} ${disabled ? "disabled" : ""}`}
                                    role='option'
                                    tabIndex={-1}
                                    aria-selected={selectedValue === option.value}
                                    aria-disabled={disabled}
                                    onClick={() => handleSelect(option.value2)}
                                    onMouseEnter={() => setFocusedIndex(index)}>
                                    {option.label + ' ' + option.value2}
                                </div>
                            ))
                        ) : (
                            <div className='custom-select__no-options'>No options found</div>
                        )
                        }
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default CustomSelect
