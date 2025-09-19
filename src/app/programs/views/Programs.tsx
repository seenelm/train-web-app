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
  weeks: number;
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
      weeks: 6,
      includesNutrition: false,
    },
    {
      id: '2',
      title: 'Lean & Clean',
      description: '8 weeks of workouts paired with nutrition guidance.',
      weeks: 8,
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
        
        // Map API response to our Program interface
        const mappedPrograms = programsData.map((program: ProgramResponse) => ({
          id: program.id || '',
          title: program.name,
          description: `A ${program.numWeeks}-week program${program.hasNutritionProgram ? ' with nutrition guidance' : ''}.`,
          weeks: program.numWeeks,
          includesNutrition: program.hasNutritionProgram === true
        }));
        
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
