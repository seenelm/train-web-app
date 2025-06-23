import React, { useState, useEffect } from 'react';
import { AchievementItem } from '@seenelm/train-core';

interface AchievementFormProps {
  onChange: (items: AchievementItem[]) => void;
  initialItems?: AchievementItem[];
}

const AchievementForm: React.FC<AchievementFormProps> = ({ onChange, initialItems = [] }) => {
  const [items, setItems] = useState<AchievementItem[]>(initialItems.length > 0 ? initialItems : [{ title: '', date: '', description: '' }]);

  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const handleItemChange = (index: number, field: keyof AchievementItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { title: '', date: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="form-item">
          <h3 className="form-item-header">Achievement #{index + 1}</h3>
          {items.length > 1 && (
            <button type="button" onClick={() => removeItem(index)} className="remove-item-btn">
              &times;
            </button>
          )}
          <div className="form-group">
            <label htmlFor={`achievement-title-${index}`}>Title*</label>
            <input
              id={`achievement-title-${index}`}
              type="text"
              value={item.title}
              onChange={(e) => handleItemChange(index, 'title', e.target.value)}
              placeholder="e.g., Trainer of the Year"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={`achievement-date-${index}`}>Date</label>
            <input
              id={`achievement-date-${index}`}
              type="date"
              value={item.date || ''}
              onChange={(e) => handleItemChange(index, 'date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`achievement-description-${index}`}>Description</label>
            <textarea
              id={`achievement-description-${index}`}
              value={item.description || ''}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              placeholder="A brief description of the achievement"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addItem} className="add-item-btn">
        + Add Another Achievement
      </button>
    </div>
  );
};

export default AchievementForm;