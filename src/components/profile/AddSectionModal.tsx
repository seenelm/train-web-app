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

// --- Mock API call ---
// Replace this with your actual API call logic
const addCustomSection = async (data: CustomSectionRequest<any>): Promise<any> => {
  console.log('Sending data to backend:', data);
  // Example:
  // const response = await fetch('/api/profile/sections', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error('Network response was not ok');
  // }
  // return response.json();

  // For demonstration, we'll just simulate a successful response
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, data };
};
// --- End Mock API call ---


interface AddSectionModalProps {
  onClose: () => void;
}

const formatSectionTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase().replace('_', ' ');
};

const AddSectionModal: React.FC<AddSectionModalProps> = ({ onClose }) => {
//   const queryClient = useQueryClient();
    const sectionTypes = Object.values(CustomSectionType);
  const [selectedSection, setSelectedSection] = useState<CustomSectionType>(
    sectionTypes[0]
  );
  const [formData, setFormData] = useState<AchievementItem[] | GenericItem[]>([]);

//   const mutation = useMutation(addCustomSection, {
//     onSuccess: () => {
//       // Invalidate and refetch the profile data to show the new section
//       queryClient.invalidateQueries('userProfile');
//       onClose();
//     },
//     onError: (error) => {
//       // You can handle errors here, e.g., show a toast notification
//       console.error('Error saving section:', error);
//       alert('Failed to save section. Please try again.');
//     },
//   });

  const handleSave = () => {
    const requestData: CustomSectionRequest = {
      title: selectedSection,
      details: formData as any, // Cast because TS can't infer from the dynamic component
    };
    // mutation.mutate(requestData);
  };

  const handleFormChange = useCallback((data: AchievementItem[] | GenericItem[]) => {
    setFormData(data);
  }, []);

  const renderForm = () => {
    switch (selectedSection) {
      case CustomSectionType.ACHIEVEMENTS:
        return <AchievementForm onChange={handleFormChange} />;
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
            {sectionTypes.map((type) => (
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
          <button onClick={handleSave} className="save-btn">
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;