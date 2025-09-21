import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WeekView.css';
import { programService } from '../services/programService';
import { WorkoutRequest, MealRequest } from '@seenelm/train-core';

// Types for our workout events
interface WorkoutEvent {
  id: string;
  title: string;
  day: string; // 'SUN', 'MON', etc.
  startTime: string; // '7AM', '10AM', etc.
  duration: number; // duration in hours
  completed: boolean;
}

// Type for selected time block
interface SelectedBlock {
  day: string;
  time: string;
}

const WeekView: React.FC = () => {
  const { programId, weekId } = useParams<{ programId: string; weekId: string }>();
  const navigate = useNavigate();
  
  // Days of the week
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Time slots from 6AM to 10PM
  const timeSlots = [
    '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM',
    '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM'
  ];

  // State for workouts
  const [workouts, setWorkouts] = useState<WorkoutEvent[]>([]);
  
  // State for selected blocks
  const [selectedBlocks, setSelectedBlocks] = useState<SelectedBlock[]>([]);
  
  // State for selection mode
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  
  // State for creation modal
  const [showCreationModal, setShowCreationModal] = useState<boolean>(false);
  const [creationType, setCreationType] = useState<'workout' | 'meal'>('workout');
  
  // Form state for new workout/meal
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemDescription, setNewItemDescription] = useState<string>('');

  // Fetch workouts when component mounts
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (programId && weekId) {
        try {
          const workoutsData = await programService.getWeekWorkouts(programId, weekId);
          
          // Transform API response to WorkoutEvent format
          const transformedWorkouts = workoutsData.map(workout => {
            // Format date to day of week
            let dayOfWeek = 'MON';
            let timeOfDay = '9AM';
            
            if (workout.startDate) {
              // If startDate is a Date object
              if (workout.startDate instanceof Date) {
                // Get day of week as three-letter abbreviation
                const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                dayOfWeek = days[workout.startDate.getDay()];
                
                // Format time as AM/PM
                const hours = workout.startDate.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const hour = hours % 12 || 12; // Convert 0 to 12
                timeOfDay = `${hour}${ampm}`;
              } else if (typeof workout.startDate === 'string') {
                // If it's already a string, use it directly
                dayOfWeek = workout.startDate;
                timeOfDay = workout.startDate;
              }
            }
            
            return {
              id: workout.id || '',
              title: workout.name,
              day: dayOfWeek,
              startTime: timeOfDay,
              duration: workout.duration || 1,
              completed: false
            };
          });
          
          setWorkouts(transformedWorkouts);
        } catch (error) {
          console.error('Error fetching workouts:', error);
        }
      }
    };
    
    fetchWorkouts();
  }, [programId, weekId]);

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

  // Check if a block is selected
  const isBlockSelected = (day: string, time: string) => {
    return selectedBlocks.some(block => block.day === day && block.time === time);
  };

  // Handle cell click for selection
  const handleCellClick = (day: string, time: string) => {
    if (!isSelectionMode) return;
    
    // Check if there's already a workout at this time
    if (getWorkoutAtDayAndTime(day, time)) return;
    
    // Toggle selection
    if (isBlockSelected(day, time)) {
      setSelectedBlocks(selectedBlocks.filter(
        block => !(block.day === day && block.time === time)
      ));
    } else {
      setSelectedBlocks([...selectedBlocks, { day, time }]);
    }
  };

  // Handle click on a workout
  const handleWorkoutClick = (workoutId: string) => {
    if (isSelectionMode) return; // Don't navigate when in selection mode
    navigate(`/programs/${programId}/weeks/${weekId}/workouts/${workoutId}`);
  };

  // Function to go back to program view
  const handleBackClick = () => {
    navigate(`/programs/${programId}`);
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Clear selections when exiting selection mode
      setSelectedBlocks([]);
    }
  };

  // Open creation modal
  const openCreationModal = (type: 'workout' | 'meal') => {
    if (selectedBlocks.length === 0) {
      alert('Please select at least one time block first.');
      return;
    }
    
    setCreationType(type);
    setShowCreationModal(true);
  };

  // Close creation modal
  const closeCreationModal = () => {
    setShowCreationModal(false);
    setNewItemTitle('');
    setNewItemDescription('');
  };

  // Create new workout or meal
  const handleCreateItem = async () => {
    if (!newItemTitle) {
      alert('Please enter a title.');
      return;
    }
    
    try {
      // Sort selected blocks by day and time
      const sortedBlocks = [...selectedBlocks].sort((a, b) => {
        if (a.day !== b.day) {
          return days.indexOf(a.day) - days.indexOf(b.day);
        }
        return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
      });
      
      if (sortedBlocks.length === 0) return;
      
      // Get first block for start time and day
      const firstBlock = sortedBlocks[0];
      
      // Calculate duration based on consecutive blocks
      let duration = 0;
      let currentDay = firstBlock.day;
      let consecutiveCount = 0;
      
      for (const block of sortedBlocks) {
        if (block.day === currentDay) {
          consecutiveCount++;
        } else {
          // Reset for new day
          currentDay = block.day;
          consecutiveCount = 1;
        }
      }
      
      // Each block represents 1 hour
      duration = Math.max(1, consecutiveCount);
      
      if (creationType === 'workout') {
        // Create a proper date object for startDate and endDate
        const today = new Date();
        
        // Parse the time from firstBlock.time (e.g., "9AM" to hours)
        let startHour = 9; // Default to 9AM
        if (firstBlock.time) {
          const timeMatch = firstBlock.time.match(/(\d+)(AM|PM)/i);
          if (timeMatch) {
            let hour = parseInt(timeMatch[1], 10);
            const isPM = timeMatch[2].toUpperCase() === 'PM';
            
            // Convert to 24-hour format
            if (isPM && hour < 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;
            
            startHour = hour;
          }
        }
        
        // Set the day of week
        let dayOffset = 0;
        const dayMap: Record<string, number> = {
          'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
        };
        
        if (firstBlock.day in dayMap) {
          const currentDay = today.getDay();
          dayOffset = (dayMap[firstBlock.day] - currentDay + 7) % 7;
        }
        
        // Create start date with the correct day and time
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + dayOffset);
        startDate.setHours(startHour, 0, 0, 0);
        
        // Create end date based on duration
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + duration);
        
        // Debug: Log the date objects to see their format
        console.log('Start Date:', startDate);
        console.log('Start Date Type:', typeof startDate);
        console.log('Start Date instanceof Date:', startDate instanceof Date);
        console.log('End Date:', endDate);
        console.log('End Date Type:', typeof endDate);
        console.log('End Date instanceof Date:', endDate instanceof Date);
        
        // Create a request with all required fields
        const workoutRequest: WorkoutRequest = {
          name: newItemTitle,
          description: newItemDescription,
          duration: duration,
          blocks: [],
          accessType: 1,
          createdBy: localStorage.getItem('userId') || 'anonymous',
          // Use the Date objects directly
          startDate,
          endDate
        };
        
        const response = await programService.createWorkout(programId!, weekId!, workoutRequest);
        
        // Add new workout to the list with proper string values for day and startTime
        setWorkouts([...workouts, {
          id: response.id || '',
          title: response.name,
          day: firstBlock.day,
          startTime: firstBlock.time,
          duration: response.duration || duration,
          completed: false
        }]);
      } else {
        const mealRequest: MealRequest = {
          mealName: newItemTitle,
          description: newItemDescription,
          day: firstBlock.day,
          time: firstBlock.time,
          foods: []
        };
        
        await programService.createMeal(programId!, weekId!, mealRequest);
        // Note: We don't show meals in the calendar yet
      }
      
      // Close modal and reset selection
      closeCreationModal();
      setSelectedBlocks([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error(`Error creating ${creationType}:`, error);
      alert(`Failed to create ${creationType}. Please try again.`);
    }
  };

  // Toggle between week view and agenda view
  const [viewMode, setViewMode] = useState<'week' | 'agenda'>('week');

  return (
    <div className="week-view">
      <div className="week-view-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to Program
        </button>
        <h1>Week Schedule</h1>
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
      
      {viewMode === 'week' && (
        <div className="selection-controls">
          <button 
            className={`selection-toggle ${isSelectionMode ? 'active' : ''}`}
            onClick={toggleSelectionMode}
          >
            {isSelectionMode ? 'Cancel Selection' : 'Select Time Blocks'}
          </button>
          
          {isSelectionMode && (
            <div className="creation-buttons">
              <button onClick={() => openCreationModal('workout')}>
                Create Workout
              </button>
              <button onClick={() => openCreationModal('meal')}>
                Create Meal
              </button>
              <span className="selected-count">
                {selectedBlocks.length} block{selectedBlocks.length !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>
      )}

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
                    
                    return (
                      <td 
                        key={`${day}-${time}`} 
                        className={`empty-cell ${isSelectionMode ? 'selectable' : ''} ${isBlockSelected(day, time) ? 'selected' : ''}`}
                        onClick={() => handleCellClick(day, time)}
                      ></td>
                    );
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
      
      {/* Creation Modal */}
      {showCreationModal && (
        <div className="modal-overlay">
          <div className="creation-modal">
            <h2>Create New {creationType === 'workout' ? 'Workout' : 'Meal'}</h2>
            <div className="form-group">
              <label>Title:</label>
              <input 
                type="text" 
                value={newItemTitle} 
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder={`Enter ${creationType} title`}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea 
                value={newItemDescription} 
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder={`Enter ${creationType} description`}
                rows={3}
              />
            </div>
            <div className="selected-info">
              <p>Selected blocks: {selectedBlocks.length}</p>
              <p>Start: {selectedBlocks.length > 0 ? `${selectedBlocks[0].day} at ${selectedBlocks[0].time}` : 'None'}</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeCreationModal}>Cancel</button>
              <button className="create-btn" onClick={handleCreateItem}>
                Create {creationType === 'workout' ? 'Workout' : 'Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
