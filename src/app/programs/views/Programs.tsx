import { ProgramSection } from '../components/ProgramSection';
import { useNavigate } from 'react-router';
import "./Programs.css"

interface Program {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
}

// Sample data - in a real app, this would come from an API
const allPrograms: Program[] = [
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
  },
  {
    id: '3',
    title: 'Endurance Builder',
    description: '12-week cardio-focused program to improve stamina.',
    weeks: 12,
    includesNutrition: false,
  },
  {
    id: '4',
    title: 'Power Lifting',
    description: 'Advanced 10-week program for serious strength gains.',
    weeks: 10,
    includesNutrition: true,
  },
  {
    id: '5',
    title: 'Mobility & Recovery',
    description: '4-week program focusing on flexibility and recovery.',
    weeks: 4,
    includesNutrition: false,
  }
];

// In a real app, this would be user-specific data from an API
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

const Programs = () => {
  const navigate = useNavigate();
  
  const handleAddProgram = () => {
    // Navigate to the program builder
    navigate('/programs/builder');
  };

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
