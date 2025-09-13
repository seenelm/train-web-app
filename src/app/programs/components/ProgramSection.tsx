import React from 'react';
import { ProgramCard } from './ProgramCard';
import Button from '../../../components/ui/Button';

interface Program {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
}

interface ProgramSectionProps {
  title: string;
  programs: Program[];
  showAddButton?: boolean;
  onAddProgram?: () => void;
}

export const ProgramSection: React.FC<ProgramSectionProps> = ({ 
  title, 
  programs, 
  showAddButton = false, 
  onAddProgram 
}) => {
  return (
    <div className="program-section">
      <div className="programs-header">
        <h2>{title}</h2>
        {showAddButton && (
          <Button 
            variant="primary" 
            className="add-program-btn"
            onClick={onAddProgram}
          >
            Add Program
          </Button>
        )}
      </div>
      <div className="programs-container">
        {programs.length > 0 ? (
          programs.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))
        ) : (
          <p className="no-programs-message">No programs available.</p>
        )}
      </div>
    </div>
  );
};
