import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Form from '../ui/Form';
import SocialButton from '../ui/SocialButton';
import { authService } from '../../../services/authService';
import { tokenService } from '../../../services/tokenService';
import { UserRequest } from '@seenelm/train-core';

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create UserRequest object
      const userRequest: UserRequest = {
        name,
        email,
        password,
        deviceId: tokenService.getDeviceId()
      };
      
      // Register user using authService
      const response = await authService.register(userRequest);
      console.log('Registration successful:', response);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await authService.signInWithGoogle();
      console.log('Successfully signed up with Google:', userData);
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      setError(err.message || 'Failed to sign up with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} error={error}>
        <TextInput
          id="name"
          testId="name-input"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          disabled={isLoading}
          autoComplete="name"
        />
        
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
          id="password"
          testId="password-input"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          autoComplete="new-password"
          error={passwordError || undefined}
        />
        
        <TextInput
          id="confirmPassword"
          testId="confirm-password-input"
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          error={passwordError || undefined}
          autoComplete="new-password"
        />
        
        <div className="form-options">
          <Checkbox
            id="agreeToTerms"
            testId="terms-checkbox"
            label={
              <>
                I agree to the <Link to="/terms-of-service">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </>
            }
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          testId="register-button"
          disabled={isLoading}
          isLoading={isLoading}
          className="login-button"
        >
          Register
        </Button>
      </Form>
      
      <div className="social-login">
        <p>Or sign up with</p>
        <SocialButton
          provider="google"
          testId="google-button"
          onClick={handleSignUpWithGoogle}
          disabled={isLoading}
          isLoading={isLoading && error?.includes('Google')}
        />
      </div>
    </>
  );
};

export default RegistrationForm;
