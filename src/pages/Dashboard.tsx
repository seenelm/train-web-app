import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContentView from '../components/ContentView';
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
        return (
          <>
            <h1>Profile Content</h1>
            <p>User profile information would go here.</p>
          </>
        );
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
      <Sidebar 
        tabs={tabs} 
        defaultActiveTab="home" 
        onTabChange={handleTabChange} 
      />
      <ContentView>
        {renderContent()}
      </ContentView>
    </div>
  );
};

export default Dashboard;
