import React, { useState, useEffect } from 'react';
import logo from '../../../../assets/logo.svg';
import logoWhite from '../../../../assets/logo-white.svg';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-logo-container">
        <img src={isDarkMode ? logoWhite : logo} alt="Logo" className="auth-logo" />
      </div>
      
      <div className="auth-header">
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>
      
      <div className="auth-content">
        {children}
      </div>
      
      {footer && (
        <div className="auth-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AuthCard;
