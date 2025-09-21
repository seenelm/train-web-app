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
      <h3>{program.title}</h3>
      <p>{program.description}</p>
      <p>
        <strong>Length:</strong> {programLength} weeks
      </p>
      <p>
        <strong>Nutrition:</strong> {program.includesNutrition ? 'Yes' : 'No'}
      </p>
    </div>
  );
};
