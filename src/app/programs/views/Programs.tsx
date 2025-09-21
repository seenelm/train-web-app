import { ProgramSection } from '../components/ProgramSection';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import "./Programs.css"
import { programService } from '../services/programService';
import { tokenService } from '../../../services/tokenService';
import { ProgramResponse } from '@seenelm/train-core';

interface Program {
  id: string;
  title: string;
  description: string;
  numWeeks: number;
  weeks: Week[];
  includesNutrition: boolean;
}

const Programs = () => {
  const navigate = useNavigate();
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Favorite programs (static for now)
  const favoritePrograms: Program[] = [
    {
      id: '1',
      title: 'Strength Training Basics',
      description: 'A 6-week program focused on building foundational strength.',
      numWeeks: 6,
      weeks: [  { id: '1', weekNumber: 1 }, { id: '2', weekNumber: 2 }, { id: '3', weekNumber: 3 }, { id: '4', weekNumber: 4 }, { id: '5', weekNumber: 5 }, { id: '6', weekNumber: 6 }],
      includesNutrition: false,
    },
    {
      id: '2',
      title: 'Lean & Clean',
      description: '8 weeks of workouts paired with nutrition guidance.',
      numWeeks: 8,
      weeks: [  { id: '1', weekNumber: 1 }, { id: '2', weekNumber: 2 }, { id: '3', weekNumber: 3 }, { id: '4', weekNumber: 4 }, { id: '5', weekNumber: 5 }, { id: '6', weekNumber: 6 }, { id: '7', weekNumber: 7 }, { id: '8', weekNumber: 8 }],
      includesNutrition: true,
    }
  ];
  
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        // Get user ID from token service
        const userString = tokenService.getUser();
        if (!userString) {
          throw new Error("User not logged in");
        }
        
        const userData = JSON.parse(userString);
        
        // Fetch programs with pagination
        const programsData = await programService.fetchUserPrograms(userData.userId);
        
        // Debug the API response
        console.log('API response - programsData:', programsData);
        if (programsData.length > 0) {
          console.log('First program weeks type:', typeof programsData[0].weeks);
          console.log('First program weeks value:', programsData[0].weeks);
        }
        
        // Map API response to our Program interface
        const mappedPrograms = programsData.map((program: ProgramResponse) => {
          console.log(`Program ${program.id} weeks:`, program.weeks);
          
          return {
            id: program.id || '',
            title: program.name,
            description: `A ${program.numWeeks}-week program${program.hasNutritionProgram ? ' with nutrition guidance' : ''}.`,
            numWeeks: program.numWeeks,
            weeks: Array.isArray(program.weeks) ? program.weeks : [],
            includesNutrition: program.hasNutritionProgram === true
          };
        });
        
        setAllPrograms(mappedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError("Failed to load programs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrograms();
  }, []);
  
  const handleAddProgram = () => {
    // Navigate to the program builder
    navigate('/programs/builder');
  };

  if (loading) {
    return <div className="loading-container">Loading programs...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="programs-page">
      <ProgramSection 
        title="Favorite Programs" 
        programs={favoritePrograms} 
      />
      
      <ProgramSection 
        title="All Programs" 
        programs={allPrograms}
        showAddButton={true}
        onAddProgram={handleAddProgram}
      />
    </div>
  );
};

export default Programs;
