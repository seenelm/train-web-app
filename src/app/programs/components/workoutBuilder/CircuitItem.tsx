// WorkoutView/components/CircuitItem.tsx
import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import ExerciseItem from './ExerciseItem';
import { Block, WorkoutRequest, MeasurementType } from '@seenelm/train-core';
import { useProgramContext } from '../../contexts/ProgramContext';

interface Props {
  block: Block;
  editMode: boolean;
  workout: WorkoutRequest;
}

const CircuitItem: React.FC<Props> = ({
  block,
  editMode,
  workout,
}) => {
  const { updateWorkoutRequest, setWorkoutHasUnsavedChanges } = useProgramContext();

  const updateBlock = (updated: Block) => {
    updateWorkoutRequest({
      ...workout,
      blocks: workout.blocks?.map((c) => (c.order === updated.order ? updated : c)),
    });
    setWorkoutHasUnsavedChanges(true);
  };

  const removeBlock = () => {
    updateWorkoutRequest({
      ...workout,
      blocks: workout.blocks?.filter((c) => c.order !== block.order),
    });
    setWorkoutHasUnsavedChanges(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = block.exercises.findIndex((e) => e.order === active.order);
    const newIndex = block.exercises.findIndex((e) => e.order === over.order);
    const reordered = arrayMove(block.exercises, oldIndex, newIndex);
    updateBlock({ ...block, exercises: reordered });
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
                value={block.targetSets}
                onChange={(e) => updateBlock({ ...block, targetSets: parseInt(e.target.value) || 1 })}
                min="1"
                className="sets-input"
              />
            </div>
            <div className="circuit-rest">
              <label>Rest:</label>
              <input
                type="number"
                value={(block as any).rest || 0}
                onChange={(e) => updateBlock({ ...block, rest: parseInt(e.target.value) || 0 } as any)}
                min="0"
                className="rest-input"
                placeholder="Seconds"
              />
            </div>
            <input
              type="text"
              value={block.name}
              onChange={(e) => updateBlock({ ...block, name: e.target.value })}
              className="circuit-name-input"
              placeholder="Circuit name"
            />
            <button
              className="remove-circuit-btn"
              onClick={removeBlock}
              title="Remove circuit"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <div className="circuit-sets">
              <span className="sets-label">{block.targetSets} sets</span>
            </div>
            {block.rest && block.rest > 0 && (
              <div className="circuit-rest">
                <span className="rest-label">{block.rest}s rest</span>
              </div>
            )}
            <h3>{block.name}</h3>
          </>
        )}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={block.exercises.map((e) => e.order)} strategy={verticalListSortingStrategy}>
          {block.exercises.map((exercise, exerciseIndex) => (
            <ExerciseItem
              key={exercise.order}
              exercise={exercise}
              editMode={editMode}
              blockIndex={workout.blocks?.findIndex(b => b.order === block.order) ?? 0}
              exerciseIndex={exerciseIndex}
            />
          ))}
        </SortableContext>
      </DndContext>

      {editMode && (
        <button
          className="add-exercise-btn"
          onClick={() =>
            updateBlock({
              ...block,
              exercises: [
                ...block.exercises,
                {
                  name: 'New Exercise',
                  rest: 0,
                  targetReps: 10,
                  targetDurationSec: 0,
                  targetWeight: 0,
                  targetDistance: 0,
                  measurementType: MeasurementType.REPS,
                  notes: '',
                  order: block.exercises.length,
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
