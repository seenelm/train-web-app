import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'; // Reusing login styles
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
import { UserRequest } from '@seenelm/train-core';
import logo from '../assets/logo.svg';

const Registration = () => {
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Create Account</h1>
          <p>Please fill in your information to register</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="agreeToTerms">
                I agree to the <Link to="/terms-of-service">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="social-login">
          <p>Or sign up with</p>
          <button 
            onClick={handleSignUpWithGoogle} 
            className="google-signin-button" 
            disabled={isLoading}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
            </svg>
            Google
          </button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Registration;