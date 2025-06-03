import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialButton from '../SocialButton';

describe('SocialButton', () => {
  const defaultProps = {
    provider: 'google' as const,
    onClick: vi.fn(),
    children: 'Sign in with Google'
  };

  it('renders correctly with Google provider', () => {
    render(<SocialButton {...defaultProps} />);
    
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('social-button-google');
  });

  it('renders correctly with Facebook provider', () => {
    render(
      <SocialButton 
        {...defaultProps} 
        provider="facebook"
        children="Sign in with Facebook" 
      />
    );
    
    expect(screen.getByText('Sign in with Facebook')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('social-button-facebook');
  });

  it('renders correctly with Apple provider', () => {
    render(
      <SocialButton 
        {...defaultProps} 
        provider="apple"
        children="Sign in with Apple" 
      />
    );
    
    expect(screen.getByText('Sign in with Apple')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('social-button-apple');
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<SocialButton {...defaultProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button correctly', () => {
    render(<SocialButton {...defaultProps} disabled />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders loading state correctly', () => {
    render(<SocialButton {...defaultProps} isLoading />);
    
    expect(screen.getByRole('button')).toHaveClass('social-button-loading');
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Sign in with Google')).not.toBeInTheDocument();
  });

  it('applies testId correctly', () => {
    const testId = 'google-sign-in-button';
    render(<SocialButton {...defaultProps} testId={testId} />);
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toBe(screen.getByRole('button'));
  });
});