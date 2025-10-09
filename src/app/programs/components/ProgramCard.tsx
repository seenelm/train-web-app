import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoShareOutline, IoTrashOutline } from 'react-icons/io5';

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
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const handleProgramClick = () => {
    console.log('Program being passed to navigation:', program);
    navigate(`/programs/${program.id}`, { state: { program } });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const programUrl = `${window.location.origin}/programs/${program.id}`;
    
    try {
      await navigator.clipboard.writeText(programUrl);
      setShareSuccess(true);
      
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link to clipboard');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log('Delete program:', program.id);
    // TODO: Implement delete functionality
  };

  // Determine the program length
  const programLength = program.numWeeks || 
                       (Array.isArray(program.weeks) ? program.weeks.length : 
                       (typeof program.weeks === 'number' ? program.weeks : 0));

  return (
    <div className="program-card" onClick={handleProgramClick}>
      <div className="program-image-placeholder"></div>
      <div className="program-card-content">
        <div className="program-card-header">
          <h3>{program.title}</h3>
          <div className="program-card-actions">
            <button 
              className={`share-button ${shareSuccess ? 'share-success' : ''}`}
              onClick={handleShare}
              aria-label="Share program"
            >
              {shareSuccess ? '✓ Copied!' : <IoShareOutline />}
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete program"
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>
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
