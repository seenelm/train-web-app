import React, { useState, useRef, useEffect } from 'react';
import './styles/sidebar.css';
import logo from '@/assets/logo-white.svg';
import { authService } from '../app/access/services/authService';
import { useNavigate } from 'react-router';
import { AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { LogoutRequest } from '@seenelm/train-core';
import { tokenService } from '../services/tokenService';

// Define the tab interface
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode; 
}

// Define the props for the Sidebar component
interface SidebarProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange: (tabId: string) => void;
}

// Main Sidebar component
const Sidebar: React.FC<SidebarProps> = ({ 
  tabs, 
  defaultActiveTab,
  onTabChange
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
    onTabChange(tabId);
    // On mobile, close the sidebar after clicking a tab
    if (window.innerWidth <= 768) {
      setExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleSignOut = async () => {
    const logoutRequest: LogoutRequest = {
      deviceId: tokenService.getDeviceId(),
      refreshToken: tokenService.getRefreshToken() || ''
    };
    try {
      setIsLoading(true);
      await authService.logout(logoutRequest);
      console.log('Successfully signed out');
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
    </>
  );
};

export default Sidebar;