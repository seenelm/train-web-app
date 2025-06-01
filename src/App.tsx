import { Routes, Route, Navigate } from "react-router";
import { JSX, useEffect, useState } from "react";
import PrivacyPolicy from './pages/PrivacyPolicy';
import Sidebar from './components/Sidebar';
import ContentView from './components/ContentView';
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting, AiOutlineQuestionCircle } from 'react-icons/ai';
import { authService } from './services/authService';
import AuthPage from './pages/AuthPage';
import './styles/app.css';

// Protected route component - redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Login/Register route component - redirects to dashboard if already authenticated
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Dashboard component with tabs
function Dashboard() {
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
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        // You could add additional auth validation here if needed
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <AuthRoute>
            <AuthPage authType="login" />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <AuthPage authType="register" />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <AuthPage authType="forgot-password" />
          </AuthRoute>
        } />
        <Route path="/reset-password" element={
          <AuthRoute>
            <AuthPage authType="reset-password" />
          </AuthRoute>
        } />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;