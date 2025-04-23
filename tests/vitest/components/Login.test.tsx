// tests/vitest/components/Login.test.tsx
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authServiceMock, resetAuthServiceMock, simulateLoggedInUser, simulateLoggedOutUser } from '../mocks/authService.mock';

// Set up mocks before importing components that use them
vi.mock('../../../src/services/authService', () => {
  return {
    authService: authServiceMock
  };
});

// Now import the component and testing utilities
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import Login from '../../../src/components/Login';

describe('Login Component', () => {
  beforeEach(() => {
    resetAuthServiceMock();
    simulateLoggedOutUser();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the login form when user is not logged in', () => {
    render(<Login />);
    
    // Check for main elements
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('renders the logged in view when user is logged in', () => {
    simulateLoggedInUser();
    render(<Login />);
    
    expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
    expect(screen.getByText('You are signed in.')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const rememberMeCheckbox = screen.getByLabelText('Remember me');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberMeCheckbox);
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('handles form submission', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Sign In');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    // Fast-forward timer to simulate API call completion
    vi.advanceTimersByTime(1500);
    
    // Check if button returns to normal state
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles Google sign in', async () => {
    render(<Login />);
    
    const googleButton = screen.getByText('Google');
    fireEvent.click(googleButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(authServiceMock.signInWithGoogle).toHaveBeenCalledTimes(1);
    });
  });

  it('handles sign out', async () => {
    simulateLoggedInUser();
    render(<Login />);
    
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Signing Out...')).toBeInTheDocument();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(authServiceMock.signOut).toHaveBeenCalledTimes(1);
    });
  });
});