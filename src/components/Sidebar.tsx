import React from "react";
import { NavLink, useNavigate } from "react-router";
import { AiOutlineLogout } from "react-icons/ai";
import logo from "@/assets/logo.svg";
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

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Train Logo" />
      </div>

      <div className="sidebar-tabs">
        {tabs.map((tab) => (
          <NavLink
          key={tab.id}
          to={tab.id === "" ? "/" : `/${tab.id}`}
          className={({ isActive }) => `sidebar-tab ${isActive ? "active" : ""}`}
          title={tab.label}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
        ))}
      </div>

      <div className="sidebar-signout" onClick={handleSignOut} title="Sign Out">
        <span className="tab-icon">
          <AiOutlineLogout />
        </span>
        <span className="tab-label">Sign Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
