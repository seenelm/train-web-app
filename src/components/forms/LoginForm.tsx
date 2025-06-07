import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Form from '../ui/Form';
import SocialButton from '../ui/SocialButton';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { LoginErrorTypes } from '../../common/enums/authEnum';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../mocks/handlers';

interface LoginFormProps {
  sessionExpired?: boolean;
}

export interface LoginModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ sessionExpired = false }) => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<LoginModel>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    sessionExpired ? 'Your session has expired. Please sign in again.' : null
  );

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginModel, value: string | boolean) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    console.log('Validating form');
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    if (!loginForm.email.trim()) {
      setEmailError(LoginErrorTypes.EmailRequired);
      console.log('Email is required', loginForm.email);
      return false;
    }

    if (!loginForm.password.trim()) {
      setPasswordError(LoginErrorTypes.PasswordRequired);
      console.log('Password is required', loginForm.password);
      return false;
    }

    return true;
  }

  const handleSignIn = async (provider: 'google' | 'local') => {
    try {
      setIsLoading(true);
      // setError(null);
  
      let userData;
  
      if (provider === 'google') {
        userData = await authService.signInWithGoogle();
      } else if (provider === 'local') {
        userData = await authService.login({ 
          email: loginForm.email, 
          password: loginForm.password, 
          deviceId: tokenService.getDeviceId() 
        });
      } else {
        throw new Error('Unsupported provider');
      }
  
      console.log(`Successfully signed in with ${provider}:`, userData);
      navigate('/');
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      if (err instanceof AxiosError) {
        const errorResponse = err.response?.data as ErrorResponse;
        console.log('Error response:', errorResponse);
        // Handle backend validation errors
        switch (errorResponse?.errorCode) {
          case 'PASSWORD_REQUIRED':
            setPasswordError(LoginErrorTypes.PasswordRequired);
            break;
          case 'EMAIL_REQUIRED':
            setEmailError(LoginErrorTypes.EmailRequired);
            break;
          case 'INVALID_PASSWORD':
            setError(LoginErrorTypes.InvalidPassword);
            break;
          default:
            setError(`Failed to sign in with ${provider}. Please try again.`);
        }

      } else {
        setError(`Failed to sign in with ${provider}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('handleSubmit');
    e.preventDefault();
    console.log('Form state before validation:', loginForm);
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    handleSignIn('local');
  };

  return (
    <>
      <Form onSubmit={handleSubmit} error={error}>
        <TextInput
          id="email"
          testId="email-input"
          type="email"
          label="Email"
          value={loginForm.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading}
          autoComplete="email"
          error={emailError}
        />
        
        <TextInput
          id="password"
          testId="password-input"
          type="password"
          label="Password"
          value={loginForm.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          autoComplete="current-password"
          error={passwordError}
        />
        
        <div className="form-options">
          <Checkbox
            id="remember"
            testId="remember-checkbox"
            label="Remember me"
            checked={loginForm.rememberMe}
            onChange={(e) => handleChange('rememberMe', e.target.checked)}
            disabled={isLoading}
          />
          <Link to="/forgot-password" data-testid="forgot-password-link" className="forgot-password">Forgot password?</Link>
        </div>
        
        <Button
          type="submit"
          testId="login-button"
          disabled={isLoading}
          isLoading={isLoading}
          className="login-button"
        >
          Sign In
        </Button>
      </Form>
      
      <div className="social-login">
        <p>Or sign in with</p>
        <SocialButton
          provider="google"
          testId="google-button"
          onClick={() => handleSignIn('google')}
          disabled={isLoading}
          isLoading={isLoading && error?.includes('Google')}
        />
      </div>
    </>
  );
};

export default LoginForm;
