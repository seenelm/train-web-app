import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import TrainingSession, { WorkoutDetail } from './TrainingSession';

export interface TrainingSessionData {
  date: string;
  title: string;
  duration: string;
  intensity: string;
  workoutDetails: WorkoutDetail[];
}

interface TrainingSessionsProps {
  sessions: TrainingSessionData[];
  onViewAllClick?: () => void;
}

const TrainingSessions: React.FC<TrainingSessionsProps> = ({ sessions, onViewAllClick }) => {
  return (
    <section className="profile-section training-history">
      <div className="section-header">
        <h2>Recent Training Sessions</h2>
        <a href="#" className="view-more-link" onClick={(e) => {
          e.preventDefault();
          if (onViewAllClick) onViewAllClick();
        }}>
          View all <AiOutlineArrowRight />
        </a>
      </div>
      <div className="training-sessions-grid">
        {sessions.map((session, index) => (
          <TrainingSession 
            key={index}
            date={session.date}
            title={session.title}
            duration={session.duration}
            intensity={session.intensity}
            workoutDetails={session.workoutDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default TrainingSessions;
