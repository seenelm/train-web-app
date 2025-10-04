// WorkoutView/components/WorkoutDetailsSection.tsx
import React from 'react';
import MuscleGroupsEditor from '../components/workoutBuilder/MuscleGroupsEditor';
import { WorkoutDetails } from './types';

interface Props {
  workout: WorkoutDetails;
  editMode: boolean;
  setWorkout: (updated: WorkoutDetails) => void;
}

const WorkoutDetailsSection: React.FC<Props> = ({ workout, editMode, setWorkout }) => {
  return (
    <div className="workout-details">
      <h1>{workout.title}</h1>
      <p className="workout-description">{workout.description}</p>

      <div className="workout-meta">
        <div className="duration-section">
          <h3>Duration</h3>
          {editMode ? (
            <input
              type="number"
              value={workout.duration}
              onChange={(e) =>
                setWorkout({ ...workout, duration: parseInt(e.target.value) || 0 })
              }
              className="duration-input"
              min={1}
            />
          ) : (
            <span>{workout.duration} minutes</span>
          )}
        </div>

        <MuscleGroupsEditor
          muscleGroups={workout.muscleGroups}
          editMode={editMode}
          setWorkout={setWorkout}
          workout={workout}
        />
      </div>
    </div>
  );
};

export default WorkoutDetailsSection;
