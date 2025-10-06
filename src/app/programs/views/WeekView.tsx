import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WeekView.css';
import { programService } from '../services/programService';
import { useProgramContext, programUtils } from '../contexts/ProgramContext';
import { tokenService } from '../../../services/tokenService';

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

  const { setWorkoutRequest } = useProgramContext();
  
  // Days of the week
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // All 24 hours of the day
  const timeSlots = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
  ];

  // State for workouts
  const [workouts, setWorkouts] = useState<WorkoutEvent[]>([]);
  
  // State for selected blocks
  const [selectedBlocks, setSelectedBlocks] = useState<SelectedBlock[]>([]);
  
  // State for selection mode
  const [isSelectionMode] = useState<boolean>(false);
  
  // State for drag selection
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<SelectedBlock | null>(null);
  
  // State for creation popup
  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  
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
            let duration = 1; // Default duration in hours
            
            if (workout.startDate) {
              // Convert string date to Date object if needed
              const startDate = typeof workout.startDate === 'string' 
                ? new Date(workout.startDate) 
                : workout.startDate;
              
              console.log(`Raw workout.startDate: ${workout.startDate}`);
              console.log(`Parsed startDate: ${startDate}`);
              console.log(`startDate.getDay(): ${startDate.getDay()}`);
              console.log(`startDate.getHours(): ${startDate.getHours()}`);
              
              // Get day of week as three-letter abbreviation
              const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
              dayOfWeek = days[startDate.getDay()];
              
              // Format time as AM/PM
              const hours = startDate.getHours();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const hour = hours % 12 || 12; // Convert 0 to 12
              timeOfDay = `${hour}${ampm}`;
              
              // Calculate duration from startDate and endDate
              if (workout.endDate) {
                const endDate = typeof workout.endDate === 'string' 
                  ? new Date(workout.endDate) 
                  : workout.endDate;
                
                console.log(`Raw workout.endDate: ${workout.endDate}`);
                console.log(`Parsed endDate: ${endDate}`);
                console.log(`endDate.getHours(): ${endDate.getHours()}`);
                
                // Calculate duration in hours
                const durationMs = endDate.getTime() - startDate.getTime();
                const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Convert to hours and round up
                duration = Math.max(1, durationHours); // Minimum 1 hour
                
                console.log(`Calculated duration: ${duration} hours`);
              } else {
                // Fallback to workout.duration if endDate is not available
                duration = workout.duration || 1;
              }
            }
            
            return {
              id: workout.id || '',
              title: workout.name,
              day: dayOfWeek,
              startTime: timeOfDay,
              duration: duration,
              completed: false
            };
          });
          
          console.log('Transformed workouts:', transformedWorkouts);
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
    const foundWorkout = workouts.find(workout => {
      const matches = workout.day === day && workout.startTime === time;
      if (matches) {
        console.log(`Found workout: ${workout.title} at ${day} ${time}`);
      }
      return matches;
    });
    
    return foundWorkout;
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
    // Check if there's already a workout at this time
    if (getWorkoutAtDayAndTime(day, time)) return;
    
    // Single click opens popup immediately
    setSelectedBlocks([{ day, time }]);
    openCreationPopup();
  };

  // Handle mouse down to start drag selection
  const handleMouseDown = (day: string, time: string) => {
    if (getWorkoutAtDayAndTime(day, time)) return;
    
    setIsDragging(true);
    setDragStart({ day, time });
    setSelectedBlocks([{ day, time }]);
  };

  // Handle mouse enter during drag
  const handleMouseEnter = (day: string, time: string) => {
    if (!isDragging || !dragStart) return;
    if (getWorkoutAtDayAndTime(day, time)) return;
    
    // Calculate all blocks between drag start and current position
    const startDayIndex = days.indexOf(dragStart.day);
    const endDayIndex = days.indexOf(day);
    const startTimeIndex = timeSlots.indexOf(dragStart.time);
    const endTimeIndex = timeSlots.indexOf(time);
    
    const minDay = Math.min(startDayIndex, endDayIndex);
    const maxDay = Math.max(startDayIndex, endDayIndex);
    const minTime = Math.min(startTimeIndex, endTimeIndex);
    const maxTime = Math.max(startTimeIndex, endTimeIndex);
    
    const newSelection: SelectedBlock[] = [];
    for (let d = minDay; d <= maxDay; d++) {
      for (let t = minTime; t <= maxTime; t++) {
        if (!getWorkoutAtDayAndTime(days[d], timeSlots[t])) {
          newSelection.push({ day: days[d], time: timeSlots[t] });
        }
      }
    }
    
    setSelectedBlocks(newSelection);
  };

  // Handle mouse up to end drag selection
  const handleMouseUp = () => {
    if (isDragging && selectedBlocks.length > 0) {
      setIsDragging(false);
      setDragStart(null);
      openCreationPopup();
    }
  };

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, selectedBlocks]);

  // Handle click on a workout
  const handleWorkoutClick = (workoutId: string) => {
    navigate(`/programs/${programId}/weeks/${weekId}/workouts/${workoutId}`);
  };

  // Handle log workout click
  // const handleLogWorkout = (workoutId: string, event: React.MouseEvent) => {
  //   event.stopPropagation(); // Prevent triggering the parent onClick
  //   navigate(`/programs/${programId}/weeks/${weekId}/workouts/${workoutId}?mode=log`);
  // };

  // Function to go back to program view
  const handleBackClick = () => {
    navigate(`/programs/${programId}`);
  };

  // Toggle selection mode
  // const toggleSelectionMode = () => {
  //   setIsSelectionMode(!isSelectionMode);
  //   if (isSelectionMode) {
  //     // Clear selections when exiting selection mode
  //     setSelectedBlocks([]);
  //   }
  // };

  const openCreationPopup = () => {
    if (selectedBlocks.length > 0) {
      // Calculate default times from selected blocks
      const sortedBlocks = [...selectedBlocks].sort((a, b) => {
        if (a.day !== b.day) return days.indexOf(a.day) - days.indexOf(b.day);
        return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
      });
      
      const firstBlock = sortedBlocks[0];
      const lastBlock = sortedBlocks[sortedBlocks.length - 1];
      
      // Convert time format from "12AM" to "00:00"
      const convertTo24Hour = (timeStr: string) => {
        const match = timeStr.match(/(\d+)(AM|PM)/i);
        if (!match) return '09:00';
        
        let hour = parseInt(match[1], 10);
        const isPM = match[2].toUpperCase() === 'PM';
        
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        return `${hour.toString().padStart(2, '0')}:00`;
      };
      
      setStartTime(convertTo24Hour(firstBlock.time || '9AM'));
      
      // Calculate end time (1 hour after last block)
      const lastBlockTime = convertTo24Hour(lastBlock.time || '10AM');
      const [lastHour] = lastBlockTime.split(':').map(Number);
      const endHour = (lastHour + 1) % 24;
      setEndTime(`${endHour.toString().padStart(2, '0')}:00`);
      
      setShowCreationPopup(true);
    }
  };

  const closeCreationPopup = () => {
    setShowCreationPopup(false);
    setSelectedBlocks([]);
  };

  // Handle option selection from popup
  const handleOptionSelect = async (type: 'workout' | 'meal' | 'note') => {
    if (selectedBlocks.length === 0) return;
    
    if (type === 'workout') {
      const user = JSON.parse(tokenService.getUser() || '{}');
      // Calculate duration in minutes
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

      console.log("Start time: ", startTime);
      console.log("Selected blocks: ", selectedBlocks);

      // Get the selected day (use the first selected block's day)
      const selectedDay = selectedBlocks[0]?.day;
      if (!selectedDay) return;

      

      const defaultRequest = programUtils.createDefaultWorkoutRequest(user.userId, durationMinutes);
      defaultRequest.startDate = createDateWithDayAndTime(selectedDay, startTime);
      defaultRequest.endDate = createDateWithDayAndTime(selectedDay, endTime);

      console.log('Default request: ', defaultRequest);
      console.log('Start date: ', defaultRequest.startDate);
      console.log('End date: ', defaultRequest.endDate);
      setWorkoutRequest(defaultRequest);
     

      // Navigate to workout builder with duration
      closeCreationPopup();
      navigate(`/programs/${programId}/weeks/${weekId}/workouts/new?duration=${durationMinutes}`);
    } else if (type === 'meal') {
      alert('Meal creation coming soon!');
      closeCreationPopup();
    } else {
      alert('Note creation coming soon!');
      closeCreationPopup();
    }
  };

  // Create proper dates with the selected day and time
  const createDateWithDayAndTime = (day: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Get the day index (0 = Sunday, 1 = Monday, etc.)
    const dayIndex = days.indexOf(day);
    
    // Create a date for the current week
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate the date for the selected day in the current week
    const daysUntilSelectedDay = (dayIndex - currentDay + 7) % 7;
    const selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() + daysUntilSelectedDay);
    
    // Set the time
    selectedDate.setHours(hours, minutes, 0, 0);
    
    return selectedDate;
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
                        >
                          <div className="workout-cell-content">
                            <div 
                              className="workout-cell-title"
                              onClick={() => handleWorkoutClick(workout.id)}
                            >
                              {workout.title}
                            </div>

                          </div>
                        </td>
                      );
                    }
                    
                    return (
                      <td 
                        key={`${day}-${time}`} 
                        className={`empty-cell ${isSelectionMode ? 'selectable' : ''} ${isBlockSelected(day, time) ? 'selected' : ''}`}
                        onClick={() => handleCellClick(day, time)}
                        onMouseDown={() => handleMouseDown(day, time)}
                        onMouseEnter={() => handleMouseEnter(day, time)}
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
          {days.map(day => {
            const dayWorkouts = workouts
              .filter(w => w.day === day)
              .sort((a, b) => {
                // Sort by start time
                const timeA = a.startTime || '00:00';
                const timeB = b.startTime || '00:00';
                return timeA.localeCompare(timeB);
              });
            
            if (dayWorkouts.length === 0) return null;
            
            return (
              <div key={day} className="agenda-day-section">
                <h2 className="agenda-day-title">{day}</h2>
                <div className="agenda-workout-grid">
                  {dayWorkouts.map(workout => (
                    <div 
                      key={workout.id} 
                      className={`agenda-workout-card ${workout.completed ? 'completed' : ''}`}
                      onClick={() => handleWorkoutClick(workout.id)}
                    >
                      <div className="workout-image-placeholder"></div>
                      <div className="workout-time">{workout.startTime}</div>
                      <div className="workout-title">{workout.title}</div>
                      <div className="workout-duration">{workout.duration} hour{workout.duration !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Creation Popup */}
      {showCreationPopup && (
        <div className="modal-overlay" onClick={closeCreationPopup}>
          <div className="creation-popup" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Item</h2>
            
            <div className="time-inputs">
              <div className="time-input-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="time-input"
                />
              </div>
              <div className="time-input-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="time-input"
                />
              </div>
            </div>

            <div className="option-buttons">
              <button onClick={() => handleOptionSelect('workout')}>Workout</button>
              <button onClick={() => handleOptionSelect('meal')}>Meal</button>
              <button onClick={() => handleOptionSelect('note')}>Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
