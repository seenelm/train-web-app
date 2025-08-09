import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import ProfileEditor from '../components/ProfileEditor';
import GroupManager from '../components/GroupManager';
import EventManager from '../components/EventManager';
import SearchInterface from '../components/SearchInterface';
import './styles/ManagementDashboard.css';

type TabType = 'profile' | 'groups' | 'events' | 'search';

const ManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const navigate = useNavigate();

  const handleProfileSelect = (userId: string) => {
    // Navigate to profile page
    navigate(`/profile/${userId}`);
  };

  const handleGroupSelect = (groupId: string) => {
    // Navigate to group page
    navigate(`/group/${groupId}`);
  };



  return (
    <div className="management-dashboard">
      <div className="dashboard-sidebar">
        <button 
          className={`sidebar-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> <span>Profile</span>
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <FaUsers /> <span>Groups</span>
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <FaCalendarAlt /> <span>Events</span>
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <FaSearch /> <span>Search</span>
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <h2>Profile Management</h2>
            <ProfileEditor />
          </div>
        )}
        
        {activeTab === 'groups' && (
          <div className="dashboard-section">
            <h2>Group Management</h2>
            <GroupManager />
          </div>
        )}
        
        {activeTab === 'events' && (
          <div className="dashboard-section">
            <h2>Event Management</h2>
            <EventManager />
          </div>
        )}
        
        {activeTab === 'search' && (
          <div className="dashboard-section">
            <h2>Search</h2>
            <SearchInterface 
              onProfileSelect={handleProfileSelect}
              onGroupSelect={handleGroupSelect}
              onCertificationSelect={(certId) => console.log('Certification selected:', certId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementDashboard;
