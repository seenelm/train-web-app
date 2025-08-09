import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContentView from '../components/ContentView';
import Profile from './Profile';
import Groups from './Groups';
import Events from './Events';
import Search from './Search';
import { AiOutlineHome, AiOutlineUser, AiOutlineTeam, AiOutlineCalendar, AiOutlineSearch } from 'react-icons/ai';

const Dashboard: React.FC = () => {
  const tabs = [
    { id: 'home', label: 'Home', icon: <AiOutlineHome /> },
    { id: 'profile', label: 'Profile', icon: <AiOutlineUser /> },
    { id: 'groups', label: 'Groups', icon: <AiOutlineTeam /> },
    { id: 'events', label: 'Events', icon: <AiOutlineCalendar /> },
    { id: 'search', label: 'Search', icon: <AiOutlineSearch /> }
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
        return <Profile />;
      case 'groups':
        return <Groups />;
      case 'events':
        return <Events />;
      case 'search':
        return <Search />;
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
