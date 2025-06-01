import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Form from '../ui/Form';
import SocialButton from '../ui/SocialButton';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';

interface LoginFormProps {
  sessionExpired?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ sessionExpired = false }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    sessionExpired ? 'Your session has expired. Please sign in again.' : null
  );

  const handleSignIn = async (provider: 'google' | 'local') => {
    try {
      setIsLoading(true);
      setError(null);
  
      let userData;
  
      if (provider === 'google') {
        userData = await authService.signInWithGoogle();
      } else if (provider === 'local') {
        userData = await authService.login({ 
          email, 
          password, 
          deviceId: tokenService.getDeviceId() 
        });
      } else {
        throw new Error('Unsupported provider');
      }
  
      console.log(`Successfully signed in with ${provider}:`, userData);
      navigate('/');
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn('local');
  };

  return (
    <>
      <Form onSubmit={handleSubmit} error={error}>
        <TextInput
          id="email"
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
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
        
        <div className="form-options">
          <Checkbox
            id="remember"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
        </div>
        
        <Button
          type="submit"
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
          onClick={() => handleSignIn('google')}
          disabled={isLoading}
          isLoading={isLoading && error?.includes('Google')}
        />
      </div>
    </>
  );
};

export default LoginForm;
