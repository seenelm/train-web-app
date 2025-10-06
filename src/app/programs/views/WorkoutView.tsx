import React, { useEffect,   } from 'react';
import { useParams, useNavigate } from 'react-router';
import './WorkoutView.css';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { programService } from '../services/programService';
import { tokenService } from '../../../services/tokenService';
import WorkoutHeader from './WorkoutHeader';
import WorkoutDetailsSection from './WorkoutDetailsSection';
import CircuitItem from '../components/workoutBuilder/CircuitItem';
import EmptyState from '../components/workoutBuilder/EmptyState';
import { arrayMove } from '@dnd-kit/sortable';
import { WorkoutRequest, BlockType, Block } from '@seenelm/train-core';
import { useProgramContext, programUtils } from '../contexts/ProgramContext';

const WorkoutView: React.FC = () => {
  const { programId, weekId, workoutId } = useParams<{ programId: string; weekId: string; workoutId: string }>();
  const navigate = useNavigate();

  const {
    state,
    setWorkoutRequest,
    setLoading,
    setSaving,
    setEditMode,
    setIsOwner,
    setHasUnsavedChanges,
    setError,
  } = useProgramContext();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      console.log('Fetching workout...');
      setLoading(true);
      try {
        const user = JSON.parse(tokenService.getUser() || '{}');
        // Handle 'new' workout - don't fetch from API
        if (workoutId === 'new') {
          if (!state.workoutRequest) {
            console.log('No workout request');
            return;
          }
          // const searchParams = new URLSearchParams(window.location.search);
          // const durationParam = searchParams.get('duration');
          // const duration = durationParam ? parseInt(durationParam, 10) : 60;

          // const defaultRequest = workoutUtils.createDefaultRequest(user.userId, duration);
          // console.log('Default request:', defaultRequest);
          // setWorkoutRequest(defaultRequest);

          setIsOwner(true);
          setEditMode(true);
          setLoading(false);
          return;
        }

        // Ensure required params exist
        if (!programId || !weekId || !workoutId) {
          throw new Error('Missing required parameters');
        }

        
        const response = await programService.getWorkout(programId, weekId, workoutId);
        
        const workoutRequest = programUtils.workoutResponseToRequest(response, user.userId);
        setWorkoutRequest(workoutRequest);
        
        const userIsOwner = !response.createdBy || response.createdBy === user.userId;
        setIsOwner(userIsOwner);
        
        // Auto-enable edit mode for new workouts with no circuits
        if (userIsOwner && (!workoutRequest.blocks || workoutRequest.blocks.length === 0)) {
          setEditMode(true);
        }
       
      } catch (error) {
        console.error('Error fetching workout:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch workout');
        const user = JSON.parse(tokenService.getUser() || '{}');
        const defaultRequest = programUtils.createDefaultWorkoutRequest(user.userId);
        setWorkoutRequest(defaultRequest);
        setIsOwner(true);
        setEditMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [programId, weekId, workoutId]);

  // Save workout
  const saveWorkout = async () => {  
    if (!state.workoutRequest) {
      console.log('No workout request, returning early');
      return;
    }
    setSaving(true);
    setError(null);

    console.log('Saving workout Request: ', state.workoutRequest);
  
    if (workoutId === 'new') {
      await handleCreateWorkout(state.workoutRequest);
    } else {
      await handleUpdateWorkout(state.workoutRequest);
    }
  };

  const handleCreateWorkout = async (request: WorkoutRequest) => {
    try {
      const response = await programService.createWorkout(programId!, weekId!, request);
      setWorkoutRequest(response);
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(error instanceof Error ? error.message : 'Failed to create workout');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateWorkout = async (request: WorkoutRequest) => {
    try {
      await programService.updateWorkout(programId!, weekId!, workoutId!, request);
    } catch (error) {
      console.error('Error updating workout:', error);
      setError(error instanceof Error ? error.message : 'Failed to update workout');
    } finally {
      setSaving(false);
    }
  };
  

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !state.workoutRequest) return;

    const oldIndex = state.workoutRequest.blocks?.findIndex((c, idx) => idx === active.id || c.order === active.id);
    const newIndex = state.workoutRequest.blocks?.findIndex((c, idx) => idx === over.id || c.order === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const reordered = arrayMove(state.workoutRequest.blocks!, oldIndex!, newIndex!);
    // Update order property for all blocks
    const reorderedWithOrder = reordered.map((circuit, idx) => ({
      ...circuit,
      order: idx
    }));
    
    setWorkoutRequest({ ...state.workoutRequest, blocks: reorderedWithOrder });
    // setWorkout({ ...workout, circuits: reorderedWithOrder });
    setHasUnsavedChanges(true);
  };

  const addCircuit = () => {
    if (!state.workoutRequest || !state.workoutRequest.blocks) {
      console.log('No workout request or blocks');
      return;
    } 

    const newCircuit: Block = {
      type: BlockType.CIRCUIT,
      name: `Circuit ${state.workoutRequest.blocks.length + 1}`,
      targetSets: 3,
      rest: 0,
      exercises: [],
      order: state.workoutRequest.blocks?.length + 1
    };
    setWorkoutRequest({ ...state.workoutRequest, blocks: [...state.workoutRequest.blocks, newCircuit] });
    setHasUnsavedChanges(true);
  };

  if (state.loading) return <p>Loading workout...</p>;

  return (
    <div className="workout-view">
      <WorkoutHeader
        onBack={() => navigate(`/programs/${programId}/weeks/${weekId}`)}
        editMode={state.editMode}
        isOwner={state.isOwner}
        saving={state.saving}
        hasUnsavedChanges={state.hasUnsavedChanges}
        onSave={saveWorkout}
        onToggleEdit={() => setEditMode(!state.editMode)}
      />

      <WorkoutDetailsSection
        editMode={state.editMode}
        setHasUnsavedChanges={setHasUnsavedChanges}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="circuits-container">
          {state.workoutRequest?.blocks?.length ? (
            <SortableContext items={state.workoutRequest.blocks.map(c => c.order)} strategy={verticalListSortingStrategy}>
              {state.workoutRequest.blocks.map(circuit => (
                <CircuitItem
                  key={circuit.order}
                  block={circuit}
                  editMode={state.editMode && state.isOwner}
                  workout={state.workoutRequest!}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />
              ))}
            </SortableContext>
          ) : (
            !state.editMode && <EmptyState onStart={() => setEditMode(true)} isOwner={state.isOwner} />
          )}
          
          {state.editMode && state.isOwner && (
            <button className="add-circuit-btn" onClick={addCircuit}>
              + Add Circuit
            </button>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default WorkoutView;
