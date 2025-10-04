import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import './ProgramView.css';

interface Week {
  id: string;
  weekNumber: number;
}

// interface Program {
//   id: string;
//   title?: string;
//   description?: string;
//   weeks?: Week[];
//   includesNutrition?: boolean;
//   name?: string;
//   numWeeks?: number;
//   hasNutritionProgram?: boolean;
//   phases?: Array<{
//     name: string;
//     startWeek: number;
//     endWeek: number;
//   }>;
//   types?: string[];
// }

const ProgramView: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const location = useLocation();
  const [program, setProgram] = useState<Program | null>(null);
  const [weekCards, setWeekCards] = useState<Week[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  interface Program {
    id: string;
    title?: string;
    description?: string;
    weeks?: Week[];
    includesNutrition?: boolean;
    name?: string;
    numWeeks?: number;
    hasNutritionProgram?: boolean;
    phases?: Array<{
      name: string;
      startWeek: number;
      endWeek: number;
    }>;
    types?: string[];
  }
  
  useEffect(() => {
    const programFromState = location.state?.program as Program;
    if (programFromState) {
      setProgram(programFromState);
      setLoading(false);
    } else if (programId) {
      // fetch program here later
      setLoading(false);
    }
  }, [location.state, programId]);
  
  useEffect(() => {
    if (program) {
      if (Array.isArray(program.weeks)) {
        console.log('Weeks is an array: ', program.weeks);
        setWeekCards(program.weeks);
      } else {
        setWeekCards([]);
      }
    }
  }, [program]);

  // Function to handle week card click
  const handleWeekClick = (weekId: string) => {
    console.log('DEBUG - Week clicked with ID:', weekId);
    navigate(`/programs/${programId}/weeks/${weekId}`);
  };

  if (loading) {
    return <div className="loading-container">Loading program details...</div>;
  }

  if (!program) {
    return <div className="error-container">Program not found</div>;
  }

  console.log('DEBUG - Week cards for rendering:', weekCards);

  return (
    <div className="program-view">
      <div className="program-header">
        <h1>{program.name || program.title}</h1>
        <div className="program-meta">
          <span className="program-duration">
            {program.numWeeks || (typeof program.weeks === 'number' ? program.weeks : weekCards.length)} weeks
          </span>
          {(program.includesNutrition || program.hasNutritionProgram) && (
            <span className="program-nutrition">Includes nutrition plan</span>
          )}
          {program.types && program.types.length > 0 && (
            <span className="program-types">
              Types: {program.types.join(', ')}
            </span>
          )}
        </div>
        <p className="program-description">{program.description}</p>
      </div>
      
      {weekCards.length > 0 ? (
        <div className="program-weeks">
          <h2>Program Schedule</h2>
          <div className="weeks-grid">
            {weekCards
              .sort((a, b) => a.weekNumber - b.weekNumber)
              .map(week => (
                <div 
                  key={week.id} 
                  className="week-card" 
                  onClick={() => handleWeekClick(week.id)}
                >
                  <div className="week-image-placeholder"></div>
                  <div className="week-content">
                    <h3>Week {week.weekNumber}</h3>
                    <div className="week-description">
                      Build strength and endurance
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="no-weeks">
          <p>No detailed schedule available for this program yet.</p>
          <p>Debug info: {JSON.stringify({ 
            weeks: program.weeks, 
            numWeeks: program.numWeeks,
            weekCardsLength: weekCards.length
          })}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramView;
