import React from 'react';
import './styles/SocialButton.css';

interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  testId?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  isLoading = false,
  children,
  testId
}) => {
  const getIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg className="social-button-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="social-button-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" fill="currentColor"/>
          </svg>
        );
      case 'apple':
        return (
          <svg className="social-button-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const buttonClasses = [
    'social-button',
    `social-button-${provider}`,
    isLoading ? 'social-button-loading' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled || isLoading}
      type="button"
      data-testid={testId}
    >
      {!isLoading && getIcon()}
      {!isLoading && children}
    </button>
  );
};

export default SocialButton;
