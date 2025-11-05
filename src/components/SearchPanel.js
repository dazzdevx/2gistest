import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SearchResult = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

export const SearchPanel = ({ apiKey, onDestinationSelect }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://catalog.api.2gis.com/3.0/items/search?q=${query}&key=${apiKey}`
      ).then(res => res.json());

      setResults(response.result.items || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        placeholder="Куда поедем?"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {results.length > 0 && (
        <SearchResults>
          {results.map(result => (
            <SearchResult
              key={result.id}
              onClick={() => {
                onDestinationSelect({
                  lng: result.point.lon,
                  lat: result.point.lat
                });
                setResults([]);
                setSearch(result.name);
              }}
            >
              {result.name}
            </SearchResult>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  );
};