import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import Form from '../ui/Form';
import { authService } from '../../../services/authService';

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.requestPasswordReset({ email });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError('Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} error={error}>
      <p className="form-description">
        Enter your email address below and we'll send you instructions to reset your password.
      </p>
      
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
      
      <Button
        type="submit"
        testId="submit-button"
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
