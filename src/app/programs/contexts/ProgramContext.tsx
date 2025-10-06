import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ProgramResponse,
  ProgramRequest,
  WeekResponse,
  WeekRequest,
  WorkoutResponse,
  WorkoutRequest,
  MealResponse,
  MealRequest,
  NotesResponse,
  NotesRequest,
  Exercise,
  WorkoutDifficulty,
  ProfileAccess,
} from '@seenelm/train-core';
import { programService } from '../services/programService';
import { tokenService } from '../../../services/tokenService';
import { 
  ProgramState, 
  ProgramAction, 
  ProgramContextType,
  programUtils 
} from './types';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ProgramState = {
  // Programs
  programs: [],
  currentProgram: null,
  programsLoading: false,
  programsError: null,
  
  // Weeks
  weeks: [],
  currentWeek: null,
  weeksLoading: false,
  weeksError: null,
  
  // Workouts
  workouts: [],
  workoutRequest: {
    name: '',
    description: '',
    category: [],
    difficulty: WorkoutDifficulty.BEGINNER,
    duration: 0,
    blocks: [],
    accessType: ProfileAccess.Public,
    createdBy: '',
    startDate: new Date(),
    endDate: new Date(),
  },
  workoutLoading: false,
  workoutSaving: false,
  workoutHasUnsavedChanges: false,
  workoutEditMode: false,
  workoutIsOwner: false,
  workoutError: null,
  
  // UI state
  loading: false,
  error: null,
  editMode: false,
  hasUnsavedChanges: false,
  isOwner: false,
  saving: false,
};

// ============================================================================
// REDUCER
// ============================================================================

