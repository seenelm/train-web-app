import React, { useState } from 'react';
import { userService, UserProfile } from '../services/userService';

const UserProfileManager: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch a user profile by ID
  const handleFetchProfile = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const userProfile = await userService.getUserProfile(userId);
      setProfile(userProfile);
      setSuccessMessage('Profile fetched successfully');
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile. Please check the ID and try again.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the current user's profile
  const handleFetchCurrentUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const userProfile = await userService.getCurrentUserProfile();
      setProfile(userProfile);
      setUserId(userProfile.userId);
      setSuccessMessage('Current user profile fetched successfully');
    } catch (err) {
      console.error('Error fetching current user profile:', err);
      setError('Failed to fetch current user profile. Are you logged in?');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear the displayed profile
  const handleClearProfile = () => {
    setProfile(null);
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <div className="user-profile-manager">
      <h1>User Profile Manager</h1>
      
      <div className="actions">
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="form-control"
          />
        </div>
        
        <div className="button-group">
          <button 
            onClick={handleFetchProfile} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : 'Fetch Profile by ID'}
          </button>
          
          <button 
            onClick={handleFetchCurrentUserProfile} 
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Loading...' : 'Fetch Current User Profile'}
          </button>
          
          <button 
            onClick={handleClearProfile} 
            disabled={loading || !profile}
            className="btn btn-outline"
          >
            Clear Profile
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      {profile && (
        <div className="profile-display">
          <h2>Profile Information</h2>
          
          <div className="profile-header">
            {profile.profilePicture && (
              <img 
                src={profile.profilePicture} 
                alt={`${profile.name}'s profile`} 
                className="profile-image"
              />
            )}
            <div className="profile-title">
              <h3>{profile.name}</h3>
              <p className="username">@{profile.username}</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <strong>User ID:</strong> {profile._id}
            </div>
            
            <div className="detail-item">
              <strong>Account Type:</strong> {profile.accountType}
            </div>
            
            {profile.bio && (
              <div className="detail-item">
                <strong>Bio:</strong>
                <p>{profile.bio}</p>
              </div>
            )}
            
            {profile.customSections && profile.customSections.length > 0 && (
              <div className="detail-item">
                <strong>Custom Sections:</strong>
                <ul>
                  {profile.customSections.map((section, index) => (
                    <li key={index}>
                      <strong>{section.title}:</strong> {section.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="detail-item">
              <strong>Created:</strong> {new Date(profile.createdAt || '').toLocaleString()}
            </div>
            
            <div className="detail-item">
              <strong>Updated:</strong> {new Date(profile.updatedAt || '').toLocaleString()}
            </div>
          </div>
          
          <div className="profile-json">
            <h3>Raw Profile Data</h3>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileManager;
