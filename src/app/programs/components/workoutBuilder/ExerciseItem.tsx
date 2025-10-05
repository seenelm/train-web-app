// WorkoutView/components/ExerciseItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Exercise, Block } from '../../views/types';
import { AiOutlineProfile } from 'react-icons/ai';

interface Props {
  exercise: Exercise;
  circuit: Block;
  editMode: boolean;
  updateCircuit: (updated: Block) => void;
}

const ExerciseItem: React.FC<Props> = ({ exercise, circuit, editMode, updateCircuit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [showNotes, setShowNotes] = React.useState(false);

  const updateExercise = (updates: Partial<Exercise>) => {
    const updated = {
      ...circuit,
      exercises: circuit.exercises.map((e) =>
        e.id === exercise.id ? { ...e, ...updates } : e
      ),
    };
    updateCircuit(updated);
  };

  const measurementType = (exercise as any).measurementType || 'reps';
  const isRest = (exercise as any).isRest || false;
  const hasNotes = !!(exercise as any).notes;

  return (
    <div ref={setNodeRef} style={style} className={`exercise-item ${exercise.completed ? 'completed' : ''} ${isRest ? 'rest-item' : ''}`} {...attributes}>
      <div className="exercise-check">
        <input
          type="checkbox"
          checked={exercise.completed}
          onChange={() => updateExercise({ completed: !exercise.completed })}
        />
      </div>

      {editMode && <span className="drag-handle" {...listeners}>☰</span>}

      {editMode ? (
        <div className="exercise-input-group">
          <label className="exercise-input-label">Name</label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => updateExercise({ name: e.target.value })}
            className="exercise-name-input"
            placeholder={isRest ? "Rest" : "Exercise name"}
          />
        </div>
      ) : (
        <div className="exercise-name-with-notes">
          <span className="exercise-name">{exercise.name}</span>
          {!isRest && (exercise as any).notes && (
            <>
              <span className="notes-separator"> • </span>
              <span className="notes-text">{(exercise as any).notes}</span>
            </>
          )}
        </div>
      )}

      {!isRest && editMode && (
        <div className="exercise-input-group">
          <label className="exercise-input-label">Type</label>
          <select
            value={measurementType}
            onChange={(e) => updateExercise({ measurementType: e.target.value as any })}
            className="measurement-type-select"
          >
            <option value="reps">Reps</option>
            <option value="time">Time</option>
            <option value="distance">Distance</option>
            <option value="bodyweight">Bodyweight</option>
          </select>
        </div>
      )}

      {!isRest && (
        <>
          {editMode ? (
            <>
              <div className="exercise-input-group">
                <label className="exercise-input-label">
                  {measurementType === 'distance' ? 'Distance' : 'Weight'}
                </label>
                <input
                  type="number"
                  value={exercise.weight}
                  min={0}
                  onChange={(e) => updateExercise({ weight: parseInt(e.target.value) || 0 })}
                  className="weight-input"
                  placeholder={measurementType === 'distance' ? 'Distance' : 'Weight'}
                />
              </div>
              <div className="exercise-input-group">
                <label className="exercise-input-label">
                  {measurementType === 'time' ? 'Duration' : 'Reps'}
                </label>
                <input
                  type="number"
                  value={exercise.reps}
                  min={1}
                  onChange={(e) => updateExercise({ reps: parseInt(e.target.value) || 1 })}
                  className="reps-input"
                  placeholder={measurementType === 'time' ? 'Seconds' : 'Reps'}
                />
              </div>
            </>
          ) : (
            <div className="exercise-values-group">
              <div className="exercise-value-display">
                <span className="exercise-value">{exercise.weight}</span>
                <span className="exercise-unit">{exercise.weightUnit}</span>
              </div>
              <div className="exercise-value-display">
                <span className="exercise-value">{exercise.reps}</span>
                <span className="exercise-unit">{measurementType === 'time' ? 'sec' : 'reps'}</span>
              </div>
              {(exercise as any).restDuration > 0 && (
                <div className="exercise-value-display">
                  <span className="exercise-value">{(exercise as any).restDuration}</span>
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
            <span className="exercise-value">{(exercise as any).duration || 60}</span>
            <span className="exercise-unit">seconds</span>
          </div>
        </div>
      )}

      {isRest && editMode && (
        <div className="exercise-input-group">
          <label className="exercise-input-label">Duration</label>
          <input
            type="number"
            value={(exercise as any).duration || 60}
            onChange={(e) => updateExercise({ duration: parseInt(e.target.value) || 60 } as any)}
            className="reps-input"
            placeholder="Seconds"
          />
        </div>
      )}

      {editMode && (
        <>
          <div className="exercise-input-group">
            <label className="exercise-input-label">Rest</label>
            <input
              type="number"
              value={(exercise as any).restDuration || 0}
              onChange={(e) => updateExercise({ restDuration: parseInt(e.target.value) || 0 } as any)}
              className="rest-input"
              placeholder="Seconds"
              min={0}
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
              onClick={() =>
                updateCircuit({
                  ...circuit,
                  exercises: circuit.exercises.filter((e) => e.id !== exercise.id),
                })
              }
            >
              ✕
            </button>
          )}
          
          {!isRest && showNotes && (
            <div className="exercise-input-group">
              <div className="exercise-notes-container">
                <input
                  type="text"
                  value={(exercise as any).notes || ''}
                  onChange={(e) => updateExercise({ notes: e.target.value } as any)}
                  className="exercise-notes-input"
                  placeholder="Add note..."
                />
                <button
                  className="remove-exercise-btn"
                  onClick={() =>
                    updateCircuit({
                      ...circuit,
                      exercises: circuit.exercises.filter((e) => e.id !== exercise.id),
                    })
                  }
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
