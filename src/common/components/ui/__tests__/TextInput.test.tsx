import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
  };

  it('renders correctly with default props', () => {
    render(<TextInput {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Test Label')).not.toBeRequired();
  });

  it('renders with required attribute', () => {
    render(<TextInput {...defaultProps} required />);
    
    expect(screen.getByLabelText(/Test Label/)).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with correct type', () => {
    render(<TextInput {...defaultProps} type="email" />);
    
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('type', 'email');
  });

  it('renders with placeholder', () => {
    const placeholder = 'Enter text here';
    render(<TextInput {...defaultProps} placeholder={placeholder} />);
    
    expect(screen.getByLabelText('Test Label')).toHaveAttribute('placeholder', placeholder);
  });

  it('renders with error message', () => {
    const errorMessage = 'This field is required';
    render(<TextInput {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText('Test Label')).toHaveClass('error');
  });

  it('renders disabled input', () => {
    render(<TextInput {...defaultProps} disabled />);
    
    expect(screen.getByLabelText('Test Label')).toBeDisabled();
  });

  it('applies testId correctly', () => {
    const testId = 'custom-test-id';
    render(<TextInput {...defaultProps} testId={testId} />);
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toBe(screen.getByLabelText('Test Label'));
  });

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<TextInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalled();
  });
});