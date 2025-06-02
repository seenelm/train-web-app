import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import AuthCard from '../common/components/ui/AuthCard';
import LoginForm from '../common/components/forms/LoginForm';
import RegistrationForm from '../common/components/forms/RegistrationForm';
import ForgotPasswordForm from '../common/components/forms/ForgotPasswordForm';
import ResetPasswordForm from '../common/components/forms/ResetPasswordForm';

type AuthType = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  authType: AuthType;
}

const AuthPage: React.FC<AuthPageProps> = ({ authType }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired') === 'true';

  const getTitle = (): string => {
    switch (authType) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Create Account';
      case 'forgot-password':
        return 'Forgot Password';
      case 'reset-password':
        return 'Reset Password';
      default:
        return 'Authentication';
    }
  };

  const getSubtitle = (): string => {
    switch (authType) {
      case 'login':
        return 'Please sign in to continue';
      case 'register':
        return 'Please fill in your information to register';
      case 'forgot-password':
        return 'Enter your email to receive reset instructions';
      case 'reset-password':
        return 'Enter the verification code sent to your email and your new password';
      default:
        return '';
    }
  };

  const getFooter = () => {
    switch (authType) {
      case 'login':
        return (
          <>
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            <p>By signing in, you agree to our <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.</p>
          </>
        );
      case 'register':
        return <p>Already have an account? <Link to="/login">Sign in</Link></p>;
      case 'forgot-password':
      case 'reset-password':
        return <p>Remember your password? <Link to="/login">Sign in</Link></p>;
      default:
        return null;
    }
  };

  const renderForm = () => {
    switch (authType) {
      case 'login':
        return <LoginForm sessionExpired={sessionExpired} />;
      case 'register':
        return <RegistrationForm />;
      case 'forgot-password':
        return <ForgotPasswordForm />;
      case 'reset-password':
        return <ResetPasswordForm />;
      default:
        return <LoginForm sessionExpired={false} />;
    }
  };

  return (
    <AuthCard
      title={getTitle()}
      subtitle={getSubtitle()}
      footer={getFooter()}
    >
      {renderForm()}
    </AuthCard>
  );
};

export default AuthPage;
