import React, { useState, useEffect } from 'react';
import './Profile.css';
import { userService, UserProfile } from '../services/userService';
import { FaEnvelope, FaPhone, FaEdit } from 'react-icons/fa';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getCurrentUserProfile();
      setProfileData(profile);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load profile data');
      setLoading(false);
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

  if (!profileData) {
    return <div className="error-container">No profile data available</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className="profile-edit-button">
          <button onClick={() => {}} className="edit-profile-btn">
            <FaEdit /> Edit 
          </button>
        </div>
        
        <div className="profile-info-section">
          <div className="profile-avatar">
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt={`${profileData.name}'s profile`}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            {profileData.accountType !== 1 && <span className="status-badge">Private</span>}
          </div>
          
          <div className="profile-details-container">
            <h1 className="profile-name">{profileData.name || 'Charlotte Bell'}</h1>
            
            <div className="profile-details">
              <div className="detail-item">
                <span>{'Leesburg, VA, USA'}</span>
              </div>
            </div>

            <div className="profile-tags">
              {profileData.customSections && profileData.customSections.map((section, index) => (
                <span key={index} className="profile-tag">{section.title}</span>
              ))}
              {!profileData.customSections && (
                <>
                  <span className="profile-tag">Karate</span>
                  <span className="profile-tag">Martial Arts</span>
                </>
              )}
            </div>
            
            <div className="profile-details">
              <div className='detail-item'>
                <span>{profileData.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec metus vel ante facilisis finibus. Nullam nec metus vel ante facilisis finibus.'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-contact">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span className="contact-text">{'noahgross1@gmail.com'}</span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span className="contact-text">{'+1 703-555-1234'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
