import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import Button from '../ui/Button';

interface ProfileHeaderProps {
  name?: string;
  title?: string;
  imageUrl: string;
  showVerifiedBadge?: boolean;
  onMessageClick?: () => void;
  onFollowClick?: () => void;
  onTitleChange?: (newTitle: string) => void;
  onNameChange?: (newName: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  imageUrl,
  showVerifiedBadge = false,
  onMessageClick,
  onFollowClick,
  onTitleChange,
  onNameChange
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title || '');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name || '');
  
  // Title editing handlers
  const handleEditTitleClick = () => {
    setIsEditingTitle(true);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  
  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (onTitleChange) {
      onTitleChange(titleValue);
    }
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
      if (onTitleChange) {
        onTitleChange(titleValue);
      }
    }
  };
  
  // Name editing handlers
  const handleEditNameClick = () => {
    setIsEditingName(true);
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };
  
  const handleNameBlur = () => {
    setIsEditingName(false);
    if (onNameChange) {
      onNameChange(nameValue);
    }
  };
  
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
      if (onNameChange) {
        onNameChange(nameValue);
      }
    }
  };
  
  return (
    <div className="profile-header">
      <div className="profile-image-container">
        <img src={imageUrl} alt={`${name}'s profile`} className="profile-image" />
      </div>
      <div className="profile-info">
        <div className="profile-name-actions">
          <div className="profile-name-container">
            {isEditingName ? (
              <input
                type="text"
                className="profile-name-input"
                value={nameValue}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                placeholder="Add your name"
              />
            ) : (
              <div className="profile-name-display">
                <h1 className="profile-name">
                  {name || <span className="profile-name-placeholder">Add your name</span>}
                  {showVerifiedBadge && <span className="profile-badge">●</span>}
                </h1>
                <button 
                  className="edit-name-button" 
                  onClick={handleEditNameClick}
                  aria-label="Edit name"
                >
                  <AiOutlineEdit />
                </button>
              </div>
            )}
          </div>
          <div className="profile-actions">
            <Button className="btn-secondary" onClick={onMessageClick}>Message</Button>
            <Button className="btn-primary" onClick={onFollowClick}>Follow</Button>
          </div>
        </div>
        <div className="profile-title-container">
          {isEditingTitle ? (
            <input
              type="text"
              className="profile-title-input"
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              placeholder="Add your role"
            />
          ) : (
            <div className="profile-title-display">
              <p className="profile-title">
                {title || <span className="profile-title-placeholder">Add a role</span>}
              </p>
              <button 
                className="edit-title-button" 
                onClick={handleEditTitleClick}
                aria-label="Edit title"
              >
                <AiOutlineEdit />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
