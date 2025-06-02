// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import TextInput from '../TextInput';

// describe('TextInput Component', () => {
//   const defaultProps = {
//     id: 'test-input',
//     label: 'Test Label',
//     value: '',
//     onChange: vi.fn(),
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test('renders correctly with default props', () => {
//     render(<TextInput {...defaultProps} />);
    
//     // Check if label is rendered
//     expect(screen.getByText('Test Label')).toBeInTheDocument();
    
//     // Check if input is rendered
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toBeInTheDocument();
//     expect(input).toHaveAttribute('type', 'text');
//     expect(input).toHaveValue('');
//   });

//   test('handles input changes correctly', () => {
//     const onChange = vi.fn();
//     render(<TextInput {...defaultProps} onChange={onChange} />);
    
//     const input = screen.getByLabelText('Test Label');
//     fireEvent.change(input, { target: { value: 'new value' } });
    
//     expect(onChange).toHaveBeenCalledTimes(1);
//     expect(onChange.mock.calls[0][0].target.value).toBe('new value');
//   });

//   test('displays error message when provided', () => {
//     render(<TextInput {...defaultProps} error="This field is required" />);
    
//     expect(screen.getByText('This field is required')).toBeInTheDocument();
    
//     // Check if input has error class
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveClass('error');
//   });

//   test('applies disabled state correctly', () => {
//     render(<TextInput {...defaultProps} disabled={true} />);
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toBeDisabled();
//   });

//   test('shows required indicator when required prop is true', () => {
//     render(<TextInput {...defaultProps} required={true} />);
    
//     expect(screen.getByText('*')).toBeInTheDocument();
//   });

//   test('applies correct class for email input type', () => {
//     render(<TextInput {...defaultProps} type="email" />);
    
//     const formGroup = document.querySelector('.form-group');
//     expect(formGroup).toHaveClass('email-input');
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('type', 'email');
//   });

//   test('applies correct class for password input type', () => {
//     render(<TextInput {...defaultProps} type="password" />);
    
//     const formGroup = document.querySelector('.form-group');
//     expect(formGroup).toHaveClass('password-input');
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('type', 'password');
//   });

//   test('applies name-input class for text inputs with "name" in the id', () => {
//     render(<TextInput {...defaultProps} id="user-name" />);
    
//     const formGroup = document.querySelector('.form-group');
//     expect(formGroup).toHaveClass('name-input');
//   });

//   test('uses provided placeholder text', () => {
//     render(<TextInput {...defaultProps} placeholder="Enter text here" />);
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('placeholder', 'Enter text here');
//   });

//   test('uses provided autocomplete attribute', () => {
//     render(<TextInput {...defaultProps} autoComplete="username" />);
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('autocomplete', 'username');
//   });

//   test('uses name attribute when provided', () => {
//     render(<TextInput {...defaultProps} name="custom-name" />);
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('name', 'custom-name');
//   });

//   test('uses id as name when name is not provided', () => {
//     render(<TextInput {...defaultProps} />);
    
//     const input = screen.getByLabelText('Test Label');
//     expect(input).toHaveAttribute('name', 'test-input');
//   });
// });