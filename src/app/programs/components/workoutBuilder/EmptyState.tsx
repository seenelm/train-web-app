// WorkoutView/components/EmptyState.tsx
import React from 'react';

interface Props {
  isOwner: boolean;
  onStart: () => void;
}

const EmptyState: React.FC<Props> = ({ isOwner, onStart }) => (
  <div className="empty-state">
    <p>No circuits added yet.</p>
    {isOwner && (
      <button className="add-circuit-btn" onClick={onStart}>
        Start Building Workout
      </button>
    )}
  </div>
);

export default EmptyState;
