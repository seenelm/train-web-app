import React from 'react';
import { useNavigate } from 'react-router';

interface Program {
  id: string;
  title: string;
  description: string;
  weeks?: any; // Can be array or number
  numWeeks?: number;
  includesNutrition: boolean;
}

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const navigate = useNavigate();

  const handleProgramClick = () => {
    console.log('Program being passed to navigation:', program);
    navigate(`/programs/${program.id}`, { state: { program } });
  };

  // Determine the program length
  const programLength = program.numWeeks || 
                       (Array.isArray(program.weeks) ? program.weeks.length : 
                       (typeof program.weeks === 'number' ? program.weeks : 0));

  return (
    <div className="program-card" onClick={handleProgramClick}>
      <div className="program-image-placeholder"></div>
      <div className="program-card-content">
        <h3>{program.title}</h3>
        <p className="program-card-description">{program.description}</p>
        <div className="program-card-meta">
          <span className="program-length">{programLength} weeks</span>
          {program.includesNutrition && (
            <span className="program-nutrition">Nutrition included</span>
          )}
        </div>
      </div>
    </div>
  );
};
