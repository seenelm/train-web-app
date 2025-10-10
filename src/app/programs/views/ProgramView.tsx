import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import './ProgramView.css';
import { programService } from '../services/programService';
import { IoShareOutline, IoTrashOutline } from 'react-icons/io5';
import { useProgramContext } from '../contexts/ProgramContext';
import { ProgramResponse } from '@seenelm/train-core';

interface Week {
  id: string;
  weekNumber: number;
}

const ProgramView: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const location = useLocation();
  const [weekCards, setWeekCards] = useState<Week[]>([]);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [isDeletingWeek, setIsDeletingWeek] = useState<boolean>(false);
  const navigate = useNavigate();
  const { 
    state, 
    setProgramsLoading, 
    setProgramsError,
    clearCurrentProgram, 
    clearCurrentWeek,  
    setCurrentProgram 
  } = useProgramContext();

  useEffect(() => {
    return () => {
      clearCurrentProgram();
      clearCurrentWeek();
      setProgramsLoading(false);
      setProgramsError(null);
    };
  }, []); 

  useEffect(() => {
    const fetchProgram = async () => {
      const programFromState = location.state?.program as ProgramResponse;
      if (programFromState) {
        setCurrentProgram(programFromState);
        setProgramsLoading(false);
      } else if (programId) {
        // Fetch program from API when not available in state
        try {
          const fetchedProgram = await programService.getProgramById(programId);
          setCurrentProgram(fetchedProgram);
          setProgramsLoading(false);
        } catch (error) {
          console.error('Error fetching program:', error);
          setProgramsLoading(false);
        }
      }
    };
    
    fetchProgram();
  }, [location.state, programId]);
  
  useEffect(() => {
    if (state.currentProgram) {
      if (Array.isArray(state.currentProgram.weeks)) {
        console.log('Weeks is an array: ', state.currentProgram.weeks);
        setWeekCards(state.currentProgram.weeks);
      } else {
        setWeekCards([]);
      }
    }
  }, [state.currentProgram]);

  // Function to handle week card click
  const handleWeekClick = (weekId: string) => {
    console.log('DEBUG - Week clicked with ID:', weekId);
    navigate(`/programs/${programId}/weeks/${weekId}`);
  };

  // Function to handle delete week
  const handleDeleteWeek = async (weekId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the week card click
    setIsDeletingWeek(true);
    try {
      await programService.deleteWeek(programId!, weekId);
      
      // Remove the week from local state
      setWeekCards(prevWeeks => 
        prevWeeks.filter(week => week.id !== weekId)
      );
    } catch (error) {
      console.error('Error deleting week:', error);
    } finally {
      setIsDeletingWeek(false);
    }
  };

  // Function to handle share
  const handleShare = async () => {
    const programUrl = `${window.location.origin}/programs/${programId}`;
    
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

  // Function to handle back to programs
  const handleBackToPrograms = () => {
    clearCurrentProgram();
    navigate('/programs');
  };

  // Function to handle delete
  const handleDelete = async () => {
    console.log('Delete program:', programId);
    if (!programId) {
      console.error('Program ID is required');
      return;
    }
    
    try {
      await programService.deleteProgram(programId);
      navigate('/programs');
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  if (state.programsLoading) {
    return <div className="loading-container">Loading program details...</div>;
  }

  if (!state.currentProgram) {
    return <div className="error-container">Program not found</div>;
  }

  console.log('DEBUG - Week cards for rendering:', weekCards);

  return (
    <div className="program-view">
      <button className="back-button" onClick={handleBackToPrograms}>
        &larr; Back to Programs
      </button>
      <div className="program-header">
        <div className="program-header-top">
          <h1>{state.currentProgram.name || state.currentProgram.name}</h1>
          <div className="program-header-actions">
            <button 
              className={`share-button ${shareSuccess ? 'share-success' : ''}`}
              onClick={handleShare}
              aria-label="Share program"
            >
              <IoShareOutline /> {shareSuccess ? 'Copied!' : 'Share'}
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete program"
            >
              <IoTrashOutline /> Delete
            </button>
          </div>
        </div>
        <div className="program-meta">
          <span className="program-duration">
            {state.currentProgram.numWeeks || (typeof state.currentProgram.weeks === 'number' ? state.currentProgram.weeks : weekCards.length)} weeks
          </span>
          {(state.currentProgram.hasNutritionProgram) && (
            <span className="program-nutrition">Includes nutrition plan</span>
          )}
          {state.currentProgram.types && state.currentProgram.types.length > 0 && (
            <span className="program-types">
              Types: {state.currentProgram.types.join(', ')}
            </span>
          )}
        </div>
        <p className="program-description">{state.currentProgram.description}</p>
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
                    <div className="week-card-header">
                      <h3>Week {week.weekNumber}</h3>
                      <div className="week-card-actions">
                        <button 
                          className="delete-button"
                          onClick={(e) => handleDeleteWeek(week.id, e)}
                          aria-label="Delete week"
                        >
                          {isDeletingWeek ? '...' : <IoTrashOutline />}
                        </button>
                      </div>
                    </div>
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
            weeks: state.currentProgram.weeks, 
            numWeeks: state.currentProgram.numWeeks,
            weekCardsLength: weekCards.length
          })}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramView;
