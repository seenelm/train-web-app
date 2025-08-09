import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthCard from '../../../app/access/components/ui/AuthCard';

describe('AuthCard', () => {
  const defaultProps = {
    title: 'Authentication',
    children: <div>Auth Form Content</div>
  };

  it('renders title correctly', () => {
    render(<AuthCard {...defaultProps} />);
    
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Authentication')).toHaveClass('auth-title');
  });

  it('renders children correctly', () => {
    render(<AuthCard {...defaultProps} />);
    
    expect(screen.getByText('Auth Form Content')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    const subtitle = 'Please sign in to continue';
    render(<AuthCard {...defaultProps} subtitle={subtitle} />);
    
    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toHaveClass('auth-subtitle');
  });

  it('does not render subtitle when not provided', () => {
    render(<AuthCard {...defaultProps} />);
    
    const subtitleElements = document.getElementsByClassName('auth-subtitle');
    expect(subtitleElements.length).toBe(0);
  });

  it('renders footer when provided', () => {
    const footer = <div>Footer Content</div>;
    render(<AuthCard {...defaultProps} footer={footer} />);
    
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content').closest('.auth-footer')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(<AuthCard {...defaultProps} />);
    
    const footerElements = document.getElementsByClassName('auth-footer');
    expect(footerElements.length).toBe(0);
  });

  it('renders logo image', () => {
    render(<AuthCard {...defaultProps} />);
    
    const logoImg = screen.getByAltText('Logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveClass('auth-logo');
  });
});