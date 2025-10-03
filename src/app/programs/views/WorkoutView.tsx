import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WorkoutView.css';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { programService } from '../services/programService';
import { WorkoutResponse, WorkoutRequest } from '@seenelm/train-core';
import { tokenService } from '../../../services/tokenService';

// Exercise interface
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: string;
  completed: boolean;
  notes?: string;
}

// Circuit interface
interface Circuit {
  id: string;
  name: string;
  sets: number;
  exercises: Exercise[];
}

// Muscle group interface
interface MuscleGroup {
  name: string;
  percentage: number;
}

// Workout interface
interface WorkoutDetails {
  id: string;
  title: string;
  description: string;
  duration: number;
  muscleGroups: MuscleGroup[];
  circuits: Circuit[];
  completed: boolean;
}

// Sortable exercise item component
interface SortableExerciseItemProps {
  exercise: Exercise;
  circuitId: string;
  toggleExerciseCompletion: (circuitId: string, exerciseId: string) => void;
  removeExercise: (circuitId: string, exerciseId: string) => void;
  editMode: boolean;
}

const SortableExerciseItem: React.FC<SortableExerciseItemProps> = ({ 
  exercise, 
  circuitId,
  toggleExerciseCompletion,
  removeExercise,
  editMode
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: exercise.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`exercise-item ${exercise.completed ? 'completed' : ''}`}
      {...attributes}
    >
      <div className="exercise-check">
        <input 
          type="checkbox" 
          checked={exercise.completed}
          onChange={() => toggleExerciseCompletion(circuitId, exercise.id)}
        />
      </div>
      <div 
        className="exercise-name"
        {...(editMode ? listeners : {})}
      >
        {editMode ? (
          <input 
            type="text" 
            value={exercise.name}
            onChange={() => {
              // Handle name change logic
            }}
            className="exercise-name-input"
          />
        ) : (
          <span>{exercise.name}</span>
        )}
        {editMode && <span className="drag-handle">☰</span>}
      </div>
      <div className="exercise-weight">
        {editMode ? (
          <input 
            type="number" 
            value={exercise.weight}
            onChange={() => {
              // Handle weight change logic
            }}
            min="0"
            className="weight-input"
          />
        ) : (
          <span>{exercise.weight}</span>
        )}
        <span> {exercise.weightUnit}</span>
      </div>
      <div className="exercise-reps">
        {editMode ? (
          <input 
            type="number" 
            value={exercise.reps}
            onChange={() => {
              // Handle reps change logic
            }}
            min="1"
            className="reps-input"
          />
        ) : (
          <span>{exercise.reps}</span>
        )}
        <span> reps</span>
      </div>
      {editMode && (
        <button 
          className="remove-exercise-btn"
          onClick={() => removeExercise(circuitId, exercise.id)}
          title="Remove exercise"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Sortable circuit item component
interface SortableCircuitItemProps {
  circuit: Circuit;
  editMode: boolean;
  toggleExerciseCompletion: (circuitId: string, exerciseId: string) => void;
  removeExercise: (circuitId: string, exerciseId: string) => void;
  addExercise: (circuitId: string) => void;
  handleDragEnd: (event: DragEndEvent, circuitId?: string) => void;
  updateCircuitSets: (circuitId: string, sets: number) => void;
}

const SortableCircuitItem: React.FC<SortableCircuitItemProps> = ({
  circuit,
  editMode,
  toggleExerciseCompletion,
  removeExercise,
  addExercise,
  handleDragEnd,
  updateCircuitSets
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: circuit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  // Set up sensors for drag-and-drop within this circuit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="circuit-block"
      {...attributes}
    >
      <div className="circuit-header">
        <div className="circuit-title-area">
          <h3>{circuit.name}</h3>
          {editMode && (
            <span 
              className="drag-handle circuit-drag-handle"
              {...listeners}
            >
              ☰
            </span>
          )}
        </div>
        <div className="circuit-sets">
          <button 
            className="set-control-btn"
            onClick={() => {
              if (circuit.sets > 1) {
                updateCircuitSets(circuit.id, circuit.sets - 1);
              }
            }}
          >
            -
          </button>
          {editMode ? (
            <input 
              type="number" 
              value={circuit.sets} 
              onChange={(e) => {
                updateCircuitSets(circuit.id, parseInt(e.target.value) || 1);
              }}
              min="1"
              className="sets-input"
            />
          ) : (
            <span>{circuit.sets}</span>
          )}
          <button 
            className="set-control-btn"
            onClick={() => {
              updateCircuitSets(circuit.id, circuit.sets + 1);
            }}
          >
            +
          </button>
          <span> sets</span>
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, circuit.id)}
      >
        <div className="exercises-list">
          <SortableContext 
            items={circuit.exercises.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {circuit.exercises.map(exercise => (
              <SortableExerciseItem
                key={exercise.id}
                exercise={exercise}
                circuitId={circuit.id}
                toggleExerciseCompletion={toggleExerciseCompletion}
                removeExercise={removeExercise}
                editMode={editMode}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      
      {editMode && (
        <button 
          className="add-exercise-btn"
          onClick={() => addExercise(circuit.id)}
        >
          + Add Exercise
        </button>
      )}
    </div>
  );
};

const WorkoutView: React.FC = () => {
  const { programId, weekId, workoutId } = useParams<{ programId: string; weekId: string; workoutId: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  
  // Set up sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent, circuitId?: string) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    if (circuitId) {
      // Find which circuit the exercise belongs to
      if (workout && workout.circuits) {
        const updatedCircuits = workout.circuits.map(circuit => {
          if (circuit.id === circuitId) {
            const oldIndex = circuit.exercises.findIndex(exercise => exercise.id === active.id);
            const newIndex = circuit.exercises.findIndex(exercise => exercise.id === over.id);
            
            return {
              ...circuit,
              exercises: arrayMove(circuit.exercises, oldIndex, newIndex)
            };
          }
          return circuit;
        });
        
        setWorkout({
          ...workout,
          circuits: updatedCircuits
        });
      }
    } else {
      // Update the circuits order
      if (workout && workout.circuits) {
        const oldIndex = workout.circuits.findIndex(circuit => circuit.id === active.id);
        const newIndex = workout.circuits.findIndex(circuit => circuit.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const updatedCircuits = arrayMove(workout.circuits, oldIndex, newIndex);
          
          setWorkout({
            ...workout,
            circuits: updatedCircuits
          });
        }
      }
    }
  };
  
  // Handle back button click
  const handleBackClick = () => {
    navigate(`/programs/${programId}/weeks/${weekId}`);
  };
  
  // Toggle exercise completion
  const toggleExerciseCompletion = (circuitId: string, exerciseId: string) => {
    if (!workout) return;
    
    const updatedCircuits = workout.circuits.map(circuit => {
      if (circuit.id === circuitId) {
        const updatedExercises = circuit.exercises.map(exercise => 
          exercise.id === exerciseId 
            ? { ...exercise, completed: !exercise.completed } 
            : exercise
        );
        return { ...circuit, exercises: updatedExercises };
      }
      return circuit;
    });
    
    setWorkout({
      ...workout,
      circuits: updatedCircuits
    });
  };
  
  // Remove exercise from circuit
  const removeExercise = (circuitId: string, exerciseId: string) => {
    if (!workout) return;
    
    const updatedCircuits = workout.circuits.map(circuit => {
      if (circuit.id === circuitId) {
        const updatedExercises = circuit.exercises.filter(exercise => exercise.id !== exerciseId);
        return { ...circuit, exercises: updatedExercises };
      }
      return circuit;
    });
    
    setWorkout({
      ...workout,
      circuits: updatedCircuits
    });
  };
  
  // Add a new circuit
  const addCircuit = () => {
    if (!workout) return;
    
    const newCircuit: Circuit = {
      id: `c${Date.now()}`,
      name: `Circuit ${workout.circuits.length + 1}`,
      sets: 3,
      exercises: []
    };
    
    setWorkout({
      ...workout,
      circuits: [...workout.circuits, newCircuit]
    });
  };
  
  // Add a new exercise to a circuit
  const addExercise = (circuitId: string) => {
    if (!workout) return;
    
    const updatedCircuits = workout.circuits.map(circuit => {
      if (circuit.id === circuitId) {
        const newExercise: Exercise = {
          id: `e${Date.now()}`,
          name: 'New Exercise',
          sets: circuit.sets,
          reps: 10,
          weight: 0,
          weightUnit: 'lbs',
          completed: false
        };
        return { ...circuit, exercises: [...circuit.exercises, newExercise] };
      }
      return circuit;
    });
    
    setWorkout({
      ...workout,
      circuits: updatedCircuits
    });
  };
  
  // Update circuit sets
  const updateCircuitSets = (circuitId: string, sets: number) => {
    if (!workout) return;
    
    const updatedCircuits = workout.circuits.map(circuit => {
      if (circuit.id === circuitId) {
        return { ...circuit, sets };
      }
      return circuit;
    });
    
    setWorkout({
      ...workout,
      circuits: updatedCircuits
    });
  };
  
  // Load workout data from API
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!programId || !weekId || !workoutId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // TODO: Check ownership once backend provides program owner info
        // For now, check if workout response contains userId/createdBy field
        // Or pass program data through navigation state from ProgramView
        const currentUserData = tokenService.getUser();
        const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
        
        const workoutResponse = await programService.getWorkout(programId, weekId, workoutId);
        
        // Check if workout has owner/creator information
        // Adjust this based on your actual API response structure
        const workoutOwnerId = (workoutResponse as any).userId || (workoutResponse as any).createdBy;
        const userIsOwner = currentUser && workoutOwnerId && workoutOwnerId === currentUser.userId;
        
        // Temporarily allow editing if no owner info is available (for development)
        setIsOwner(userIsOwner || !workoutOwnerId);
        
        // Transform API response to WorkoutDetails format
        const transformedWorkout: WorkoutDetails = {
          id: workoutResponse._id || workoutId,
          title: workoutResponse.title || 'Untitled Workout',
          description: workoutResponse.description || '',
          duration: workoutResponse.duration || 60,
          muscleGroups: workoutResponse.muscleGroups || [],
          circuits: workoutResponse.circuits || [],
          completed: workoutResponse.completed || false
        };
        
        setWorkout(transformedWorkout);
        
        // If no circuits exist and user is owner, enable edit mode automatically
        if (!transformedWorkout.circuits || transformedWorkout.circuits.length === 0) {
          if (userIsOwner || !workoutOwnerId) {
            setEditMode(true);
          }
        }
      } catch (err: any) {
        console.error('Error fetching workout:', err);
        
        // If workout doesn't exist (404), create an empty workout structure
        if (err.response?.status === 404) {
          // Allow creating new workouts (assume user has permission)
          setIsOwner(true);
          
          const emptyWorkout: WorkoutDetails = {
            id: workoutId,
            title: 'New Workout',
            description: 'Add a description for your workout',
            duration: 60,
            muscleGroups: [
              { name: 'Full Body', percentage: 100 }
            ],
            circuits: [],
            completed: false
          };
          setWorkout(emptyWorkout);
          setEditMode(true);
          setError(null);
        } else {
          setError(err.message || 'Failed to load workout');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [programId, weekId, workoutId]);
  
  // Save workout to API
  const saveWorkout = async () => {
    if (!workout || !programId || !weekId || !workoutId) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Transform WorkoutDetails to WorkoutRequest format
      const workoutRequest: WorkoutRequest = {
        title: workout.title,
        description: workout.description,
        duration: workout.duration,
        muscleGroups: workout.muscleGroups,
        circuits: workout.circuits,
        completed: workout.completed
      };
      
      await programService.updateWorkout(programId, weekId, workoutId, workoutRequest);
      setHasUnsavedChanges(false);
      
      // Show success message (you can add a toast notification here)
      console.log('Workout saved successfully');
    } catch (err: any) {
      console.error('Error saving workout:', err);
      setError(err.message || 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };
  
  // Mark changes as unsaved whenever workout is modified
  const updateWorkout = (updatedWorkout: WorkoutDetails) => {
    setWorkout(updatedWorkout);
    setHasUnsavedChanges(true);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading workout...</p>
      </div>
    );
  }
  
  if (error && !workout) {
    return (
      <div className="error-container">
        <h2>Error Loading Workout</h2>
        <p>{error}</p>
        <button onClick={() => navigate(`/programs/${programId}/weeks/${weekId}`)}>
          Back to Week
        </button>
      </div>
    );
  }
  
  if (!workout) {
    return <div className="loading-container">No workout data available</div>;
  }
  
  return (
    <div className="workout-view">
      <div className="workout-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to Week
        </button>
        <div className="header-actions">
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">Unsaved changes</span>
          )}
          {editMode && isOwner && (
            <button 
              className="save-button" 
              onClick={saveWorkout}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
          {isOwner && (
            <button className="edit-button" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      
      <div className="workout-details">
        <h1>{workout.title}</h1>
        <p className="workout-description">{workout.description}</p>
        
        <div className="workout-meta">
          <div className="duration-section">
            <h3>Duration</h3>
            {editMode && isOwner ? (
              <input 
                type="number" 
                value={workout.duration} 
                onChange={(e) => updateWorkout({...workout, duration: parseInt(e.target.value)})}
                min="1"
                className="duration-input"
              />
            ) : (
              <span>{workout.duration} minutes</span>
            )}
          </div>
          
          <div className="muscle-groups-section">
            <h3>Muscle Groups</h3>
            {editMode && isOwner ? (
              <div className="muscle-groups-list">
                {workout.muscleGroups.map((group, index) => (
                  <div key={index} className="muscle-group-item">
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => {
                        const updatedGroups = [...workout.muscleGroups];
                        updatedGroups[index] = {
                          ...group,
                          name: e.target.value
                        };
                        updateWorkout({...workout, muscleGroups: updatedGroups});
                      }}
                      className="muscle-name-input"
                      placeholder="Muscle group"
                    />
                    <div className="percentage-input-container">
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={group.percentage} 
                        onChange={(e) => {
                          const newPercentage = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          const updatedGroups = [...workout.muscleGroups];
                          
                          const otherGroupsTotal = workout.muscleGroups.reduce((sum, g, i) => 
                            i === index ? sum : sum + g.percentage, 0
                          );
                          
                          const adjustedPercentage = otherGroupsTotal + newPercentage > 100 
                            ? 100 - otherGroupsTotal 
                            : newPercentage;
                          
                          updatedGroups[index] = {
                            ...group,
                            percentage: adjustedPercentage
                          };
                          
                          updateWorkout({...workout, muscleGroups: updatedGroups});
                        }}
                        className="percentage-input"
                      />
                      <span className="percentage-symbol">%</span>
                    </div>
                    <button 
                      className="remove-group-btn"
                      onClick={() => {
                        if (workout.muscleGroups.length > 1) {
                          const updatedGroups = workout.muscleGroups.filter((_, i) => i !== index);
                          
                          const removedPercentage = group.percentage;
                          const remainingGroups = updatedGroups.length;
                          
                          if (remainingGroups > 0 && removedPercentage > 0) {
                            const addPerGroup = Math.floor(removedPercentage / remainingGroups);
                            const remainder = removedPercentage % remainingGroups;
                            
                            updatedGroups.forEach((g, i) => {
                              g.percentage += addPerGroup + (i < remainder ? 1 : 0);
                            });
                          }
                          
                          updateWorkout({...workout, muscleGroups: updatedGroups});
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="muscle-groups-actions">
                  <button 
                    className="add-group-btn"
                    onClick={() => {
                      const currentTotal = workout.muscleGroups.reduce((sum, g) => sum + g.percentage, 0);
                      const availablePercentage = Math.max(0, 100 - currentTotal);
                      
                      const newGroup = {
                        name: "New Group",
                        percentage: availablePercentage
                      };
                      
                      updateWorkout({
                        ...workout, 
                        muscleGroups: [...workout.muscleGroups, newGroup]
                      });
                    }}
                  >
                    + Add Muscle Group
                  </button>
                  <div className="total-percentage">
                    Total: {workout.muscleGroups.reduce((sum, g) => sum + g.percentage, 0)}%
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="combined-percentage-bar">
                  {workout.muscleGroups.map((group, index) => (
                    <div 
                      key={index}
                      className={`percentage-segment segment-color-${index % 8}`}
                      style={{width: `${group.percentage}%`}}
                    />
                  ))}
                </div>
                <div className="muscle-group-labels">
                  {workout.muscleGroups.map((group, index) => {
                    const width = `${group.percentage}%`;
                    
                    return (
                      <div 
                        key={index} 
                        className="muscle-group-label"
                        style={{width}}
                      >
                        <span className="muscle-name">{group.name}</span>
                        <span className="muscle-percentage">{group.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="circuits-container">
          {workout.circuits.length === 0 && !editMode ? (
            <div className="empty-state">
              <p>No circuits added yet.</p>
              {isOwner && (
                <button 
                  className="add-circuit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Start Building Workout
                </button>
              )}
            </div>
          ) : (
            <SortableContext 
              items={workout.circuits.map(circuit => circuit.id)}
              strategy={verticalListSortingStrategy}
            >
              {workout.circuits.map(circuit => (
                <SortableCircuitItem
                  key={circuit.id}
                  circuit={circuit}
                  editMode={editMode && isOwner}
                  toggleExerciseCompletion={toggleExerciseCompletion}
                  removeExercise={removeExercise}
                  addExercise={addExercise}
                  handleDragEnd={handleDragEnd}
                  updateCircuitSets={updateCircuitSets}
                />
              ))}
            </SortableContext>
          )}
          {editMode && isOwner && (
            <button 
              className="add-circuit-btn"
              onClick={addCircuit}
            >
              + Add Circuit
            </button>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default WorkoutView;
