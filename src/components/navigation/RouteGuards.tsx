import { JSX } from "react";
import { Navigate, useLocation } from "react-router";
import { authService } from '../../services/authService'

// Protected route component - redirects to login if not authenticated
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Login/Register route component - redirects to dashboard if already authenticated
export const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Reset Password route component - only accessible with email parameter
export const ResetPasswordRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const isAuthenticated = authService.isAuthenticated();
  
  // Redirect to forgot-password if no email parameter is provided
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
