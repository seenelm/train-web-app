import React, { useState, useEffect } from 'react';

import { useCertificationSearch } from './services/profileActions';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import './styles/certificationForm.css';

export interface CertificationResponse {
    id: string;
    name: string;
    issuer: string;
    imageURL: string;
    certType: string;
    specializations: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }

interface CertificationFormProps {
  onChange: (certifications: CertificationResponse[]) => void;
  initialCertifications?: CertificationResponse[];
}

const CertificationForm: React.FC<CertificationFormProps> = ({ 
  onChange, 
  initialCertifications = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<CertificationResponse[]>(initialCertifications);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch certifications from backend
  const {
    data: certData,
    isLoading,
    isError,
    error,
  } = useCertificationSearch({
    searchTerm: debouncedSearch,
    page: 1,
    pageSize: 20,
    enabled: debouncedSearch.trim().length >= 2,
  });

  // Update parent component when selected certifications change
  useEffect(() => {
    onChange(selectedCertifications);
  }, [selectedCertifications, onChange]);

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleSelectCertification = (certification: CertificationResponse) => {
    // Check if already selected
    const isAlreadySelected = selectedCertifications.some(
      cert => cert.id === certification.id
    );
    
    if (!isAlreadySelected) {
      setSelectedCertifications([...selectedCertifications, certification]);
    }
    
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleRemoveCertification = (certificationId: string) => {
    setSelectedCertifications(
      selectedCertifications.filter(cert => cert.id !== certificationId)
    );
  };

  const renderSearchResults = () => {
    if (!showSearchResults || !debouncedSearch) return null;

    if (isLoading) {
      return (
        <div className="search-results">
          <div className="search-result-item">Loading...</div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="search-results">
          <div className="search-result-item error">
            Error: {error instanceof Error ? error.message : 'Failed to load certifications'}
          </div>
        </div>
      );
    }

    if (!certData || certData.data.length === 0) {
      return (
        <div className="search-results">
          <div className="search-result-item">No certifications found</div>
        </div>
      );
    }

    return (
      <div className="search-results">
        {certData.data.map((certification) => {
          const isSelected = selectedCertifications.some(
            cert => cert.id === certification.id
          );
          
          return (
            <div
              key={certification.id}
              className={`search-result-item ${isSelected ? 'selected' : ''}`}
              onClick={() => !isSelected && handleSelectCertification(certification)}
            >
              <div className="cert-search-item">
                <div className="cert-search-image">
                  <img src={certification.imageURL} alt={certification.name} />
                </div>
                <div className="cert-search-details">
                  <h4>{certification.name}</h4>
                  <p>{certification.issuer}</p>
                  <div className="cert-search-specializations">
                    {certification.specializations.map((spec, index) => (
                      <span key={index} className="specialization-tag">{spec}</span>
                    ))}
                  </div>
                </div>
                {isSelected && <FaPlus className="selected-icon" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="certification-form">
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="search-input"
          />
        </div>
        {renderSearchResults()}
      </div>

      <div className="selected-certifications">
        <h3>Selected Certifications ({selectedCertifications.length})</h3>
        {selectedCertifications.length === 0 ? (
          <p className="no-certifications">No certifications selected yet. Search above to add some!</p>
        ) : (
          <div className="selected-certs-list">
            {selectedCertifications.map((certification) => (
              <div key={certification.id} className="selected-cert-item">
                <div className="selected-cert-image">
                  <img src={certification.imageURL} alt={certification.name} />
                </div>
                <div className="selected-cert-details">
                  <h4>{certification.name}</h4>
                  <p>{certification.issuer}</p>
                  <div className="selected-cert-specializations">
                    {certification.specializations.map((spec, index) => (
                      <span key={index} className="specialization-tag">{spec}</span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCertification(certification.id)}
                  className="remove-cert-btn"
                  aria-label="Remove certification"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationForm;