import React from 'react';
import './styles/Checkbox.css';

interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  testId?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  testId
}) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        data-testid={testId}
      />
      <span className="checkbox"></span>
      <span className="checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;
