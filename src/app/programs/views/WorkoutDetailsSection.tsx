// WorkoutView/components/WorkoutDetailsSection.tsx
import React from 'react';

import { useWorkoutContext } from '../contexts/WorkoutContext';

interface Props {
  // workout: WorkoutRequest;
  editMode: boolean;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}

const WorkoutDetailsSection: React.FC<Props> = ({ editMode }) => {
  const { state,updateWorkoutRequest } = useWorkoutContext();
  const workout = state.workoutRequest;

  return (
    <div className="workout-details">
      <h1>{workout.name}</h1>
      <p className="workout-description">{workout.description}</p>

      <div className="workout-meta">
        <div className="duration-section">
          <h3>Duration</h3>
          {editMode ? (
            <input
              type="number"
              value={workout.duration}
              onChange={(e) =>
                updateWorkoutRequest({ ...workout, duration: parseInt(e.target.value) || 0 })
              }
              className="duration-input"
              min={1}
            />
          ) : (
            <span>{workout.duration} minutes</span>
          )}
        </div>

        {/* <MuscleGroupsEditor
          muscleGroups={workout.muscleGroups}
          editMode={editMode}
          setWorkout={setWorkout}
          workout={workout}
        /> */}
      </div>
    </div>
  );
};

export default WorkoutDetailsSection;
