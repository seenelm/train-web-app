import React from 'react';

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
  return (
    <div className="program-card">
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


