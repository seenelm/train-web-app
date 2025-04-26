import React, { useState, ReactElement, useEffect, useRef } from 'react';
import '../styles/sidebar.css';
import logo from '../assets/logo-white.svg';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';

// Define the tab interface
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode; 
}

// Define the TabPanel props interface
interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

// Define the props for the Sidebar component
interface SidebarProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  children: ReactElement<TabPanelProps> | ReactElement<TabPanelProps>[];
}

// Define the content props
interface TabContentProps {
  activeTab: string;
  children: ReactElement<TabPanelProps> | ReactElement<TabPanelProps>[];
}

// TabContent component to handle displaying the correct content
const TabContent: React.FC<TabContentProps> = ({ activeTab, children }) => {
  // Filter and display only the active child component
  const childrenArray = React.Children.toArray(children) as ReactElement<TabPanelProps>[];
  const activeChild = childrenArray.find(child => child.props.id === activeTab);

  return <div className="tab-content">{activeChild}</div>;
};

// TabPanel component for individual tab content
export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div className="tab-panel">{children}</div>;
};

// Main Sidebar component
const Sidebar: React.FC<SidebarProps> = ({ 
  tabs, 
  defaultActiveTab, 
  children 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultActiveTab || (tabs.length > 0 ? tabs[0].id : ''));
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // On mobile, close the sidebar after clicking a tab
    if (window.innerWidth <= 768) {
      setExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      console.log('Successfully signed out');
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sidebar-container">
      <button className="mobile-menu-button" onClick={toggleSidebar}>
        <AiOutlineMenu />
      </button>
      <div ref={sidebarRef} className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-logo" onClick={toggleSidebar}>
          <img src={logo} alt="Train Logo" />
        </div>
        <div className="sidebar-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-signout" onClick={handleSignOut} title="Sign Out">
          <span className="tab-icon"><AiOutlineLogout /></span>
          <span className="tab-label">{isLoading ? 'Signing Out...' : 'Sign Out'}</span>
        </div>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {expanded ? '«' : '»'}
        </div>
      </div>
      <div className="content-area">
        <TabContent activeTab={activeTab}>
          {children}
        </TabContent>
      </div>
    </div>
  );
};

export default Sidebar;