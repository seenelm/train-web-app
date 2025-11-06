import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AiOutlineProfile } from 'react-icons/ai';
import { Exercise, MeasurementType } from '@seenelm/train-core';
import { useProgramContext } from '../../contexts/ProgramContext';
import { Unit } from '@seenelm/train-core';
import TimePicker from './TimePicker';
import WeightPicker from './WeightPicker';

interface Props {
  exercise: Exercise;
  editMode: boolean;
  blockIndex: number;
  exerciseIndex: number;
}

const ExerciseItem: React.FC<Props> = ({ exercise, editMode, blockIndex, exerciseIndex }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.order });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [showNotes, setShowNotes] = useState(false);
  const [exerciseSuggestions, setExerciseSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { updateExerciseInBlockPartial, removeExerciseFromBlock } = useProgramContext();

  const measurementType = exercise.measurementType || MeasurementType.REPS;
  const isRest = exercise.name?.toLowerCase().includes('rest') || false;
  const hasNotes = !!exercise.notes;

  const updateExercise = (blockIdx: number, exerciseIdx: number, updatedExercise: Partial<Exercise>) => {
    updateExerciseInBlockPartial(blockIdx, exerciseIdx, updatedExercise );
    
  };

  const searchExercises = async (query: string) => {
    if (!query || query.length < 2) {
      setExerciseSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    
    // Skip API call if no key is configured
    if (!apiKey) {
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${query}?limit=10`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExerciseSuggestions(data);
        setShowSuggestions(true);
      } else {
        // Silently fail for 401, 429, etc.
        console.warn(`Exercise API returned ${response.status}`);
        setExerciseSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Don't show suggestions on error
      setExerciseSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleNameChange = (value: string) => {
    updateExercise(blockIndex, exerciseIndex, { name: value });
    
    // Debounce API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      searchExercises(value);
    }, 300);
  };

  const selectExercise = (exerciseName: string) => {
    updateExercise(blockIndex, exerciseIndex, { name: exerciseName });
    setShowSuggestions(false);
    setExerciseSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div ref={setNodeRef} style={style} className={`exercise-item ${isRest ? 'rest-item' : ''}`} {...attributes}>
      {/* <div className="exercise-check">
        <input
          type="checkbox"
          checked={exercise.completed}
          onChange={() => updateExercise(blockIndex, exerciseIndex, { completed: !exercise.completed })}
        />
      </div> */}

      {editMode && <span className="drag-handle" {...listeners}>☰</span>}

      {editMode ? (
        <div className="exercise-input-group" style={{ position: 'relative' }}>
          <label className="exercise-input-label">Name</label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="exercise-name-input"
            placeholder={isRest ? "Rest" : "Exercise name"}
          />
          {showSuggestions && exerciseSuggestions.length > 0 && (
            <div className="exercise-suggestions">
              {isLoadingSuggestions && <div className="suggestion-loading">Loading...</div>}
              {exerciseSuggestions.map((ex, idx) => (
                <div
                  key={idx}
                  className="exercise-suggestion-item"
                  onClick={() => selectExercise(ex.name)}
                >
                  <span className="suggestion-name">{ex.name}</span>
                  <span className="suggestion-target">{ex.target}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="exercise-name-with-notes">
          <span className="exercise-name">{exercise.name}</span>
          {!isRest && exercise.notes && (
            <>
              <span className="notes-separator"> • </span>
              <span className="notes-text">{exercise.notes}</span>
            </>
          )}
        </div>
      )}

      {!isRest && editMode && (
        <div className="exercise-input-group">
          <label className="exercise-input-label">Type</label>
          <select
            value={measurementType}
            onChange={(e) => updateExercise(blockIndex, exerciseIndex, { measurementType: e.target.value as MeasurementType })}
            className="measurement-type-select"
          >
            <option value={MeasurementType.REPS}>Reps</option>
            <option value={MeasurementType.TIME}>Time</option>
            <option value={MeasurementType.DISTANCE}>Distance</option>
            <option value={MeasurementType.BODYWEIGHT}>Bodyweight</option>
          </select>
        </div>
      )}

      {!isRest && (
        <>
          {editMode ? (
            <>
              <div className="exercise-input-group">
                <label className="exercise-input-label">
                  {measurementType === MeasurementType.DISTANCE ? 'Distance' : 'Weight'}
                </label>
                <WeightPicker
                  value={exercise.targetWeight || 0}
                  onChange={(weight) => updateExercise(blockIndex, exerciseIndex, { targetWeight: weight })}
                  placeholder={measurementType === MeasurementType.DISTANCE ? 'Distance' : 'Weight'}
                  showBodyweight={measurementType !== MeasurementType.DISTANCE}
                />
              </div>
              <div className="exercise-input-group">
                <label className="exercise-input-label">
                  {measurementType === MeasurementType.TIME ? 'Duration' : 'Reps'}
                </label>
                {measurementType === MeasurementType.TIME ? (
                  <TimePicker
                    value={exercise.targetReps || 0}
                    onChange={(seconds) => updateExercise(blockIndex, exerciseIndex, { targetReps: seconds })}
                    placeholder="Duration"
                    defaultUnit="min"
                  />
                ) : (
                  <input
                    type="number"
                    value={exercise.targetReps || ''}
                    min={1}
                    onChange={(e) => updateExercise(blockIndex, exerciseIndex, { targetReps: parseInt(e.target.value) || 0 })}
                    className="reps-input"
                    placeholder="Reps"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="exercise-values-group">
              <div className="exercise-value-display">
                <span className="exercise-value">{exercise.targetWeight}</span>
                <span className="exercise-unit">{Unit.POUND}</span>
              </div>
              <div className="exercise-value-display">
                <span className="exercise-value">{exercise.targetReps}</span>
                <span className="exercise-unit">{measurementType === MeasurementType.TIME ? 'sec' : 'reps'}</span>
              </div>
              {exercise.rest != null && exercise.rest > 0 && (
                <div className="exercise-value-display">
                  <span className="exercise-value">{exercise.rest}</span>
                  <span className="exercise-unit">sec rest</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isRest && !editMode && (
        <div className="exercise-values-group">
          <div className="exercise-value-display">
            <span className="exercise-value">{exercise.targetDurationSec || 60}</span>
            <span className="exercise-unit">seconds</span>
          </div>
        </div>
      )}

      {isRest && editMode && (
        <div className="exercise-input-group">
          <label className="exercise-input-label">Duration</label>
          <input
            type="number"
            value={exercise.targetDurationSec || ''}
            onChange={(e) => updateExercise(blockIndex, exerciseIndex, { targetDurationSec: parseInt(e.target.value) || 0 })}
            className="reps-input"
            placeholder="Seconds"
          />
        </div>
      )}

      {editMode && (
        <>
          <div className="exercise-input-group">
            <label className="exercise-input-label">Rest</label>
            <TimePicker
              value={exercise.rest || 0}
              onChange={(seconds) => updateExercise(blockIndex, exerciseIndex, { rest: seconds })}
              placeholder="Rest"
            />
          </div>
          {!isRest && (
            <div className="exercise-input-group">
              <label className="exercise-input-label">Notes</label>
              <button
                className={`notes-toggle-btn ${hasNotes ? 'has-notes' : ''}`}
                onClick={() => setShowNotes(!showNotes)}
                title={hasNotes ? "Edit note" : "Add note"}
              >
                <AiOutlineProfile fontSize="large" />
              </button>
            </div>
          )}
          {!showNotes && (
            <button
              className="remove-exercise-btn"
              onClick={() => removeExerciseFromBlock(blockIndex, exerciseIndex)}
            >
              ✕
            </button>
          )}
          {!isRest && showNotes && (
            <div className="exercise-input-group">
              <div className="exercise-notes-container">
                <input
                  type="text"
                  value={exercise.notes || ''}
                  onChange={(e) => updateExercise(blockIndex, exerciseIndex, { notes: e.target.value })}
                  className="exercise-notes-input"
                  placeholder="Add note..."
                />
                <button
                  className="remove-exercise-btn"
                  onClick={() => removeExerciseFromBlock(blockIndex, exerciseIndex)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseItem;
