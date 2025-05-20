import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/login.css';
import { authService } from '../services/authService';
import logo from '../assets/logo.svg';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get email from URL query params
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Reset Password</h1>
          <p>Enter the verification code sent to your email and your new password</p>
        </div>

        {success ? (
          <div className="success-message">
            <p>Your password has been successfully reset!</p>
            <p>Redirecting to login page...</p>
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
            
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the code from your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">New Password</label>
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
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
