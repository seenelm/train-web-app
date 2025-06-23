import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import TextInput from '../../../../components/ui/TextInput';
import Button from '../../../../components/ui/Button';
import Form from '../../../../components/ui/Form';
import { authService } from '../../../../services/authService';

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    // Get email from URL query params
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Call the resetPasswordWithCode endpoint
      await authService.resetPasswordWithCode({
        email,
        resetCode: code,
        newPassword: password
      });
      console.log("Password reset successful");
      setSuccess(true);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <p>Your password has been successfully reset!</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} error={error}>
      <TextInput
        id="email"
        testId="email-input"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={isLoading}
        autoComplete="email"
      />
      
      <TextInput
        id="code"
        testId="code-input"
        type="text"
        label="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter the code from your email"
        required
        disabled={isLoading}
      />
      
      <TextInput
        id="password"
        testId="password-input"
        type="password"
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        disabled={isLoading}
        autoComplete="new-password"
      />
      
      <TextInput
        id="confirmPassword"
        testId="confirm-password-input"
        type="password"
        label="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        disabled={isLoading}
        error={passwordError || undefined}
        autoComplete="new-password"
      />
      
      <Button
        type="submit"
        testId="reset-button"
        disabled={isLoading}
        isLoading={isLoading}
        className="login-button"
      >
        Reset Password
      </Button>
    </Form>
  );
};

export default ResetPasswordForm;
