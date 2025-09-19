import React from 'react';
import { useNavigate } from 'react-router';

interface Program {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
}

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const navigate = useNavigate();

  const handleProgramClick = () => {
    navigate(`/programs/${program.id}`, { state: { program } });
  };

  return (
    <div className="program-card" onClick={handleProgramClick}>
      <h3>{program.title}</h3>
      <p>{program.description}</p>
      <p>
        <strong>Length:</strong> {program.weeks} weeks
      </p>
      <p>
        <strong>Nutrition:</strong> {program.includesNutrition ? 'Yes' : 'No'}
      </p>
    </div>
  );
};
