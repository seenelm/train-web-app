import React from 'react';
import SearchInterface from '../components/ui/SearchInterface';
import './Search.css';

const Search: React.FC = () => {
  return (
    <div className="search-page">
      <h1>Search</h1>
      <p className="search-description">
        Search for profiles, groups, and certifications across the platform.
      </p>
      <SearchInterface />
    </div>
  );
};

export default Search;
