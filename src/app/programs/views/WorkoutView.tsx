import React, { useEffect, useState } from 'react';
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
import { WorkoutDetails } from './types';
import { WorkoutRequest, ProfileAccess, BlockType } from '@seenelm/train-core';

const WorkoutView: React.FC = () => {
  const { programId, weekId, workoutId } = useParams<{ programId: string; weekId: string; workoutId: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      setLoading(true);
      try {
        // Handle 'new' workout - don't fetch from API
        if (workoutId === 'new') {
          // Get duration from query parameters
          const searchParams = new URLSearchParams(window.location.search);
          const durationParam = searchParams.get('duration');
          const duration = durationParam ? parseInt(durationParam, 10) : 60;
          
          setWorkout({ 
            id: 'new', 
            title: 'New Workout', 
            description: '',
            duration: duration,
            muscleGroups: [],
            circuits: [],
            completed: false
          });
          setIsOwner(true);
          setEditMode(true);
          setLoading(false);
          return;
        }

        // Ensure required params exist
        if (!programId || !weekId || !workoutId) {
          throw new Error('Missing required parameters');
        }

        const user = JSON.parse(tokenService.getUser() || '{}');
        const response = await programService.getWorkout(programId, weekId, workoutId);
        
        // Transform WorkoutResponse to WorkoutDetails
        const transformedWorkout: WorkoutDetails = {
          id: response.id || workoutId,
          title: response.name || 'Untitled Workout',
          description: response.description || '',
          duration: response.duration || 60,
          muscleGroups: (response as any).muscleGroups || [],
          circuits: (response as any).circuits || [],
          completed: (response as any).completed || false
        };
        
        setWorkout(transformedWorkout);
        const userIsOwner = !response.createdBy || response.createdBy === user.userId;
        setIsOwner(userIsOwner);
        
        // Auto-enable edit mode for new workouts with no circuits
        if (userIsOwner && (!transformedWorkout.circuits || transformedWorkout.circuits.length === 0)) {
          setEditMode(true);
        }
      } catch {
        setWorkout({ 
          id: workoutId!, 
          title: 'New Workout', 
          description: '',
          duration: 60,
          muscleGroups: [],
          circuits: [],
          completed: false
        });
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
    if (!workout) return;
    setSaving(true);
  
    const user = JSON.parse(tokenService.getUser() || '{}');
  
    // Construct a properly typed WorkoutRequest object
    const workoutRequest: WorkoutRequest = {
      name: workout.title,
      description: workout.description,
      duration: workout.duration,
      accessType: ProfileAccess.Public,
      createdBy: user.userId,
      startDate: new Date(),
      endDate: new Date(),
      // optional props:
      category: workout.muscleGroups?.map(m => m.name) ?? [],
      blocks: workout.circuits,
    };
  
    try {
      await programService.updateWorkout(programId!, weekId!, workoutId!, workoutRequest);
      setHasUnsavedChanges(false);
    } finally {
      setSaving(false);
    }
  };
  

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !workout) return;

    const oldIndex = workout.circuits.findIndex((c, idx) => idx === active.id || c.order === active.id);
    const newIndex = workout.circuits.findIndex((c, idx) => idx === over.id || c.order === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const reordered = arrayMove(workout.circuits, oldIndex, newIndex);
    // Update order property for all blocks
    const reorderedWithOrder = reordered.map((circuit, idx) => ({
      ...circuit,
      order: idx
    }));
    
    setWorkout({ ...workout, circuits: reorderedWithOrder });
    setHasUnsavedChanges(true);
  };

  const addCircuit = () => {
    if (!workout) return;
    const newCircuit = {
      id: `c${Date.now()}`,
      type: BlockType.CIRCUIT,
      name: `Circuit ${workout.circuits.length + 1}`,
      sets: 3,
      exercises: [],
      order: workout.circuits.length + 1
    };
    setWorkout({ ...workout, circuits: [...workout.circuits, newCircuit] });
    setHasUnsavedChanges(true);
  };

  if (loading) return <p>Loading workout...</p>;

  return (
    <div className="workout-view">
      <WorkoutHeader
        onBack={() => navigate(`/programs/${programId}/weeks/${weekId}`)}
        editMode={editMode}
        isOwner={isOwner}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={saveWorkout}
        onToggleEdit={() => setEditMode(!editMode)}
      />

      <WorkoutDetailsSection
        workout={workout!}
        editMode={editMode}
        setWorkout={(w) => {
          setWorkout(w);
          setHasUnsavedChanges(true);
        }}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="circuits-container">
          {workout?.circuits?.length ? (
            <SortableContext items={workout.circuits.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {workout.circuits.map(circuit => (
                <CircuitItem
                  key={circuit.id}
                  circuit={circuit}
                  editMode={editMode && isOwner}
                  setWorkout={setWorkout}
                  workout={workout}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />
              ))}
            </SortableContext>
          ) : (
            !editMode && <EmptyState onStart={() => setEditMode(true)} isOwner={isOwner} />
          )}
          
          {editMode && isOwner && (
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
