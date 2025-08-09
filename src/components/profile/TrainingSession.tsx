import React from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';

export interface WorkoutDetail {
  description: string;
}

export interface TrainingSessionProps {
  date: string;
  title: string;
  duration: string;
  intensity: string;
  workoutDetails: WorkoutDetail[];
}

const TrainingSession: React.FC<TrainingSessionProps> = ({
  date,
  title,
  duration,
  intensity,
  workoutDetails
}) => {
  return (
    <div className="training-session-card">
      <div className="session-date">
        <AiOutlineCalendar /> {date}
      </div>
      <h3>{title}</h3>
      <div className="session-details">
        <div className="session-stat">
          <span className="stat-label">Duration</span>
          <span className="stat-value">{duration}</span>
        </div>
        <div className="session-stat">
          <span className="stat-label">Intensity</span>
          <span className="stat-value">{intensity}</span>
        </div>
      </div>
      <div className="session-workout">
        {workoutDetails.map((detail, index) => (
          <p key={index}>{detail.description}</p>
        ))}
      </div>
    </div>
  );
};

export default TrainingSession;
