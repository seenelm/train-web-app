import React, { useState, useEffect } from 'react';
import { GenericItem } from '@seenelm/train-core';

interface GenericSectionFormProps {
  onChange: (items: GenericItem[]) => void;
  initialItems?: GenericItem[];
}

type KeyValuePair = { id: number; key: string; value: string };

const GenericSectionForm: React.FC<GenericSectionFormProps> = ({ onChange, initialItems = [] }) => {
  // We manage an intermediate state that is easier for form manipulation
  const [formState, setFormState] = useState<{ id: number; fields: KeyValuePair[] }[]>(() => {
    const initialState = initialItems.length > 0 ? initialItems : [{}];
    return initialState.map((item, index) => ({
      id: index,
      fields: Object.entries(item).map(([key, value], fieldIndex) => ({
        id: fieldIndex,
        key,
        value: String(value),
      })),
    }));
  });

  useEffect(() => {
    // Convert our form-friendly state to the GenericItem[] format for the parent
    const genericItems: GenericItem[] = formState.map(item =>
      item.fields.reduce((acc, field) => {
        if (field.key) {
          acc[field.key] = field.value;
        }
        return acc;
      }, {} as GenericItem)
    );
    onChange(genericItems);
  }, [formState, onChange]);

  const handleFieldChange = (itemIndex: number, fieldId: number, part: 'key' | 'value', val: string) => {
    const newFormState = [...formState];
    const item = newFormState[itemIndex];
    const field = item.fields.find(f => f.id === fieldId);
    if (field) {
      field[part] = val;
      setFormState(newFormState);
    }
  };

  const addField = (itemIndex: number) => {
    const newFormState = [...formState];
    const item = newFormState[itemIndex];
    item.fields.push({ id: Date.now(), key: '', value: '' });
    setFormState(newFormState);
  };

  const removeField = (itemIndex: number, fieldId: number) => {
    const newFormState = [...formState];
    const item = newFormState[itemIndex];
    item.fields = item.fields.filter(f => f.id !== fieldId);
    setFormState(newFormState);
  };

  const addItem = () => {
    setFormState([...formState, { id: Date.now(), fields: [{ id: Date.now(), key: '', value: '' }] }]);
  };

  const removeItem = (itemId: number) => {
    if (formState.length > 1) {
      setFormState(formState.filter(item => item.id !== itemId));
    }
  };

  return (
    <div>
      {formState.map((item, itemIndex) => (
        <div key={item.id} className="form-item">
          <h3 className="form-item-header">Item #{itemIndex + 1}</h3>
           {formState.length > 1 && (
            <button type="button" onClick={() => removeItem(item.id)} className="remove-item-btn">
              &times;
            </button>
          )}
          {item.fields.map((field) => (
            <div key={field.id} className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                value={field.key}
                onChange={(e) => handleFieldChange(itemIndex, field.id, 'key', e.target.value)}
                placeholder="Field Name (e.g., Area)"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleFieldChange(itemIndex, field.id, 'value', e.target.value)}
                placeholder="Field Value (e.g., Strength Training)"
              />
              <button type="button" onClick={() => removeField(itemIndex, field.id)} className="remove-field-btn" style={{position: 'static'}}>
                &times;
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addField(itemIndex)} className="add-field-btn">
            + Add Field
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="add-item-btn">
        + Add Another Item
      </button>
    </div>
  );
};

export default GenericSectionForm;