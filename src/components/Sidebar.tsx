import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { AiOutlineLogout, AiOutlineMenu, AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import logo from "@/assets/logo.svg";
import logoWhite from "@/assets/logo-white.svg";
import { authService } from "../app/access/services/authService";
import { tokenService } from "../services/tokenService";
import { LogoutRequest } from "@seenelm/train-core";
import "./styles/sidebar.css";

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  tabs: TabItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ tabs }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Check for dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSignOut = async () => {
    const logoutRequest: LogoutRequest = {
      deviceId: tokenService.getDeviceId(),
      refreshToken: tokenService.getRefreshToken() || "",
    };
    try {
      await authService.logout(logoutRequest);
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Determine sidebar classes based on state
  const sidebarClasses = `sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${isMobile && mobileOpen ? 'mobile-open' : ''}`;

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <button className="mobile-menu-button" onClick={toggleSidebar}>
        <AiOutlineMenu />
      </button>

      <div className={sidebarClasses}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={isDarkMode ? logoWhite : logo} alt="Train Logo" />
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <AiOutlineArrowRight /> : <AiOutlineArrowLeft />}
          </button>
        </div>

        <div className="sidebar-tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id === "" ? "/" : `/${tab.id}`}
              className={({ isActive }) => `sidebar-tab ${isActive ? "active" : ""}`}
              title={tab.label}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {!collapsed && <span className="tab-label">{tab.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-signout" onClick={handleSignOut} title="Sign Out">
          <span className="tab-icon">
            <AiOutlineLogout />
          </span>
          {!collapsed && <span className="tab-label">Sign Out</span>}
        </div>
      </div>
      
      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar;
