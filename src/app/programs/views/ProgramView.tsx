import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './ProgramView.css';

interface ProgramDetails {
  id: string;
  title: string;
  description: string;
  weeks: number;
  includesNutrition: boolean;
  // Additional details that might be available in the full program view
  weekDetails?: Array<{
    weekNumber: number;
    title: string;
    description: string;
    workouts: number;
    completed: number;
    image?: string;
  }>;
}

// Dummy data for development and testing
const dummyProgramsData: Record<string, ProgramDetails> = {
  '1': {
    id: '1',
    title: 'Strength Training Basics',
    description: 'A comprehensive 6-week program designed to build foundational strength through progressive overload and proper form.',
    weeks: 6,
    includesNutrition: false,
    weekDetails: [
      {
        weekNumber: 1,
        title: 'Foundation Building',
        description: 'Focus on learning proper form for all major compound movements.',
        workouts: 3,
        completed: 3,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 2,
        title: 'Progressive Overload',
        description: 'Begin adding weight to exercises while maintaining proper form.',
        workouts: 4,
        completed: 2,
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 3,
        title: 'Hypertrophy Focus',
        description: 'Increase volume with more sets and reps to stimulate muscle growth.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 4,
        title: 'Strength Week',
        description: 'Focus on heavier weights with lower reps to build raw strength.',
        workouts: 3,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 5,
        title: 'Deload Week',
        description: 'Reduce volume and intensity to allow for recovery.',
        workouts: 3,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 6,
        title: 'Peak Week',
        description: 'Test your new strength levels with challenging workouts.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Lean & Clean',
    description: '8 weeks of balanced workouts paired with nutrition guidance to help you achieve a leaner physique while maintaining muscle mass.',
    weeks: 8,
    includesNutrition: true,
    weekDetails: [
      {
        weekNumber: 1,
        title: 'Metabolic Kickstart',
        description: 'High-intensity workouts to jumpstart your metabolism combined with nutrition basics.',
        workouts: 4,
        completed: 4,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 2,
        title: 'Building Habits',
        description: 'Focus on consistency in both workouts and nutrition planning.',
        workouts: 5,
        completed: 3,
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 3,
        title: 'Increasing Intensity',
        description: 'Progressive overload in workouts and fine-tuning nutrition.',
        workouts: 5,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 4,
        title: 'Midpoint Assessment',
        description: 'Evaluate progress and adjust workout and nutrition plans.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 5,
        title: 'Advanced Techniques',
        description: 'Introduce advanced training methods to break through plateaus.',
        workouts: 5,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 6,
        title: 'Nutrition Focus',
        description: 'Deeper dive into nutrition timing and macronutrient balance.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 7,
        title: 'Peak Intensity',
        description: 'Highest workout intensity combined with precision nutrition.',
        workouts: 5,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 8,
        title: 'Maintenance Strategy',
        description: 'Learn how to maintain your results with sustainable practices.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'HIIT & Run',
    description: 'A 4-week high-intensity interval training program combined with running to improve cardiovascular fitness and endurance.',
    weeks: 4,
    includesNutrition: false,
    weekDetails: [
      {
        weekNumber: 1,
        title: 'Building Endurance',
        description: 'Focus on building a base level of cardiovascular endurance.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 2,
        title: 'Interval Introduction',
        description: 'Begin incorporating interval training into your running routine.',
        workouts: 5,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 3,
        title: 'Advanced Intervals',
        description: 'Increase intensity and complexity of interval workouts.',
        workouts: 5,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        weekNumber: 4,
        title: 'Peak Performance',
        description: 'Combine all elements for maximum cardiovascular benefit.',
        workouts: 4,
        completed: 0,
        image: 'https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  }
};

const ProgramView: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API loading with a short timeout
    const timer = setTimeout(() => {
      if (programId && dummyProgramsData[programId]) {
        setProgram(dummyProgramsData[programId]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [programId]);

  // Function to handle week card click
  const handleWeekClick = (weekNumber: number) => {
    navigate(`/programs/${programId}/weeks/${weekNumber}`);
  };

  if (loading) {
    return <div className="loading-container">Loading program details...</div>;
  }

  if (!program) {
    return <div className="error-container">Program not found</div>;
  }

  return (
    <div className="program-view">
      <div className="program-header">
        <h1>{program.title}</h1>
        <div className="program-meta">
          <span className="program-duration">{program.weeks} weeks</span>
          {program.includesNutrition && (
            <span className="program-nutrition">Includes nutrition plan</span>
          )}
        </div>
        <p className="program-description">{program.description}</p>
      </div>
      
      {program.weekDetails && program.weekDetails.length > 0 ? (
        <div className="program-weeks">
          <h2>Program Schedule</h2>
          <div className="weeks-container">
            {program.weekDetails.map(week => (
              <div 
                key={week.weekNumber} 
                className="week-card" 
                onClick={() => handleWeekClick(week.weekNumber)}
              >
                {week.image && (
                  <div className="week-image" style={{ backgroundImage: `url(${week.image})` }}></div>
                )}
                <div className="week-content">
                  <h3>Week {week.weekNumber}: {week.title}</h3>
                  <p>{week.description}</p>
                  <div className="week-stats">
                    <div className="workout-count">
                      <strong>Workouts:</strong> {week.workouts}
                    </div>
                    <div className="progress-container">
                      <div className="progress-label">
                        <strong>Progress:</strong> {week.completed}/{week.workouts}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(week.completed / week.workouts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-weeks">
          <p>No detailed schedule available for this program yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProgramView;
