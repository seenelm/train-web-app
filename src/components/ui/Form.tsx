import React from 'react';
import './styles/Form.css';

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  className?: string;
  error?: string | null;
  success?: string | null;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className = '',
  error,
  success,
}) => {
  return (
    <>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      <form onSubmit={onSubmit} className={`form ${className}`}>
        {children}
      </form>
    </>
  );
};

export default Form;
