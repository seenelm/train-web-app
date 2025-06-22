import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContentView from '../components/ContentView';
import ProfileView from '../components/profile/ProfileView';
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting, AiOutlineQuestionCircle } from 'react-icons/ai';

const Dashboard: React.FC = () => {
  const tabs = [
    { id: 'home', label: 'Home', icon: <AiOutlineHome /> },
    { id: 'profile', label: 'Profile', icon: <AiOutlineUser /> },
    { id: 'settings', label: 'Settings', icon: <AiOutlineSetting /> },
    { id: 'help', label: 'Help', icon: <AiOutlineQuestionCircle /> }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // Implement profile editing functionality
  };

  // Content to display based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <h1>Home Content</h1>
            <p>This is the home tab content area.</p>
          </>
        );
      case 'profile':
        return <ProfileView onEdit={handleEditProfile} />;
      case 'settings':
        return (
          <>
            <h1>Settings Content</h1>
            <p>Application settings would be displayed here.</p>
          </>
        );
      case 'help':
        return (
          <>
            <h1>Help Content</h1>
            <p>Help and documentation would be shown here.</p>
          </>
        );
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar 
          tabs={tabs} 
          defaultActiveTab="home" 
          onTabChange={handleTabChange} 
        />
      </div>
      <div className="content-area">
        <ContentView>
          {renderContent()}
        </ContentView>
      </div>
    </div>
  );
};

export default Dashboard;
