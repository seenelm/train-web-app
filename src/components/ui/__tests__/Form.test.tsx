import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from '../Form';

describe('Form', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    children: <div>Form Content</div>
  };

  it('renders children correctly', () => {
    render(<Form {...defaultProps} />);
    
    expect(screen.getByText('Form Content')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    const errorMessage = 'Error submitting form';
    render(<Form {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('form-error');
  });

  it('renders success message when provided', () => {
    const successMessage = 'Form submitted successfully';
    render(<Form {...defaultProps} success={successMessage} />);
    
    expect(screen.getByText(successMessage)).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toHaveClass('form-success');
  });

  it('applies custom className to form element', () => {
    const customClass = 'custom-form-class';
    render(<Form {...defaultProps} className={customClass} />);
    
    const formElement = screen.getByRole('form');
    expect(formElement).toHaveClass('form');
    expect(formElement).toHaveClass(customClass);
  });

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn();
    render(<Form {...defaultProps} onSubmit={onSubmit} />);
    
    const formElement = screen.getByRole('form');
    fireEvent.submit(formElement);
    
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders both error and success messages when provided', () => {
    const errorMessage = 'Error message';
    const successMessage = 'Success message';
    
    render(
      <Form 
        {...defaultProps} 
        error={errorMessage} 
        success={successMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });
});