import React, { useCallback, useEffect, useRef, useState } from "react";
import Form from 'react-bootstrap/Form';
import "../../assets/styles/searchbar.scss";
import { fetchSearchResultsAPI } from "../../services/apiservices";
import { Button, ListGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  //Custom debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    }
  };

  const fetchSearch = (searchQuery) => {
    const fetchSearchResults = async () => {
      return fetchSearchResultsAPI(searchQuery);
    };
    fetchSearchResults()
      .then((response) => {
        setLoading(false);
        if (response?.message !== 'No records found.') {
          setResults(response)
        } else {
          const message = [{
            id: 99999,
            name: response?.message,
            type: "NoRecords",
          }]
          setResults(message)
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  const debouncedSearch = useCallback(
    debounce((input) => {
      if (input.length >= 3) {
        fetchSearch(input);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 500), []
  );

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    debouncedSearch(inputValue);
  }

  const handleSearchItemClick = (result) => {
    setShowResults(false);
    setQuery(result?.name)
    if (result?.type?.toLowerCase() === 'dataset') {
      navigate('/data-services/datadetails/' + result?.id)
    } else if (result?.type?.toLowerCase() === 'serviceset') {
      navigate('/data-services/servicedetails/' + result?.id)
    } else {
      setQuery('');
    }
  }

  const handleClearClick = () => {
    setQuery('');
    setResults([]);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);

    }
  }, [searchRef]);

  useEffect(() => {
    setQuery("");
  }, [location]);
  return (
    <div className="search-bar" ref={searchRef}>
      <Form.Control type="text" placeholder="Search for products, services and more..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)} />
      {(query && showResults) ?
        <Button className="clear-icon" onClick={handleClearClick}> </Button> : <span className="search-icon"></span>
      }
      {showResults &&
        <ListGroup className="search-list-group">
          {results?.map((result) => (
            <ListGroup.Item key={result.name} className="search-list-item" onClick={() => handleSearchItemClick(result)}>{result.name}</ListGroup.Item>
          ))}
        </ListGroup>
      }

    </div>
  );
};

export default SearchBar;
