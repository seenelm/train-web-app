import React, { useState } from 'react';
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

// Dummy workout data
const workoutData: Record<string, WorkoutDetails> = {
  '1': {
    id: '1',
    title: 'Upper Body Strength',
    description: 'Focus on building strength in chest, shoulders, and arms with compound movements.',
    duration: 60,
    muscleGroups: [
      { name: 'Chest', percentage: 40 },
      { name: 'Back', percentage: 20 },
      { name: 'Shoulders', percentage: 20 },
      { name: 'Arms', percentage: 20 }
    ],
    circuits: [
      {
        id: 'c1',
        name: 'Circuit 1',
        sets: 4,
        exercises: [
          {
            id: 'e1',
            name: 'Chest Fly',
            sets: 4,
            reps: 15,
            weight: 40,
            weightUnit: 'lbs',
            completed: false
          },
          {
            id: 'e2',
            name: 'Tricep Rope Pulls',
            sets: 4,
            reps: 10,
            weight: 20,
            weightUnit: 'lbs',
            completed: false
          }
        ]
      },
      {
        id: 'c2',
        name: 'Circuit 2',
        sets: 3,
        exercises: [
          {
            id: 'e3',
            name: 'Leg Raises',
            sets: 3,
            reps: 15,
            weight: 30,
            weightUnit: 'lbs',
            completed: false
          },
          {
            id: 'e4',
            name: 'Incline Chest Press',
            sets: 3,
            reps: 15,
            weight: 40,
            weightUnit: 'lbs',
            completed: true
          },
          {
            id: 'e5',
            name: 'Dumbbell Rows',
            sets: 3,
            reps: 10,
            weight: 20,
            weightUnit: 'lbs',
            completed: true
          }
        ]
      }
    ],
    completed: false
  }
};

// Sortable exercise item component
interface SortableExerciseItemProps {
  exercise: Exercise;
  circuitId: string;
  toggleExerciseCompletion: (circuitId: string, exerciseId: string) => void;
  editMode: boolean;
}

const SortableExerciseItem: React.FC<SortableExerciseItemProps> = ({ 
  exercise, 
  circuitId,
  toggleExerciseCompletion,
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
    </div>
  );
};

// Sortable circuit item component
interface SortableCircuitItemProps {
  circuit: Circuit;
  editMode: boolean;
  toggleExerciseCompletion: (circuitId: string, exerciseId: string) => void;
  addExercise: (circuitId: string) => void;
  handleDragEnd: (event: DragEndEvent, circuitId?: string) => void;
  updateCircuitSets: (circuitId: string, sets: number) => void;
}

const SortableCircuitItem: React.FC<SortableCircuitItemProps> = ({
  circuit,
  editMode,
  toggleExerciseCompletion,
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
  
  // Load workout data
  React.useEffect(() => {
    console.log('WorkoutView - Attempting to load workout with ID:', workoutId);
    console.log('Available workout IDs:', Object.keys(workoutData));
    
    if (workoutId && workoutData[workoutId]) {
      console.log('Found workout data, setting state');
      setWorkout(workoutData[workoutId]);
    } else {
      // If the specific workout isn't found, use the first workout as a fallback
      // This is temporary until the backend is working
      console.log('Workout not found, using fallback data');
      const fallbackWorkoutId = Object.keys(workoutData)[0];
      if (fallbackWorkoutId) {
        // Create a copy of the fallback workout with the requested ID
        const fallbackWorkout = {
          ...workoutData[fallbackWorkoutId],
          id: workoutId || 'unknown'
        };
        setWorkout(fallbackWorkout);
      }
    }
  }, [workoutId]);
  
  if (!workout) {
    return <div className="loading-container">Loading workout...</div>;
  }
  
  return (
    <div className="workout-view">
      <div className="workout-header">
        <button className="back-button" onClick={handleBackClick}>
          &larr; Back to Week
        </button>
        <button className="edit-button" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>
      
      <div className="workout-details">
        <h1>{workout.title}</h1>
        <p className="workout-description">{workout.description}</p>
        
        <div className="workout-meta">
          <div className="duration-section">
            <h3>Duration</h3>
            {editMode ? (
              <input 
                type="number" 
                value={workout.duration} 
                onChange={(e) => setWorkout({...workout, duration: parseInt(e.target.value)})}
                min="1"
                className="duration-input"
              />
            ) : (
              <span>{workout.duration} minutes</span>
            )}
          </div>
          
          <div className="muscle-groups-section">
            <h3>Muscle Groups</h3>
            {editMode ? (
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
                        setWorkout({...workout, muscleGroups: updatedGroups});
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
                          
                          // Calculate the current total excluding this group
                          const otherGroupsTotal = workout.muscleGroups.reduce((sum, g, i) => 
                            i === index ? sum : sum + g.percentage, 0
                          );
                          
                          // If the new total would exceed 100%, adjust this group's percentage
                          const adjustedPercentage = otherGroupsTotal + newPercentage > 100 
                            ? 100 - otherGroupsTotal 
                            : newPercentage;
                          
                          updatedGroups[index] = {
                            ...group,
                            percentage: adjustedPercentage
                          };
                          
                          setWorkout({...workout, muscleGroups: updatedGroups});
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
                          
                          // Redistribute the removed percentage to other groups
                          const removedPercentage = group.percentage;
                          const remainingGroups = updatedGroups.length;
                          
                          if (remainingGroups > 0 && removedPercentage > 0) {
                            const addPerGroup = Math.floor(removedPercentage / remainingGroups);
                            const remainder = removedPercentage % remainingGroups;
                            
                            updatedGroups.forEach((g, i) => {
                              g.percentage += addPerGroup + (i < remainder ? 1 : 0);
                            });
                          }
                          
                          setWorkout({...workout, muscleGroups: updatedGroups});
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
                      // Calculate available percentage
                      const currentTotal = workout.muscleGroups.reduce((sum, g) => sum + g.percentage, 0);
                      const availablePercentage = Math.max(0, 100 - currentTotal);
                      
                      // Add new group with available percentage (or 0 if none available)
                      const newGroup = {
                        name: "New Group",
                        percentage: availablePercentage
                      };
                      
                      setWorkout({
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
                    // Calculate the width for this label based on the percentage
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
          <SortableContext 
            items={workout.circuits.map(circuit => circuit.id)}
            strategy={verticalListSortingStrategy}
          >
            {workout.circuits.map(circuit => (
              <SortableCircuitItem
                key={circuit.id}
                circuit={circuit}
                editMode={editMode}
                toggleExerciseCompletion={toggleExerciseCompletion}
                addExercise={addExercise}
                handleDragEnd={handleDragEnd}
                updateCircuitSets={updateCircuitSets}
              />
            ))}
          </SortableContext>
          {editMode && (
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