function programReducer(state: ProgramState, action: ProgramAction): ProgramState {
  switch (action.type) {
    // Programs
    case 'SET_PROGRAMS_LOADING':
      return { ...state, programsLoading: action.payload };
    case 'SET_PROGRAMS':
      return { ...state, programs: action.payload, programsLoading: false, programsError: null };
    case 'SET_PROGRAMS_ERROR':
      return { ...state, programsError: action.payload, programsLoading: false };
    case 'SET_CURRENT_PROGRAM':
      return { ...state, currentProgram: action.payload };
    case 'ADD_PROGRAM':
      return { ...state, programs: [...state.programs, action.payload] };
    case 'UPDATE_PROGRAM':
      return {
        ...state,
        programs: state.programs.map(program =>
          program.id === action.payload.id
            ? { ...program, ...action.payload.updates }
            : program
        ),
        currentProgram: state.currentProgram?.id === action.payload.id
          ? { ...state.currentProgram, ...action.payload.updates }
          : state.currentProgram
      };
    case 'REMOVE_PROGRAM':
      return {
        ...state,
        programs: state.programs.filter(program => program.id !== action.payload),
        currentProgram: state.currentProgram?.id === action.payload ? null : state.currentProgram
      };
    
    // Weeks
    case 'SET_WEEKS_LOADING':
      return { ...state, weeksLoading: action.payload };
    case 'SET_WEEKS':
      return { ...state, weeks: action.payload, weeksLoading: false, weeksError: null };
    case 'SET_WEEKS_ERROR':
      return { ...state, weeksError: action.payload, weeksLoading: false };
    case 'SET_CURRENT_WEEK':
      return { ...state, currentWeek: action.payload };
    case 'ADD_WEEK':
      return { ...state, weeks: [...state.weeks, action.payload] };
    case 'UPDATE_WEEK':
      return {
        ...state,
        weeks: state.weeks.map(week =>
          week.id === action.payload.id
            ? { ...week, ...action.payload.updates }
            : week
        ),
        currentWeek: state.currentWeek?.id === action.payload.id
          ? { ...state.currentWeek, ...action.payload.updates }
          : state.currentWeek
      };
    case 'REMOVE_WEEK':
      return {
        ...state,
        weeks: state.weeks.filter(week => week.id !== action.payload),
        currentWeek: state.currentWeek?.id === action.payload ? null : state.currentWeek
      };
    
    // Workouts
    case 'SET_WORKOUT_LOADING':
      return { ...state, workoutLoading: action.payload };
    case 'SET_WORKOUT_SAVING':
      return { ...state, workoutSaving: action.payload };
    case 'SET_WORKOUT_REQUEST':
      return { ...state, workoutRequest: action.payload, workoutHasUnsavedChanges: false };
    case 'UPDATE_WORKOUT_REQUEST':
      return { 
        ...state, 
        workoutRequest: { ...state.workoutRequest, ...action.payload },
        workoutHasUnsavedChanges: true 
      };
    case 'SET_WORKOUT_EDIT_MODE':
      return { ...state, workoutEditMode: action.payload };
    case 'SET_WORKOUT_IS_OWNER':
      return { ...state, workoutIsOwner: action.payload };
    case 'SET_WORKOUT_HAS_UNSAVED_CHANGES':
      return { ...state, workoutHasUnsavedChanges: action.payload };
    case 'SET_WORKOUT_ERROR':
      return { ...state, workoutError: action.payload };
  
    
    // UI state
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.payload };
    case 'SET_HAS_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };
    case 'SET_IS_OWNER':
      return { ...state, isOwner: action.payload };
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider: React.FC<ProgramProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(programReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  const setEditMode = (editMode: boolean) => {
    dispatch({ type: 'SET_EDIT_MODE', payload: editMode });
  };
  const setHasUnsavedChanges = (hasChanges: boolean) => {
    dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: hasChanges });
  };
  const setIsOwner = (isOwner: boolean) => {
    dispatch({ type: 'SET_IS_OWNER', payload: isOwner });
  };
  const setSaving = (saving: boolean) => {
    dispatch({ type: 'SET_SAVING', payload: saving });
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getCurrentUserId = (): string => {
    const userString = tokenService.getUser();
    if (!userString) {
      throw new Error("User not logged in");
    }
    const userData = JSON.parse(userString);
    return userData.userId;
  };

  const handleError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    const errorMessage = error?.message || `Failed to ${context}`;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  };

  // ============================================================================
  // PROGRAM MANAGEMENT
  // ============================================================================

  const loadPrograms = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_PROGRAMS_LOADING', payload: true });
      const userId = getCurrentUserId();
      const programs = await programService.fetchUserPrograms(userId);
      dispatch({ type: 'SET_PROGRAMS', payload: programs });
    } catch (error) {
      handleError(error, 'load programs');
    }
  };

  const setCurrentProgram = (program: ProgramResponse | null): void => {
    dispatch({ type: 'SET_CURRENT_PROGRAM', payload: program });
  };

  const createProgram = async (programRequest: ProgramRequest): Promise<ProgramResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const program = await programService.createProgram(programRequest);
      dispatch({ type: 'ADD_PROGRAM', payload: program });
      return program;
    } catch (error) {
      handleError(error, 'create program');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProgram = async (programId: string, updates: Partial<ProgramRequest>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Note: This would need to be implemented in the service
      // await programService.updateProgram(programId, updates);
      dispatch({ type: 'UPDATE_PROGRAM', payload: { id: programId, updates } });
    } catch (error) {
      handleError(error, 'update program');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProgram = async (programId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Note: This would need to be implemented in the service
      // await programService.deleteProgram(programId);
      dispatch({ type: 'REMOVE_PROGRAM', payload: programId });
    } catch (error) {
      handleError(error, 'delete program');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ============================================================================
  // WEEK MANAGEMENT
  // ============================================================================

  const loadWeeks = async (_programId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_WEEKS_LOADING', payload: true });
      // Note: This would need to be implemented in the service
      // const weeks = await programService.getProgramWeeks(programId);
      // dispatch({ type: 'SET_WEEKS', payload: weeks });
    } catch (error) {
      handleError(error, 'load weeks');
    }
  };

  const setCurrentWeek = (week: WeekResponse | null): void => {
    dispatch({ type: 'SET_CURRENT_WEEK', payload: week });
  };

  const createWeek = async (_programId: string, _weekRequest: WeekRequest): Promise<WeekResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Note: This would need to be implemented in the service
      // const week = await programService.createWeek(programId, weekRequest);
      // dispatch({ type: 'ADD_WEEK', payload: week });
      // return week;
      throw new Error('Create week not implemented');
    } catch (error) {
      handleError(error, 'create week');
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateWeek = async (programId: string, weekId: string, weekRequest: WeekRequest): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await programService.updateWeek(parseInt(programId), parseInt(weekId), weekRequest);
      dispatch({ type: 'UPDATE_WEEK', payload: { id: weekId, updates: weekRequest } });
    } catch (error) {
      handleError(error, 'update week');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteWeek = async (_programId: string, weekId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Note: This would need to be implemented in the service
      // await programService.deleteWeek(programId, weekId);
      dispatch({ type: 'REMOVE_WEEK', payload: weekId });
    } catch (error) {
      handleError(error, 'delete week');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ============================================================================
  // WORKOUT MANAGEMENT
  // ============================================================================

  const setWorkouts = (workouts: WorkoutResponse[]) => {
    dispatch({ type: 'SET_WORKOUTS', payload: workouts });
  };

  const updateWorkoutRequest = (updates: Partial<WorkoutRequest>) => {
    dispatch({ type: 'UPDATE_WORKOUT_REQUEST', payload: updates });
  };

  const setWorkoutRequest = (workoutRequest: WorkoutRequest) => {
    dispatch({ type: 'SET_WORKOUT_REQUEST', payload: workoutRequest });
  };

  const setWorkoutLoading = (loading: boolean) => {
    dispatch({ type: 'SET_WORKOUT_LOADING', payload: loading });
  };

  const setWorkoutSaving = (saving: boolean) => {
    dispatch({ type: 'SET_WORKOUT_SAVING', payload: saving });
  };

  const setWorkoutEditMode = (editMode: boolean) => {
    dispatch({ type: 'SET_WORKOUT_EDIT_MODE', payload: editMode });
  };

  const setWorkoutIsOwner = (isOwner: boolean) => {
    dispatch({ type: 'SET_WORKOUT_IS_OWNER', payload: isOwner });
  };

  const setWorkoutHasUnsavedChanges = (hasChanges: boolean) => {
    dispatch({ type: 'SET_WORKOUT_HAS_UNSAVED_CHANGES', payload: hasChanges });
  };

  const setWorkoutError = (error: string | null) => {
    dispatch({ type: 'SET_WORKOUT_ERROR', payload: error });
  };

  
  // ============================================================================
  // EXERCISE MANAGEMENT (for workout editing)
  // ============================================================================

  const updateExerciseInBlock = (blockIndex: number, exerciseIndex: number, updatedExercise: Exercise) => {
    if (!state.workoutRequest?.blocks) return;
    
    const updatedBlocks = state.workoutRequest.blocks.map((block, bIndex) => {
      if (bIndex === blockIndex) {
        const updatedExercises = block.exercises.map((exercise, eIndex) => 
          eIndex === exerciseIndex ? updatedExercise : exercise
        );
        return { ...block, exercises: updatedExercises };
      }
      return block;
    });
    
    updateWorkoutRequest({ blocks: updatedBlocks });
  };

  const updateExerciseInBlockPartial = (blockIndex: number, exerciseIndex: number, updates: Partial<Exercise>) => {
    if (!state.workoutRequest?.blocks) return;
    
    const updatedBlocks = state.workoutRequest.blocks.map((block, bIndex) => {
      if (bIndex === blockIndex) {
        const updatedExercises = block.exercises.map((exercise, eIndex) => 
          eIndex === exerciseIndex ? { ...exercise, ...updates } : exercise
        );
        return { ...block, exercises: updatedExercises };
      }
      return block;
    });
    
    updateWorkoutRequest({ blocks: updatedBlocks });
  };

  const addExerciseToBlock = (blockIndex: number, exercise: Exercise) => {
    if (!state.workoutRequest?.blocks) return;
    
    const updatedBlocks = state.workoutRequest.blocks.map((block, bIndex) => {
      if (bIndex === blockIndex) {
        const updatedExercises = [...block.exercises, exercise];
        return { ...block, exercises: updatedExercises };
      }
      return block;
    });
    
    updateWorkoutRequest({ blocks: updatedBlocks });
  };

  const removeExerciseFromBlock = (blockIndex: number, exerciseIndex: number) => {
    if (!state.workoutRequest?.blocks) return;
    
    const updatedBlocks = state.workoutRequest.blocks.map((block, bIndex) => {
      if (bIndex === blockIndex) {
        const updatedExercises = block.exercises.filter((_, eIndex) => eIndex !== exerciseIndex);
        return { ...block, exercises: updatedExercises };
      }
      return block;
    });
    
    updateWorkoutRequest({ blocks: updatedBlocks });
  };

  const reorderExercisesInBlock = (blockIndex: number, fromIndex: number, toIndex: number) => {
    if (!state.workoutRequest?.blocks) return;
    
    const updatedBlocks = state.workoutRequest.blocks.map((block, bIndex) => {
      if (bIndex === blockIndex) {
        const updatedExercises = [...block.exercises];
        const [movedExercise] = updatedExercises.splice(fromIndex, 1);
        updatedExercises.splice(toIndex, 0, movedExercise);
        
        // Update order property for all exercises
        const reorderedWithOrder = updatedExercises.map((exercise, index) => ({
          ...exercise,
          order: index
        }));
        
        return { ...block, exercises: reorderedWithOrder };
      }
      return block;
    });
    
    updateWorkoutRequest({ blocks: updatedBlocks });
  };

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const clearCurrentProgram = () => {
    dispatch({ type: 'SET_CURRENT_PROGRAM', payload: null });
  };

  const clearCurrentWeek = () => {
    dispatch({ type: 'SET_CURRENT_WEEK', payload: null });
  };

  const clearCurrentWorkout = () => {
    dispatch({ type: 'SET_WORKOUT_REQUEST', payload: initialState.workoutRequest });
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: ProgramContextType = {
    state,
    dispatch,
    
    // UI State
    setLoading,
    setError,
    setEditMode,
    setHasUnsavedChanges,
    setIsOwner,
    setSaving,
    
    // Program management
    loadPrograms,
    setCurrentProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    
    // Week management
    loadWeeks,
    setCurrentWeek,
    createWeek,
    updateWeek,
    deleteWeek,
    
    // Workout management
    setWorkouts,
    updateWorkoutRequest,
    setWorkoutRequest,
    setWorkoutLoading,
    setWorkoutSaving,
    setWorkoutEditMode,
    setWorkoutIsOwner,
    setWorkoutHasUnsavedChanges,
    setWorkoutError,
    
    // Exercise management
    updateExerciseInBlock,
    updateExerciseInBlockPartial,
    addExerciseToBlock,
    removeExerciseFromBlock,
    reorderExercisesInBlock,
    
    // Utility methods
    resetState,
    clearCurrentProgram,
    clearCurrentWeek,
    clearCurrentWorkout,
  };

  return (
    <ProgramContext.Provider value={contextValue}>
      {children}
    </ProgramContext.Provider>
  );
};

// ============================================================================
// HOOK TO USE THE CONTEXT
// ============================================================================

export const useProgramContext = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgramContext must be used within a ProgramProvider');
  }
  return context;
};

// Re-export utility functions for convenience
export { programUtils };