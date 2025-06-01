import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Form from '../ui/Form';
import { authService } from '../../services/authService';

const ForgotPasswordForm: React.FC = () => {
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
      await authService.requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError('Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <p>Password reset instructions have been sent to your email!</p>
        <p>Please check your inbox and follow the instructions to reset your password.</p>
        <Button 
          onClick={() => navigate('/login')}
          className="login-button"
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} error={error}>
      <p className="form-description">
        Enter your email address below and we'll send you instructions to reset your password.
      </p>
      
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
      
      <Button
        type="submit"
        disabled={isLoading}
        isLoading={isLoading}
        className="login-button"
      >
        Send Reset Instructions
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;
