import React from 'react';
import { useProgramContext } from '../contexts/ProgramContext';
import TimePicker from '../components/workoutBuilder/TimePicker';

interface Props {
  editMode: boolean;
  setHasUnsavedChanges: (hasUnsavedChanges: boolean) => void;
}

const WorkoutDetailsSection: React.FC<Props> = ({ editMode }) => {
  const { state, updateWorkoutRequest } = useProgramContext();
  const workout = state.workoutRequest;

  return (
    <div className="workout-details">
      <h1>{workout.name}</h1>
      <p className="workout-description">{workout.description}</p>

      <div className="workout-meta">
        <div className="duration-section">
          <h3>Duration</h3>
          {editMode ? (
            <TimePicker
              value={(workout.duration || 0) * 60}
              onChange={(seconds) =>
                updateWorkoutRequest({ ...workout, duration: Math.round(seconds / 60) })
              }
              placeholder="Duration"
              defaultUnit="min"
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
