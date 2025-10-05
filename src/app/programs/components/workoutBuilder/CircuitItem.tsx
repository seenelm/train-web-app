// WorkoutView/components/CircuitItem.tsx
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Block, WorkoutDetails } from '../../views/types';
import ExerciseItem from './ExerciseItem';

interface Props {
  circuit: Block;
  editMode: boolean;
  workout: WorkoutDetails;
  setWorkout: (updated: WorkoutDetails) => void;
  setHasUnsavedChanges: (v: boolean) => void;
}

const CircuitItem: React.FC<Props> = ({
  circuit,
  editMode,
  workout,
  setWorkout,
  setHasUnsavedChanges,
}) => {
  const updateCircuit = (updated: Block) => {
    setWorkout({
      ...workout,
      circuits: workout.circuits.map((c) => (c.id === updated.id ? updated : c)),
    });
    setHasUnsavedChanges(true);
  };

  const removeCircuit = () => {
    setWorkout({
      ...workout,
      circuits: workout.circuits.filter((c) => c.id !== circuit.id),
    });
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = circuit.exercises.findIndex((e) => e.id === active.id);
    const newIndex = circuit.exercises.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(circuit.exercises, oldIndex, newIndex);
    updateCircuit({ ...circuit, exercises: reordered });
  };

  return (
    <div className="circuit-block">
      <div className="circuit-header">
        {editMode ? (
          <>
            <div className="circuit-sets">
              <label>Sets:</label>
              <input
                type="number"
                value={circuit.sets}
                onChange={(e) => updateCircuit({ ...circuit, sets: parseInt(e.target.value) || 1 })}
                min="1"
                className="sets-input"
              />
            </div>
            <div className="circuit-rest">
              <label>Rest:</label>
              <input
                type="number"
                value={(circuit as any).rest || 0}
                onChange={(e) => updateCircuit({ ...circuit, rest: parseInt(e.target.value) || 0 } as any)}
                min="0"
                className="rest-input"
                placeholder="Seconds"
              />
            </div>
            <input
              type="text"
              value={circuit.name}
              onChange={(e) => updateCircuit({ ...circuit, name: e.target.value })}
              className="circuit-name-input"
              placeholder="Circuit name"
            />
            <button
              className="remove-circuit-btn"
              onClick={removeCircuit}
              title="Remove circuit"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <div className="circuit-sets">
              <span className="sets-label">{circuit.sets} sets</span>
            </div>
            {(circuit as any).rest > 0 && (
              <div className="circuit-rest">
                <span className="rest-label">{(circuit as any).rest}s rest</span>
              </div>
            )}
            <h3>{circuit.name}</h3>
          </>
        )}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={circuit.exercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {circuit.exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              circuit={circuit}
              editMode={editMode}
              updateCircuit={updateCircuit}
            />
          ))}
        </SortableContext>
      </DndContext>

      {editMode && (
        <button
          className="add-exercise-btn"
          onClick={() =>
            updateCircuit({
              ...circuit,
              exercises: [
                ...circuit.exercises,
                {
                  id: `e${Date.now()}`,
                  name: 'New Exercise',
                  sets: circuit.sets || 3,
                  reps: 10,
                  weight: 0,
                  weightUnit: 'lbs',
                  completed: false,
                  order: circuit.exercises.length,
                },
              ],
            })
          }
        >
          + Add Exercise
        </button>
      )}
    </div>
  );
};

export default CircuitItem;
