import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { SearchResult, CertificationSearchResult } from '../types/api.types';
import { FaSearch, FaUser, FaUsers, FaCertificate, FaTimes, FaChevronRight } from 'react-icons/fa';
import './styles/SearchInterface.css';

interface SearchInterfaceProps {
  onProfileSelect?: (profileId: string) => void;
  onGroupSelect?: (groupId: string) => void;
  onCertificationSelect?: (certificationId: string) => void;
}

type SearchType = 'profiles' | 'certifications' | 'all';

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onProfileSelect,
  onGroupSelect,
  onCertificationSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [profileResults, setProfileResults] = useState<SearchResult[]>([]);
  const [certificationResults, setCertificationResults] = useState<CertificationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const resultsPerPage = 10;

  // Perform search when query, type, or page changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProfileResults([]);
      setCertificationResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        if (searchType === 'profiles' || searchType === 'all') {
          const profileResponse = await searchService.searchProfilesAndGroups(
            searchQuery,
            currentPage,
            resultsPerPage
          );
          
          // Transform API response to SearchResult[] format
          const results: SearchResult[] = [
            ...profileResponse.profiles.map(profile => ({
              id: profile.id,
              name: profile.name,
              type: 'profile' as const,
              description: profile.bio,
              profilePicture: profile.profilePicture,
              tags: []
            })),
            ...profileResponse.groups.map(group => ({
              id: group.id,
              name: group.name,
              type: 'group' as const,
              description: group.description,
              groupPicture: group.groupPicture,
              tags: []
            }))
          ];
          
          setProfileResults(prevResults => 
            currentPage === 1 
              ? results 
              : [...prevResults, ...results]
          );
          
          setHasMore(profileResponse.pagination.hasNextPage);
        }

        if (searchType === 'certifications' || searchType === 'all') {
          const certResponse = await searchService.searchCertifications(
            searchQuery,
            currentPage,
            resultsPerPage
          );
          
          // Transform API response to CertificationSearchResult[] format
          const results: CertificationSearchResult[] = certResponse.certifications.map(cert => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.organization
          }));
          
          setCertificationResults(prevResults => 
            currentPage === 1 
              ? results 
              : [...prevResults, ...results]
          );
          
          if (searchType === 'certifications') {
            setHasMore(certResponse.pagination.hasNextPage);
          }
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const debounceTimeout = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, searchType, currentPage]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setProfileResults([]);
    setCertificationResults([]);
    setCurrentPage(1);
  };

  // Handle search type change
  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setCurrentPage(1); // Reset to first page on type change
  };

  // Load more results
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Determine if we should show profiles section
  const showProfiles = searchType === 'profiles' || searchType === 'all';
  
  // Determine if we should show certifications section
  const showCertifications = searchType === 'certifications' || searchType === 'all';

  // Handle result selection
  const handleResultSelect = (result: SearchResult | CertificationSearchResult) => {
    if ('type' in result) {
      // It's a SearchResult (profile or group)
      if (result.type === 'profile' && onProfileSelect) {
        onProfileSelect(result.id);
      } else if (result.type === 'group' && onGroupSelect) {
        onGroupSelect(result.id);
      }
    } else if (onCertificationSelect) {
      // It's a CertificationSearchResult
      onCertificationSelect(result.id);
    }
  };

  return (
    <div className="search-interface">
      <div className="search-header">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for profiles, groups, or certifications..."
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-button" onClick={handleClearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="search-type-filters">
          <button 
            className={`search-type-button ${searchType === 'all' ? 'active' : ''}`}
            onClick={() => handleSearchTypeChange('all')}
          >
            All
          </button>
          <button 
            className={`search-type-button ${searchType === 'profiles' ? 'active' : ''}`}
            onClick={() => handleSearchTypeChange('profiles')}
          >
            Profiles & Groups
          </button>
          <button 
            className={`search-type-button ${searchType === 'certifications' ? 'active' : ''}`}
            onClick={() => handleSearchTypeChange('certifications')}
          >
            Certifications
          </button>
        </div>
      </div>

      {error && <div className="search-error">{error}</div>}

      <div className="search-results">
        {loading && currentPage === 1 ? (
          <div className="search-loading">Searching...</div>
        ) : (
          <>
            {searchQuery && !loading && profileResults.length === 0 && certificationResults.length === 0 && (
              <div className="no-results">
                No results found for "{searchQuery}". Try a different search term.
              </div>
            )}

            {showProfiles && profileResults.length > 0 && (
              <div className="results-section">
                <h3 className="results-section-title">Profiles & Groups</h3>
                <div className="results-list">
                  {profileResults.map(result => (
                    <div 
                      key={result.id} 
                      className="result-item"
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="result-icon">
                        {result.type === 'profile' ? <FaUser /> : <FaUsers />}
                      </div>
                      <div className="result-content">
                        <h4 className="result-title">
                          {result.name}
                          {result.type === 'group' && (
                            <span className="result-type">Group</span>
                          )}
                        </h4>
                        {result.description && (
                          <p className="result-description">{result.description}</p>
                        )}
                        {result.tags && result.tags.length > 0 && (
                          <div className="result-tags">
                            {result.tags.map((tag: string, index: number) => (
                              <span key={index} className="result-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="result-action">
                        <FaChevronRight />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCertifications && certificationResults.length > 0 && (
              <div className="results-section">
                <h3 className="results-section-title">Certifications</h3>
                <div className="results-list">
                  {certificationResults.map(result => (
                    <div 
                      key={result.id} 
                      className="result-item"
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="result-icon">
                        <FaCertificate />
                      </div>
                      <div className="result-content">
                        <h4 className="result-title">{result.name}</h4>
                        {result.issuer && (
                          <p className="result-issuer">Issued by {result.issuer}</p>
                        )}
                        {result.description && (
                          <p className="result-description">{result.description}</p>
                        )}
                      </div>
                      <div className="result-action">
                        <FaChevronRight />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(loading && currentPage > 1) && (
              <div className="loading-more">Loading more results...</div>
            )}

            {hasMore && !loading && (
              <button className="load-more-button" onClick={handleLoadMore}>
                Load More Results
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;
