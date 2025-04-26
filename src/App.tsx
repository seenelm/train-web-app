import { Routes, Route, Navigate } from "react-router";
import { JSX, useEffect, useState } from "react";
import Login from './components/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Sidebar, { TabPanel } from './components/Sidebar';
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting, AiOutlineQuestionCircle } from 'react-icons/ai';
import { authService } from './services/authService';

// Protected route component - redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Login route component - redirects to dashboard if already authenticated
const LoginRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Login />;
};

// Dashboard component with tabs
function Dashboard() {
  const tabs = [
    { id: 'home', label: 'Home', icon: <AiOutlineHome /> },
    { id: 'profile', label: 'Profile', icon: <AiOutlineUser /> },
    { id: 'settings', label: 'Settings', icon: <AiOutlineSetting /> },
    { id: 'help', label: 'Help', icon: <AiOutlineQuestionCircle /> }
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Sidebar tabs={tabs} defaultActiveTab="home">
        <TabPanel id="home">
          <h1>Home Content</h1>
          <p>This is the home tab content area.</p>
        </TabPanel>
        <TabPanel id="profile">
          <h1>Profile Content</h1>
          <p>User profile information would go here.</p>
        </TabPanel>
        <TabPanel id="settings">
          <h1>Settings Content</h1>
          <p>Application settings would be displayed here.</p>
        </TabPanel>
        <TabPanel id="help">
          <h1>Help Content</h1>
          <p>Help and documentation would be shown here.</p>
        </TabPanel>
      </Sidebar>
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
    <div style={{ height: '100%', width: '100%' }}>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;