import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaPhone, FaEdit, FaTimes, FaEnvelope, FaPlus } from 'react-icons/fa';
import { UserProfileRequest, UserProfileResponse } from '@seenelm/train-core';
import { userProfileService } from '../services/userProfileService';

const Profile: React.FC = () => {
  const [profileRequest, setProfileRequest] = useState<UserProfileRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [rolesInput, setRolesInput] = useState<string>(''); 
  const [email, setEmail] = useState<string>('');

  // Helper function to map UserProfileResponse to UserProfileRequest
  const mapResponseToRequest = (response: UserProfileResponse): UserProfileRequest => {
    return {
      userId: response.userId,
      username: response.username,
      name: response.name,
      phoneNumber: response.phoneNumber,
      birthday: response.birthday,
      bio: response.bio,
      accountType: response.accountType,
      role: response.role,
      location: response.location,
      socialLinks: undefined,
      certifications: undefined,
      customSections: undefined,
    };
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userProfileService.getCurrentUserProfile();
      setEmail(response.email || '');
      const profileReq = mapResponseToRequest(response);
      setProfileRequest(profileReq);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileRequest) return;
    
    setIsSaving(true);
    try {
      await userProfileService.updateUserProfile(profileRequest);
      setIsEditDialogOpen(false);
      // Optionally refetch to get the latest data
      await fetchUserProfile();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!profileRequest) {
    return <div className="error-container">No profile data available</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-edit-button">
          <button onClick={() => {
            setRolesInput(profileRequest.role ? profileRequest.role.join(', ') : '');
            setIsEditDialogOpen(true);
          }} className="edit-profile-btn">
            <FaEdit /> Edit 
          </button>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {profileRequest.name ? profileRequest.name.charAt(0).toUpperCase() : 'C'}
            </div>
            {profileRequest.accountType !== 1 && <span className="status-badge">Private</span>}
          </div>
          
          <div className="profile-details-container">
            <h1 className="profile-name">{profileRequest.name}</h1>
            
            <div className="profile-details">
              <div className="detail-item">
                <span>{profileRequest.location || 'Location not set'}</span>
              </div>
            </div>

            <div className="profile-tags">
              {profileRequest.role  && profileRequest.role.map((roleItem, index) => (
                <span key={index} className="profile-tag">{roleItem}</span>
              ))}
            </div>
            
            <div className="profile-details">
              <div className='detail-item'>
                <span>{profileRequest.bio || 'No bio available'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-contact">
        <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span className="contact-text">{email}</span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span className="contact-text">{profileRequest.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isEditDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsEditDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Edit Profile</h2>
              <button 
                className="dialog-close-btn" 
                onClick={() => setIsEditDialogOpen(false)}
                aria-label="Close dialog"
              >
                <FaTimes />
              </button>
            </div>
            
            <form className="profile-edit-form" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={profileRequest.name}
                  onChange={(e) => setProfileRequest({ ...profileRequest, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  id="username"
                  type="text"
                  value={profileRequest.username}
                  onChange={(e) => setProfileRequest({ ...profileRequest, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profileRequest.bio || ''}
                  onChange={(e) => setProfileRequest({ ...profileRequest, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={profileRequest.location || ''}
                  onChange={(e) => setProfileRequest({ ...profileRequest, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Roles</label>
                <div className="input-with-button">
                  <input
                    id="role"
                    type="text"
                    value={rolesInput}
                    onChange={(e) => setRolesInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmedRole = rolesInput.trim();
                        if (trimmedRole && !profileRequest.role?.includes(trimmedRole)) {
                          setProfileRequest({ 
                            ...profileRequest, 
                            role: [...(profileRequest.role || []), trimmedRole]
                          });
                          setRolesInput('');
                        }
                      }
                    }}
                    placeholder="Add a role (e.g., Personal Trainer)"
                  />
                  <button
                    type="button"
                    className="add-role-btn"
                    onClick={() => {
                      const trimmedRole = rolesInput.trim();
                      if (trimmedRole && !profileRequest.role?.includes(trimmedRole)) {
                        setProfileRequest({ 
                          ...profileRequest, 
                          role: [...(profileRequest.role || []), trimmedRole]
                        });
                        setRolesInput('');
                      }
                    }}
                    aria-label="Add role"
                  >
                    <FaPlus />
                  </button>
                </div>
                {profileRequest.role && profileRequest.role.length > 0 && (
                  <div className="roles-preview">
                    {profileRequest.role.map((roleItem, index) => (
                      <span key={index} className="role-tag-preview">
                        {roleItem}
                        <button
                          type="button"
                          className="remove-role-btn"
                          onClick={() => {
                            setProfileRequest({
                              ...profileRequest,
                              role: profileRequest.role?.filter((_, i) => i !== index)
                            });
                          }}
                          aria-label={`Remove ${roleItem}`}
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={profileRequest.phoneNumber || ''}
                  onChange={(e) => setProfileRequest({ ...profileRequest, phoneNumber: e.target.value })}
                  placeholder="+1 234-567-8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountType">Account Type *</label>
                <select
                  id="accountType"
                  value={profileRequest.accountType}
                  onChange={(e) => setProfileRequest({ ...profileRequest, accountType: Number(e.target.value) as 1 | 2 })}
                  required
                >
                  <option value={1}>Public</option>
                  <option value={2}>Private</option>
                </select>
              </div>

              <div className="dialog-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
