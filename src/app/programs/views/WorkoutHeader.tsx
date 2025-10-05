// WorkoutView/components/WorkoutHeader.tsx
import React from 'react';


interface WorkoutHeaderProps {
  onBack: () => void;
  editMode: boolean;
  isOwner: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  saving: boolean;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  onBack,
  editMode,
  isOwner,
  onToggleEdit,
  onSave,
  hasUnsavedChanges,
  saving,
}) => {
  const handleDoneClick = () => {
    if (hasUnsavedChanges) {
      onSave();
    }
    onToggleEdit();
  };

  return (
    <div className="workout-header">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Week
      </button>

      <div className="header-actions">
        {hasUnsavedChanges && <span className="unsaved-indicator">Unsaved changes</span>}

        {isOwner && (
          <button className="edit-button" onClick={editMode ? handleDoneClick : onToggleEdit}>
            {editMode ? 'Done' : 'Edit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutHeader;
