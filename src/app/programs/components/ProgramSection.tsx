import React from 'react';
import { ProgramCard } from './ProgramCard';

// Renamed to ProgramSectionItem to avoid conflicts
interface ProgramSectionItem {
  id: string;
  title: string;
  description: string;
  numWeeks: number; // Changed from weeks: number to match Programs.tsx
  includesNutrition: boolean;
}

interface ProgramSectionProps {
  title: string;
  programs: ProgramSectionItem[]; // Updated to use the renamed interface
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
      </div>
      <div className="programs-container">
        {programs.length > 0 ? (
          <>
            {programs.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
            {showAddButton && (
              <div className="add-program-card" onClick={onAddProgram}>
                <div className="add-program-circle">
                  <span>+</span>
                </div>
                <p>Add New Program</p>
              </div>
            )}
          </>
        ) : (
          <p className="no-programs-message">No programs available.</p>
        )}
      </div>
    </div>
  );
};
