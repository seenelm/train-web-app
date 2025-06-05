import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";
import { ProtectedRoute, AuthRoute, ResetPasswordRoute } from './RouteGuards';
import AuthPage from '../../pages/AuthPage';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsOfService from '../../pages/TermsOfService';
import Dashboard from '../../pages/Dashboard';

interface NavigationProps {
  // You can add props here if needed in the future
}

const Navigation: React.FC<NavigationProps> = () => {
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
        <ResetPasswordRoute>
          <AuthPage authType="reset-password" />
        </ResetPasswordRoute>
      } />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
    </Routes>
  );
};

export default Navigation;
