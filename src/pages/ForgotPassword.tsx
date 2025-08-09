import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userManagementService } from '../services/userManagementService';
import './styles/Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      await userManagementService.requestPasswordReset(email);
      setResetRequested(true);
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.error?.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        
        {resetRequested ? (
          <div className="reset-success">
            <p>Password reset instructions have been sent to your email.</p>
            <p>Please check your inbox and follow the instructions to reset your password.</p>
            <div style={{ marginTop: '20px' }}>
              <Link to="/reset-password" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Enter Reset Code
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            
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
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? 'Requesting Reset...' : 'Request Password Reset'}
              </button>
            </form>
          </>
        )}
        
        <p className="auth-redirect">
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
