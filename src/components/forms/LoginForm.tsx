import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Form from '../ui/Form';
import SocialButton from '../ui/SocialButton';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { AuthErrorTypes } from '../../common/enums/authEnum';
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

  const handleError = (error: AxiosError<ErrorResponse>) => {
    const errorResponse = error.response?.data as ErrorResponse;
        console.log('Error response:', errorResponse);

    if (error.response && error.response.status >= 500) {
      setError(AuthErrorTypes.ServerError);
    } else {
      setError(errorResponse.message);
    }
  }

  const handleChange = (field: keyof LoginModel, value: string | boolean) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignIn = async (provider: 'google' | 'local') => {
    try {
      setIsLoading(true);
      setError(null);

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
        handleError(err);
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
