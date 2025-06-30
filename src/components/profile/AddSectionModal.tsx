import React, { useState, useCallback } from 'react';
import {
  CustomSectionType,
  CustomSectionRequest,
  AchievementItem,
  GenericItem,
} from '@seenelm/train-core';
import './styles/addSectionModal.css';
import AchievementForm from './AchievementForm';
import GenericSectionForm from './GenericSectionForm';
import CertificationForm, { CertificationResponse } from './CertificationForm';
import { useAddCustomSection } from './services/profileActions';

// // --- Mock API call ---
// // Replace this with your actual API call logic
// const addCustomSection = async (data: CustomSectionRequest<any>): Promise<any> => {
//   console.log('Sending data to backend:', data);

//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return { success: true, data };
// };
// // --- End Mock API call ---


interface AddSectionModalProps {
  onClose: () => void;
}

const formatSectionTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase().replace('_', ' ');
};

type SectionType = CustomSectionType | 'CERTIFICATIONS';

const AddSectionModal: React.FC<AddSectionModalProps> = ({ onClose }) => {
//   const queryClient = useQueryClient();
    const sectionTypes = Object.values(CustomSectionType);
    const allSectionTypes: SectionType[] = [...sectionTypes, 'CERTIFICATIONS'];

    const [selectedSection, setSelectedSection] = useState<SectionType>(
      allSectionTypes[0]
    );
  const [formData, setFormData] = useState<AchievementItem[] | GenericItem[] | CertificationResponse[]>([]);

    const mutation = useAddCustomSection();

  const handleSave = () => {
    // Validate that we have at least one item with data
    if (!formData.length) {
      alert('Please add at least one item to the section');
      return;
    }

    // Validate that required fields are filled
    const hasEmptyRequiredFields = formData.some(item => {
      if (selectedSection === CustomSectionType.ACHIEVEMENTS) {
        // For achievements, title is required
        // return !item.title;
      }
      // For other section types, check if the item has at least one non-empty property
      return Object.values(item).every(value => !value);
    });

    if (hasEmptyRequiredFields) {
      alert('Please fill in all required fields');
      return;
    }

    // Clean the data to ensure it only contains valid types (string, number, boolean, null)
    const cleanedDetails = formData.map(item => {
      const cleanedItem: Record<string, string | number | boolean | null> = {};
      
      // Process each property in the item
      Object.entries(item).forEach(([key, value]) => {
        // Only include properties with primitive values
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
          cleanedItem[key] = value;
        } else if (value === undefined) {
          cleanedItem[key] = null;
        }
      });
      
      return cleanedItem;
    });

    const requestData: CustomSectionRequest = {
      title: selectedSection as CustomSectionType,
      details: cleanedDetails,
    };
    
    console.log('Sending request data:', requestData);
    mutation.mutate(requestData);
  };

  const handleFormChange = useCallback((data: AchievementItem[] | GenericItem[] | CertificationResponse[]) => {
    setFormData(data);
  }, []);

  const renderForm = () => {
    switch (selectedSection) {
      case CustomSectionType.ACHIEVEMENTS:
        return <AchievementForm onChange={handleFormChange} />;
      case 'CERTIFICATIONS':
        return <CertificationForm onChange={handleFormChange} />;
      default:
        return <GenericSectionForm onChange={handleFormChange} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a Section</h2>
          <p>Select a section type and add your content.</p>
        </div>
        <div className="modal-body">
          <aside className="sections-list">
             <h3 className="section-list-title">All Sections</h3>
            {allSectionTypes.map((type) => (
              <div
                key={type}
                className={`section-list-item ${selectedSection === type ? 'active' : ''}`}
                onClick={() => setSelectedSection(type)}
              >
                {formatSectionTitle(type)}
              </div>
            ))}
          </aside>
          <main className="section-form-container">
            {renderForm()}
          </main>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;