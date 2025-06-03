import React from 'react';
import './styles/TextInput.css';

interface TextInputProps {
  id: string;
  type?: 'text' | 'email' | 'password' | 'number';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  autoComplete?: string;
  name?: string;
  testId?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  autoComplete,
  name,
  testId,
}) => {
  // Determine the appropriate class based on input type
  const getInputTypeClass = () => {
    switch (type) {
      case 'email':
        return 'email-input';
      case 'password':
        return 'password-input';
      case 'text':
        return id.toLowerCase().includes('name') ? 'name-input' : '';
      default:
        return '';
    }
  };

  return (
    <div className={`form-group ${getInputTypeClass()}`}>
      <label htmlFor={id}>{label}{required && <span className="required">*</span>}</label>
      <input
        data-testid={testId}
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={error ? 'error' : ''}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default TextInput;
