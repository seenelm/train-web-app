import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WeekView.css';

// Types for our workout events
interface WorkoutEvent {
  id: string;
  title: string;
  day: string; // 'SUN', 'MON', etc.
  startTime: string; // '7AM', '10AM', etc.
  duration: number; // duration in hours
  completed: boolean;
}

const WeekView: React.FC = () => {
  const { programId, weekNumber } = useParams<{ programId: string; weekNumber: string }>();
  const navigate = useNavigate();
  
  // Days of the week
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Time slots from 6AM to 10PM
  const timeSlots = [
    '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM',
    '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'
  ];

  // Dummy workout data for the week
  const [workouts] = useState<WorkoutEvent[]>([
    {
      id: '1',
      title: 'Morning Cardio',
      day: 'SUN',
      startTime: '7AM',
      duration: 1,
      completed: true
    },
    {
      id: '2',
      title: 'Upper Body',
      day: 'SUN',
      startTime: '10AM',
      duration: 1.5,
      completed: true
    },
    {
      id: '3',
      title: 'Core Training',
      day: 'SUN',
      startTime: '3PM',
      duration: 1,
      completed: true
    },
    {
      id: '4',
      title: 'Full Body Workout',
      day: 'MON',
      startTime: '7AM',
      duration: 2,
      completed: false
    },
    {
      id: '5',
      title: 'Stretching',
      day: 'SUN',
      startTime: '12PM',
      duration: 1,
      completed: true
    },
    {
      id: '6',
      title: 'Leg Day',
      day: 'SUN',
      startTime: '1PM',
      duration: 1,
      completed: true
    }
  ]);

  // Function to get the row span for a workout based on its duration
  const getWorkoutRowSpan = (duration: number) => {
    return Math.ceil(duration);
  };

  // Function to check if a workout exists at a specific day and time
  const getWorkoutAtDayAndTime = (day: string, time: string) => {
    return workouts.find(workout => workout.day === day && workout.startTime === time);
  };

  // Function to check if a cell should be rendered or is part of a rowspan
  const shouldRenderCell = (day: string, time: string) => {
    const workoutsForDay = workouts.filter(w => w.day === day);
    
    for (const workout of workoutsForDay) {
      if (workout.startTime === time) {
        return true; // This is the start of a workout
      }
      
      // Check if this time slot is covered by a workout that started earlier
      const timeIndex = timeSlots.indexOf(time);
      const workoutStartIndex = timeSlots.indexOf(workout.startTime);
      const workoutEndIndex = workoutStartIndex + getWorkoutRowSpan(workout.duration);
      
      if (timeIndex > workoutStartIndex && timeIndex < workoutEndIndex) {
        return false; // This cell is part of a rowspan
      }
    }
    
    return true; // No workout here, render an empty cell
  };

  // Handle click on a workout
  const handleWorkoutClick = (workoutId: string) => {
    navigate(`/programs/${programId}/weeks/${weekNumber}/workouts/${workoutId}`);
  };

  // Function to go back to program view
  const handleBackClick = () => {
    navigate(`/programs/${programId}`);
  };

  // Toggle between week view and agenda view
  const [viewMode, setViewMode] = useState<'week' | 'agenda'>('week');

  return (
    <div className="week-view">
      <div className="week-view-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to Program
        </button>
        <h1>Week {weekNumber} Schedule</h1>
        <div className="view-toggle">
          <button 
            className={viewMode === 'week' ? 'active' : ''} 
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={viewMode === 'agenda' ? 'active' : ''} 
            onClick={() => setViewMode('agenda')}
          >
            Agenda
          </button>
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="calendar-container">
          <table className="calendar">
            <thead>
              <tr>
                <th className="time-column"></th>
                {days.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="time-slot">{time}</td>
                  {days.map(day => {
                    const workout = getWorkoutAtDayAndTime(day, time);
                    
                    if (!shouldRenderCell(day, time)) {
                      return null; // This cell is covered by a rowspan
                    }
                    
                    if (workout) {
                      return (
                        <td 
                          key={`${day}-${time}`}
                          className={`workout-cell ${workout.completed ? 'completed' : ''}`}
                          rowSpan={getWorkoutRowSpan(workout.duration)}
                          onClick={() => handleWorkoutClick(workout.id)}
                        >
                          {workout.title}
                        </td>
                      );
                    }
                    
                    return <td key={`${day}-${time}`} className="empty-cell"></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="agenda-view">
          <h2>Workouts</h2>
          <div className="workout-list">
            {workouts.map(workout => (
              <div 
                key={workout.id} 
                className={`workout-item ${workout.completed ? 'completed' : ''}`}
                onClick={() => handleWorkoutClick(workout.id)}
              >
                <div className="workout-time">
                  {workout.day} • {workout.startTime}
                </div>
                <div className="workout-title">{workout.title}</div>
                <div className="workout-duration">{workout.duration} hour{workout.duration !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
