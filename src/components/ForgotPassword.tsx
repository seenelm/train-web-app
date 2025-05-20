import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import { authService } from '../services/authService';
import logo from '../assets/logo.svg';
import {RequestPasswordResetRequest} from '@seenelm/train-core'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const passwordResetRequest: RequestPasswordResetRequest = {
        email: email
      }
      // Call the requestPasswordReset endpoint
      await authService.requestPasswordReset(passwordResetRequest);
      setSuccess(true);
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError('Failed to request password reset. Please try again.');
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
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a password reset code</p>
        </div>

        {success ? (
          <div className="success-message">
            <p>Password reset email sent! Check your inbox for the reset code.</p>
            <p>Redirecting to reset password page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
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
            
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
        
        <div className="login-footer">
          <p>Remember your password? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
