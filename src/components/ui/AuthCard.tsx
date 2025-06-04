import React from 'react';
import logo from '../../../assets/logo1.svg';
import './styles/AuthCard.css';

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
  return (
    <div className="auth-container">
      <div className="auth-logo-container">
        <img src={logo} alt="Logo" className="auth-logo" />
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
