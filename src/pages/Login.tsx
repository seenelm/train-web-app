import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userManagementService } from '../services/userManagementService';
import { tokenService } from '../services/tokenService';
import './styles/Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user was redirected due to expired session
    const queryParams = new URLSearchParams(location.search);
    const expired = queryParams.get('expired') === 'true';
    if (expired) {
      setSessionExpired(true);
      setError('Your session has expired. Please log in again.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSessionExpired(false);

    // Validate form
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await userManagementService.loginUser(email, password);
      
      // Store tokens and user info
      tokenService.setAccessToken(response.tokens.accessToken);
      tokenService.setRefreshToken(response.tokens.refreshToken);
      tokenService.setTokens(response.tokens.accessToken, response.tokens.refreshToken, response.user.id, response.user.email, response.user.name);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Implement Google authentication flow
    console.log('Google auth clicked');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Log In</h2>
        
        {sessionExpired && (
          <div className="error-message">
            Your session has expired. Please log in again.
          </div>
        )}
        
        {error && !sessionExpired && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <button 
          className="google-auth-button" 
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          Continue with Google
        </button>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
