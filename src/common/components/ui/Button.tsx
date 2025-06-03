import React from 'react';
import './styles/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  testId?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  children,
  variant = 'primary',
  testId
}) => {
  const baseClass = 'button';
  const variantClass = `button-${variant}`;
  const loadingClass = isLoading ? 'button-loading' : '';
  const buttonClasses = `${baseClass} ${variantClass} ${loadingClass} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      data-testid={testId}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
