import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AiOutlineProfile } from 'react-icons/ai';
import { Exercise, MeasurementType } from '@seenelm/train-core';
import { useProgramContext } from '../../contexts/ProgramContext';
import { Unit } from '@seenelm/train-core';

interface Props {
  exercise: Exercise;
  editMode: boolean;
  blockIndex: number;
  exerciseIndex: number;
}

const ExerciseItem: React.FC<Props> = ({ exercise, editMode, blockIndex, exerciseIndex }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.order });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [showNotes, setShowNotes] = React.useState(false);
  const { updateExerciseInBlockPartial, removeExerciseFromBlock } = useProgramContext();

  const measurementType = exercise.measurementType || MeasurementType.REPS;
  const isRest = exercise.name?.toLowerCase().includes('rest') || false;
  const hasNotes = !!exercise.notes;

  const updateExercise = (blockIdx: number, exerciseIdx: number, updatedExercise: Partial<Exercise>) => {
    updateExerciseInBlockPartial(blockIdx, exerciseIdx, updatedExercise );
    
  };

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
        <div className="exercise-input-group">
          <label className="exercise-input-label">Name</label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => updateExercise(blockIndex, exerciseIndex, { name: e.target.value })}
            className="exercise-name-input"
            placeholder={isRest ? "Rest" : "Exercise name"}
          />
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
                <input
                  type="number"
                  value={exercise.targetWeight}
                  min={0}
                  onChange={(e) => updateExercise(blockIndex, exerciseIndex, { targetWeight: parseInt(e.target.value) || 0 })}
                  className="weight-input"
                  placeholder={measurementType === MeasurementType.DISTANCE ? 'Distance' : 'Weight'}
                />
              </div>
              <div className="exercise-input-group">
                <label className="exercise-input-label">
                  {measurementType === MeasurementType.TIME ? 'Duration' : 'Reps'}
                </label>
                <input
                  type="number"
                  value={exercise.targetReps}
                  min={1}
                  onChange={(e) => updateExercise(blockIndex, exerciseIndex, { targetReps: parseInt(e.target.value) || 1 })}
                  className="reps-input"
                  placeholder={measurementType === MeasurementType.TIME ? 'Seconds' : 'Reps'}
                />
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
              {exercise.rest && exercise.rest > 0 && (
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
            value={exercise.targetDurationSec || 60}
            onChange={(e) => updateExercise(blockIndex, exerciseIndex, { targetDurationSec: parseInt(e.target.value) || 60 })}
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
              value={exercise.rest || 0}
              onChange={(e) => updateExercise(blockIndex, exerciseIndex, { rest: parseInt(e.target.value) || 0 })}
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
