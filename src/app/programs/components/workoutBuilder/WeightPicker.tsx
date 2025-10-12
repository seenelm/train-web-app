import React, { useState, useEffect, useRef } from 'react';

interface WeightPickerProps {
  value: number; // value in pounds (default unit)
  onChange: (pounds: number) => void;
  className?: string;
  placeholder?: string;
  showBodyweight?: boolean;
}

const WeightPicker: React.FC<WeightPickerProps> = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Weight',
  showBodyweight = true 
}) => {
  const [unit, setUnit] = useState<'lbs' | 'kg' | 'bw'>('lbs');
  const [displayValue, setDisplayValue] = useState<string>('');
  const isEditingRef = useRef(false);

  useEffect(() => {
    // Only update display value when not actively editing
    if (!isEditingRef.current) {
      if (unit === 'kg') {
        const converted = Math.round(value * 0.453592 * 10) / 10;
        setDisplayValue(value === 0 ? '' : converted.toString());
      } else if (unit === 'bw') {
        setDisplayValue(value === 0 ? '' : value.toString());
      } else {
        setDisplayValue(value === 0 ? '' : value.toString());
      }
    }
  }, [value, unit]);

  const handleValueChange = (inputValue: string) => {
    isEditingRef.current = true;
    setDisplayValue(inputValue);
    const newValue = parseFloat(inputValue) || 0;
    let pounds = newValue;
    if (unit === 'kg') {
      pounds = newValue * 2.20462; // kg to lbs
    } else if (unit === 'bw') {
      pounds = newValue; // bodyweight multiplier stays as is
    }
    onChange(Math.round(pounds * 10) / 10);
    setTimeout(() => {
      isEditingRef.current = false;
    }, 100);
  };

  const handleUnitChange = (newUnit: 'lbs' | 'kg' | 'bw') => {
    setUnit(newUnit);
    // Convert current value to new unit
    if (newUnit === 'kg') {
      const converted = Math.round(value * 0.453592 * 10) / 10;
      setDisplayValue(value === 0 ? '' : converted.toString());
    } else if (newUnit === 'bw') {
      setDisplayValue(value === 0 ? '' : value.toString());
    } else {
      setDisplayValue(value === 0 ? '' : value.toString());
    }
  };

  return (
    <div className={`weight-picker ${className}`}>
      <input
        type="number"
        value={displayValue}
        onChange={(e) => handleValueChange(e.target.value)}
        min="0"
        step={unit === 'kg' ? '0.5' : '5'}
        className="weight-picker-input"
        placeholder={placeholder}
      />
      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value as 'lbs' | 'kg' | 'bw')}
        className="weight-picker-unit"
      >
        <option value="lbs">lbs</option>
        <option value="kg">kg</option>
        {showBodyweight && <option value="bw">BW</option>}
      </select>
    </div>
  );
};

export default WeightPicker;
