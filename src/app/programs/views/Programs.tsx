import { ProgramSection } from '../components/ProgramSection';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import "./Programs.css"
import { programService } from '../services/programService';
import { tokenService } from '../../../services/tokenService';
import { ProgramResponse, ProfileAccess } from '@seenelm/train-core';
import { useProgramContext } from '../contexts/ProgramContext';

const Programs: React.FC = () => {
  const navigate = useNavigate();

  const { 
    state, 
    setProgramsLoading, 
    setProgramsError, 
    setPrograms,
    clearCurrentProgram,
    clearCurrentWeek,
    clearCurrentWorkout
  } = useProgramContext();
  
  useEffect(() => {
    return () => {
      clearCurrentProgram();
      clearCurrentWeek();
      clearCurrentWorkout();
      setProgramsLoading(false);
      setProgramsError(null);
    };
  }, []); 
  
  // Favorite programs (static for now)
  const favoritePrograms: ProgramResponse[] = [
    {
      id: '1',
      name: 'Strength Training Basics',
      description: 'A 6-week program focused on building foundational strength.',
      numWeeks: 6,
      weeks: [
        { id: '1', weekNumber: 1 },
        { id: '2', weekNumber: 2 },
        { id: '3', weekNumber: 3 },
        { id: '4', weekNumber: 4 },
        { id: '5', weekNumber: 5 },
        { id: '6', weekNumber: 6 },
      ],
      hasNutritionProgram: false,
      accessType: ProfileAccess.Public,
      admins: [],
      createdBy: '',
    },
    {
      id: '2',
      name: 'Lean & Clean',
      description: '8 weeks of workouts paired with nutrition guidance.',
      numWeeks: 8,
      weeks: [
        { id: '1', weekNumber: 1 },
        { id: '2', weekNumber: 2 },
        { id: '3', weekNumber: 3 },
        { id: '4', weekNumber: 4 },
        { id: '5', weekNumber: 5 },
        { id: '6', weekNumber: 6 },
        { id: '7', weekNumber: 7 },
        { id: '8', weekNumber: 8 },
      ],
      hasNutritionProgram: true,
      accessType: ProfileAccess.Public,
      admins: [],
      createdBy: '',
    }
  ];
  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        
        // Get user ID from token service
        const userString = tokenService.getUser();
        if (!userString) {
          throw new Error("User not logged in");
        }
        
        const userData = JSON.parse(userString);
        
        // Fetch programs with pagination
        const programsData = await programService.fetchUserPrograms(userData.userId);
        
        
        // Debug the API response
        // console.log('API response - programsData:', programsData);
        // if (programsData.length > 0) {
        //   console.log('First program weeks type:', typeof programsData[0].weeks);
        //   console.log('First program weeks value:', programsData[0].weeks);
        // }
        
        // Map programs to add default description if missing
        const mappedPrograms = programsData.map((program: ProgramResponse) => ({
          ...program,
          description: program.description || 
            `A ${program.numWeeks}-week program${program.hasNutritionProgram ? ' with nutrition guidance' : ''}.`
        }));
        
        setPrograms(mappedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setProgramsError("Failed to load programs. Please try again.");
      } finally {
        setProgramsLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);
  
  const handleAddProgram = () => {
    // Navigate to the program builder
    navigate('/programs/builder');
  };

  const handleDeleteProgram = (programId: string) => {
    setPrograms(state.programs.filter(program => program.id !== programId));
  };

  if (state.programsLoading) {
    return <div className="loading-container">Loading programs...</div>;
  }

  if (state.programsError) {
    return <div className="error-container">{state.programsError}</div>;
  }

  return (
    <div className="programs-page">
      <ProgramSection 
        title="Favorite Programs" 
        programs={favoritePrograms} 
      />
      
      <ProgramSection 
        title="All Programs" 
        programs={state.programs}
        showAddButton={true}
        onAddProgram={handleAddProgram}
        onDeleteProgram={handleDeleteProgram}
      />
    </div>
  );
};

export default Programs;
