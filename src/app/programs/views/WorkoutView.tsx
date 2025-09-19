import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WorkoutView.css';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: string;
  completed: boolean;
  notes?: string;
}

interface WorkoutDetails {
  id: string;
  title: string;
  description: string;
  day: string;
  time: string;
  duration: number;
  exercises: Exercise[];
  completed: boolean;
}

// Dummy workout data
const workoutData: Record<string, WorkoutDetails> = {
  '1': {
    id: '1',
    title: 'Morning Cardio',
    description: 'Start your day with this energizing cardio session to boost your metabolism and improve cardiovascular health.',
    day: 'SUN',
    time: '7AM',
    duration: 1,
    completed: true,
    exercises: [
      {
        id: 'e1',
        name: 'Treadmill Run',
        sets: 1,
        reps: '20 mins',
        weight: 'N/A',
        restTime: 'None',
        completed: true,
        notes: 'Maintain a moderate pace with 2-minute sprint intervals every 5 minutes'
      },
      {
        id: 'e2',
        name: 'Jumping Jacks',
        sets: 3,
        reps: '30 secs',
        weight: 'N/A',
        restTime: '30 secs',
        completed: true
      },
      {
        id: 'e3',
        name: 'Mountain Climbers',
        sets: 3,
        reps: '45 secs',
        weight: 'N/A',
        restTime: '30 secs',
        completed: true
      },
      {
        id: 'e4',
        name: 'Burpees',
        sets: 3,
        reps: '10',
        weight: 'N/A',
        restTime: '45 secs',
        completed: true
      },
      {
        id: 'e5',
        name: 'Jump Rope',
        sets: 1,
        reps: '5 mins',
        weight: 'N/A',
        restTime: 'None',
        completed: true
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Upper Body',
    description: 'Focus on building strength and definition in your chest, shoulders, and arms with this comprehensive upper body workout.',
    day: 'SUN',
    time: '10AM',
    duration: 1.5,
    completed: true,
    exercises: [
      {
        id: 'e1',
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        weight: '135 lbs',
        restTime: '90 secs',
        completed: true,
        notes: 'Focus on full range of motion'
      },
      {
        id: 'e2',
        name: 'Overhead Press',
        sets: 3,
        reps: '10-12',
        weight: '65 lbs',
        restTime: '60 secs',
        completed: true
      },
      {
        id: 'e3',
        name: 'Lat Pulldowns',
        sets: 3,
        reps: '12',
        weight: '120 lbs',
        restTime: '60 secs',
        completed: true
      },
      {
        id: 'e4',
        name: 'Bicep Curls',
        sets: 3,
        reps: '12',
        weight: '25 lbs',
        restTime: '45 secs',
        completed: true
      },
      {
        id: 'e5',
        name: 'Tricep Pushdowns',
        sets: 3,
        reps: '15',
        weight: '50 lbs',
        restTime: '45 secs',
        completed: true
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Core Training',
    description: 'Strengthen your core with this targeted workout focusing on abs, obliques, and lower back muscles.',
    day: 'SUN',
    time: '3PM',
    duration: 1,
    completed: true,
    exercises: [
      {
        id: 'e1',
        name: 'Plank',
        sets: 3,
        reps: '60 secs',
        weight: 'N/A',
        restTime: '30 secs',
        completed: true
      },
      {
        id: 'e2',
        name: 'Russian Twists',
        sets: 3,
        reps: '20 each side',
        weight: '10 lbs',
        restTime: '45 secs',
        completed: true
      },
      {
        id: 'e3',
        name: 'Leg Raises',
        sets: 3,
        reps: '15',
        weight: 'N/A',
        restTime: '45 secs',
        completed: true
      },
      {
        id: 'e4',
        name: 'Mountain Climbers',
        sets: 3,
        reps: '30 secs',
        weight: 'N/A',
        restTime: '30 secs',
        completed: true
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Full Body Workout',
    description: 'A comprehensive full body workout targeting all major muscle groups for balanced strength development.',
    day: 'MON',
    time: '7AM',
    duration: 2,
    completed: false,
    exercises: [
      {
        id: 'e1',
        name: 'Squats',
        sets: 4,
        reps: '10',
        weight: '135 lbs',
        restTime: '90 secs',
        completed: false,
        notes: 'Focus on proper form and depth'
      },
      {
        id: 'e2',
        name: 'Deadlifts',
        sets: 4,
        reps: '8',
        weight: '185 lbs',
        restTime: '120 secs',
        completed: false,
        notes: 'Keep back straight and engage core'
      },
      {
        id: 'e3',
        name: 'Push-ups',
        sets: 3,
        reps: '15',
        weight: 'Body weight',
        restTime: '60 secs',
        completed: false
      },
      {
        id: 'e4',
        name: 'Pull-ups',
        sets: 3,
        reps: '8-10',
        weight: 'Body weight',
        restTime: '90 secs',
        completed: false
      },
      {
        id: 'e5',
        name: 'Lunges',
        sets: 3,
        reps: '12 each leg',
        weight: '30 lbs',
        restTime: '60 secs',
        completed: false
      },
      {
        id: 'e6',
        name: 'Plank',
        sets: 3,
        reps: '60 secs',
        weight: 'N/A',
        restTime: '45 secs',
        completed: false
      }
    ]
  }
};

const WorkoutView: React.FC = () => {
  const { programId, weekNumber, workoutId } = useParams<{ programId: string; weekNumber: string; workoutId: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});

  // Toggle exercise expansion
  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  // Mark exercise as completed
  const toggleExerciseCompletion = (exerciseId: string) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, completed: !exercise.completed } 
        : exercise
    );
    
    setWorkout({
      ...workout,
      exercises: updatedExercises,
      completed: updatedExercises.every(e => e.completed)
    });
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(`/programs/${programId}/weeks/${weekNumber}`);
  };

  // Load workout data
  React.useEffect(() => {
    if (workoutId && workoutData[workoutId]) {
      setWorkout(workoutData[workoutId]);
      
      // Initialize expanded state for exercises
      const initialExpandState: Record<string, boolean> = {};
      workoutData[workoutId].exercises.forEach(exercise => {
        initialExpandState[exercise.id] = false;
      });
      setExpandedExercises(initialExpandState);
    }
  }, [workoutId]);

  if (!workout) {
    return <div className="loading-container">Workout not found</div>;
  }

  return (
    <div className="workout-detail-view">
      <div className="workout-detail-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to Week {weekNumber}
        </button>
        <div className="workout-status">
          <span className={`status-indicator ${workout.completed ? 'completed' : 'pending'}`}>
            {workout.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>
      
      <h1>{workout.title}</h1>
      <div className="workout-meta">
        <span>{workout.day} at {workout.time}</span>
        <span>{workout.duration} hour{workout.duration !== 1 ? 's' : ''}</span>
      </div>
      
      <p className="workout-description">{workout.description}</p>
      
      <div className="exercises-section">
        <h2>Exercises</h2>
        <div className="exercises-list">
          {workout.exercises.map(exercise => (
            <div 
              key={exercise.id} 
              className={`exercise-card ${exercise.completed ? 'completed' : ''}`}
            >
              <div 
                className="exercise-header" 
                onClick={() => toggleExercise(exercise.id)}
              >
                <div className="exercise-title">
                  <h3>{exercise.name}</h3>
                  <div className="exercise-brief">
                    {exercise.sets} sets × {exercise.reps}
                  </div>
                </div>
                <div className="exercise-expand">
                  {expandedExercises[exercise.id] ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedExercises[exercise.id] && (
                <div className="exercise-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Sets:</span>
                      <span className="detail-value">{exercise.sets}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Reps:</span>
                      <span className="detail-value">{exercise.reps}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Weight:</span>
                      <span className="detail-value">{exercise.weight}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rest:</span>
                      <span className="detail-value">{exercise.restTime}</span>
                    </div>
                  </div>
                  
                  {exercise.notes && (
                    <div className="exercise-notes">
                      <span className="notes-label">Notes:</span>
                      <p>{exercise.notes}</p>
                    </div>
                  )}
                  
                  <button 
                    className={`complete-exercise-btn ${exercise.completed ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExerciseCompletion(exercise.id);
                    }}
                  >
                    {exercise.completed ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          className={`finish-workout-btn ${workout.completed ? 'completed' : ''}`}
          disabled={workout.completed}
        >
          {workout.completed ? 'Workout Completed' : 'Finish Workout'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutView;
