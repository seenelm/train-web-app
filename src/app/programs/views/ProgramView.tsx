import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import './ProgramView.css';

interface Program {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
}

interface ProgramDetails {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
  // Additional details that might be available in the full program view
  weekDetails?: Array<{
    weekNumber: number;
    title: string;
    description: string;
    workouts: number;
    completed: number;
    image?: string;
  }>;
}

const ProgramView: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const location = useLocation();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get program data from location state
    const programFromState = location.state?.program as Program;
    
    if (programFromState) {
      // Generate week details based on numWeeks
      const generatedWeekDetails = Array.from({ length: programFromState.weeks }, (_, i) => ({
        weekNumber: i + 1,
        title: `Week ${i + 1}`,
        description: `Week ${i + 1} of your ${programFromState.title} program.`,
        workouts: 3, // Default number of workouts
        completed: 0, // Default to none completed
        image: `https://images.unsplash.com/photo-${1517836357463 + i * 1000}-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80` // Random image
      }));
      
      // Create program details with generated week details
      const programDetails: ProgramDetails = {
        ...programFromState,
        weekDetails: generatedWeekDetails
      };
      
      setProgram(programDetails);
      setLoading(false);
    } else if (programId) {
      // If no state is available but we have programId, we could fetch from API here
      // For now, just set loading to false
      setLoading(false);
    }
  }, [location.state, programId]);

  // Function to handle week card click
  const handleWeekClick = (weekNumber: number) => {
    navigate(`/programs/${programId}/weeks/${weekNumber}`);
  };

  if (loading) {
    return <div className="loading-container">Loading program details...</div>;
  }

  if (!program) {
    return <div className="error-container">Program not found</div>;
  }

  return (
    <div className="program-view">
      <div className="program-header">
        <h1>{program.title}</h1>
        <div className="program-meta">
          <span className="program-duration">{program.weeks} weeks</span>
          {program.includesNutrition && (
            <span className="program-nutrition">Includes nutrition plan</span>
          )}
        </div>
        <p className="program-description">{program.description}</p>
      </div>
      
      {program.weekDetails && program.weekDetails.length > 0 ? (
        <div className="program-weeks">
          <h2>Program Schedule</h2>
          <div className="weeks-container">
            {program.weekDetails.map(week => (
              <div 
                key={week.weekNumber} 
                className="week-card" 
                onClick={() => handleWeekClick(week.weekNumber)}
              >
                {week.image && (
                  <div className="week-image" style={{ backgroundImage: `url(${week.image})` }}></div>
                )}
                <div className="week-content">
                  <h3>Week {week.weekNumber}: {week.title}</h3>
                  <p>{week.description}</p>
                  <div className="week-stats">
                    <div className="workout-count">
                      <strong>Workouts:</strong> {week.workouts}
                    </div>
                    <div className="progress-container">
                      <div className="progress-label">
                        <strong>Progress:</strong> {week.completed}/{week.workouts}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(week.completed / week.workouts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-weeks">
          <p>No detailed schedule available for this program yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProgramView;
