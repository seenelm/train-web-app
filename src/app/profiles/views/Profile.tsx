import React, { useState, useEffect } from 'react';
import './Profile.css';
import { userService, UserProfile } from '../services/userService';
import { FaEnvelope, FaPhone, FaEdit } from 'react-icons/fa';



const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('activity');
  // const [isEditing, setIsEditing] = useState<boolean>(false);

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

  // const handleEditClick = () => {
  //   setIsEditing(true);
  // };

  // const handleCancelEdit = () => {
  //   setIsEditing(false);
  // };

  // const handleSaveEdit = () => {
    // setIsEditing(false);
    fetchUserProfile(); // Refresh profile data after saving
  // };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!profileData) {
    return <div className="error-container">No profile data available</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="activity-section">
            <div className="activity-item">
              <div className="activity-icon check-in">
                <span></span>
              </div>
              <div className="activity-content">
                <div className="activity-time">9:00 AM, Apr 8, 2023</div>
                <div className="activity-text">
                  <strong>Checked in</strong> to Little Tigers Karate class
                </div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon payment">
                <span></span>
              </div>
              <div className="activity-content">
                <div className="activity-time">4:30 PM, Mar 30, 2022</div>
                <div className="activity-text">
                  <strong>Payment of $99.00</strong> made towards Little Tigers Karate program by Andrew Coleman
                </div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon email">
                <span></span>
              </div>
              <div className="activity-content">
                <div className="activity-time">10:33 AM, Mar 25, 2022</div>
                <div className="activity-text">
                  <strong>Email sent</strong> about new updated Pricing for Swimming Dolphin
                </div>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon check-in">
                <span></span>
              </div>
              <div className="activity-content">
                <div className="activity-time">11:05 AM, Mar 23, 2022</div>
                <div className="activity-text">
                  <strong>Checked in</strong> to Swimming Dolphin class
                </div>
              </div>
            </div>
          </div>
        );
      case 'payments':
        return <div className="tab-content">Payments history would be displayed here.</div>;
      case 'attendance':
        return <div className="tab-content">Attendance history would be displayed here.</div>;
      case 'documents':
        return <div className="tab-content">Documents would be displayed here.</div>;
      case 'family':
        return <div className="tab-content">Family information would be displayed here.</div>;
      default:
        return <div className="tab-content">Select a tab to view content.</div>;
    }
  };

  // if (isEditing) {
  //   return (
  //     <div className="profile-container">
  //       <ProfileEditor 
  //         onSave={handleSaveEdit} 
  //         onCancel={handleCancelEdit} 
  //       />
  //     </div>
  //   );
  // }

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
        <div className="profile-programs-section">
  <h2 className="section-title">Programs</h2>
  
  <div className="program-cards-container">
    <div className="program-card active">
      <div className="program-status">Active</div>
      <h3 className="program-title">Little Tigers Karate</h3>
      <div className="program-schedule">
        <span className="schedule-label">Upcoming:</span>
        <span className="schedule-value">Monday, 4:00 PM - 5:00 PM</span>
      </div>
      <div className="program-card-actions">•••</div>
    </div>
    
    <div className="program-card cancelled">
      <div className="program-status">Cancelled</div>
      <h3 className="program-title">Swimming Dolphin</h3>
      <div className="program-schedule">
        <span className="schedule-label">Upcoming:</span>
        <span className="schedule-value">Monday, 4:00 PM - 5:00 PM</span>
      </div>
      <div className="program-card-actions">•••</div>
    </div>
  </div>
</div>
        
        <div className="profile-tabs-section">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button 
              className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button 
              className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance History
            </button>
            <button 
              className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
              onClick={() => setActiveTab('family')}
            >
              Family (4)
            </button>
          </div>
          
          <div className="tabs-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
