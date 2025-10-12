import React, { useState, useEffect, useRef } from 'react';

interface TimePickerProps {
  value: number; // value in seconds
  onChange: (seconds: number) => void;
  className?: string;
  placeholder?: string;
  defaultUnit?: 'sec' | 'min' | 'hrs';
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '', placeholder = 'Time', defaultUnit = 'sec' }) => {
  const [unit, setUnit] = useState<'sec' | 'min' | 'hrs'>(defaultUnit);
  const [displayValue, setDisplayValue] = useState<string>('');
  const isEditingRef = useRef(false);

  useEffect(() => {
    // Update display value when external value changes
    if (!isEditingRef.current) {
      if (unit === 'min') {
        const converted = Math.round(value / 60);
        setDisplayValue(value === 0 ? '' : converted.toString());
      } else if (unit === 'hrs') {
        const converted = Math.round(value / 3600);
        setDisplayValue(value === 0 ? '' : converted.toString());
      } else {
        setDisplayValue(value === 0 ? '' : value.toString());
      }
    }
  }, [value, unit]);

  const handleValueChange = (inputValue: string) => {
    isEditingRef.current = true;
    setDisplayValue(inputValue);
    const newValue = parseFloat(inputValue) || 0;
    let seconds = newValue;
    if (unit === 'min') seconds = newValue * 60;
    if (unit === 'hrs') seconds = newValue * 3600;
    onChange(seconds);
    setTimeout(() => {
      isEditingRef.current = false;
    }, 100);
  };

  const handleUnitChange = (newUnit: 'sec' | 'min' | 'hrs') => {
    setUnit(newUnit);
    // Convert current value to new unit
    if (newUnit === 'min') {
      const converted = Math.round(value / 60);
      setDisplayValue(value === 0 ? '' : converted.toString());
    } else if (newUnit === 'hrs') {
      const converted = Math.round(value / 3600);
      setDisplayValue(value === 0 ? '' : converted.toString());
    } else {
      setDisplayValue(value === 0 ? '' : value.toString());
    }
  };

  return (
    <div className={`time-picker ${className}`}>
      <input
        type="number"
        value={displayValue}
        onChange={(e) => handleValueChange(e.target.value)}
        min="0"
        className="time-picker-input"
        placeholder={placeholder}
      />
      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value as 'sec' | 'min' | 'hrs')}
        className="time-picker-unit"
      >
        <option value="sec">sec</option>
        <option value="min">min</option>
        <option value="hrs">hrs</option>
      </select>
    </div>
  );
};

export default TimePicker;
