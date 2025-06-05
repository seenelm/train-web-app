import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  const defaultProps = {
    id: 'test-checkbox',
    label: 'Test Checkbox',
    checked: false,
    onChange: vi.fn()
  };

  it('renders correctly with default props', () => {
    render(<Checkbox {...defaultProps} />);
    
    const checkbox = screen.getByLabelText('Test Checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).not.toBeDisabled();
  });

  it('renders in checked state when checked prop is true', () => {
    render(<Checkbox {...defaultProps} checked={true} />);
    
    expect(screen.getByLabelText('Test Checkbox')).toBeChecked();
  });

  it('calls onChange when checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox {...defaultProps} onChange={onChange} />);
    
    fireEvent.click(screen.getByLabelText('Test Checkbox'));
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders disabled checkbox correctly', () => {
    render(<Checkbox {...defaultProps} disabled />);
    
    expect(screen.getByLabelText('Test Checkbox')).toBeDisabled();
  });

  it('renders with ReactNode label', () => {
    const complexLabel = <span>Complex <strong>Label</strong></span>;
    render(<Checkbox {...defaultProps} label={complexLabel} />);
    
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('applies testId correctly', () => {
    const testId = 'terms-checkbox';
    render(<Checkbox {...defaultProps} testId={testId} />);
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByTestId(testId)).toBe(screen.getByLabelText('Test Checkbox'));
  });
});