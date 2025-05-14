import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import { authService } from '../services/authService';
import logo from '../assets/logo.svg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt with:', { email, password, rememberMe });
      setIsLoading(false);
      // In a real app, you would handle authentication here
    }, 1500);
  };

  const handleSignIn = async (provider: 'google' | 'local') => {
    try {
      setIsLoading(true);
      setError(null);
  
      let userData;
  
      if (provider === 'google') {
        userData = await authService.signInWithGoogle();
      } else if (provider === 'local') {
        userData = await authService.signInWithLocal(email, password);
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Welcome Back</h1>
          <p>Please sign in to continue</p>
        </div>
        <>
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
              
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              
              <button type="submit" className="login-button" onClick={() => handleSignIn('local')}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="social-login">
              <p>Or sign in with</p>
              <button 
                onClick={() => handleSignIn('google')} 
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
          </>
        {error && <p className="error-message">{error}</p>}
        
        <div className="login-footer">
          <p>Don't have an account? <a href="#">Sign up</a></p>
          <p>By signing in, you agree to our <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
