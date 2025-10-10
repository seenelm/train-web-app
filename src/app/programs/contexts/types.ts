import {
  ProgramResponse,
  ProgramRequest,
  WeekResponse,
  WeekRequest,
  WorkoutResponse,
  WorkoutRequest,
  Exercise,
  MeasurementType,
  ProfileAccess,
  WorkoutDifficulty,
} from "@seenelm/train-core";
import { MuscleGroup } from "../views/types";

// ============================================================================
// SHARED TYPES FOR PROGRAM CONTEXTS
// ============================================================================

// State interfaces
export interface ProgramState {
  // Programs level
  programs: ProgramResponse[];
  currentProgram: ProgramResponse | null;
  programsLoading: boolean;
  programsError: string | null;

  // Weeks level
  weeks: WeekResponse[];
  currentWeek: WeekResponse | null;
  weeksLoading: boolean;
  weeksError: string | null;

  // Workouts level
  workouts: WorkoutResponse[];
  workoutRequest: WorkoutRequest;
  workoutLoading: boolean;
  workoutSaving: boolean;
  workoutHasUnsavedChanges: boolean;
  workoutEditMode: boolean;
  workoutIsOwner: boolean;
  workoutError: string | null;
}

// Action types for the reducer
export type ProgramAction =
  // Programs
  | { type: "SET_PROGRAMS_LOADING"; payload: boolean }
  | { type: "SET_PROGRAMS"; payload: ProgramResponse[] }
  | { type: "SET_PROGRAMS_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_PROGRAM"; payload: ProgramResponse | null }
  | { type: "ADD_PROGRAM"; payload: ProgramResponse }
  | {
      type: "UPDATE_PROGRAM";
      payload: { id: string; updates: Partial<ProgramResponse> };
    }
  | { type: "REMOVE_PROGRAM"; payload: string }

  // Weeks
  | { type: "SET_WEEKS_LOADING"; payload: boolean }
  | { type: "SET_WEEKS"; payload: WeekResponse[] }
  | { type: "SET_WEEKS_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_WEEK"; payload: WeekResponse | null }
  | { type: "ADD_WEEK"; payload: WeekResponse }
  | {
      type: "UPDATE_WEEK";
      payload: { id: string; updates: Partial<WeekResponse> };
    }
  | { type: "REMOVE_WEEK"; payload: string }

  // Workouts
  | { type: "SET_WORKOUTS"; payload: WorkoutResponse[] }
  | { type: "SET_WORKOUT_LOADING"; payload: boolean }
  | { type: "SET_WORKOUT_SAVING"; payload: boolean }
  | { type: "SET_WORKOUT_REQUEST"; payload: WorkoutRequest }
  | { type: "UPDATE_WORKOUT_REQUEST"; payload: Partial<WorkoutRequest> }
  | { type: "SET_WORKOUT_EDIT_MODE"; payload: boolean }
  | { type: "SET_WORKOUT_IS_OWNER"; payload: boolean }
  | { type: "SET_WORKOUT_HAS_UNSAVED_CHANGES"; payload: boolean }
  | { type: "SET_WORKOUT_ERROR"; payload: string | null };

// Context type
export interface ProgramContextType {
  state: ProgramState;
  dispatch: React.Dispatch<ProgramAction>;

  // Program management
  setPrograms: (programs: ProgramResponse[]) => void;
  setCurrentProgram: (program: ProgramResponse | null) => void;
  createProgram: (programRequest: ProgramRequest) => Promise<ProgramResponse>;
  updateProgram: (
    programId: string,
    updates: Partial<ProgramRequest>
  ) => Promise<void>;
  deleteProgram: (programId: string) => void;
  setProgramsLoading: (loading: boolean) => void;
  setProgramsError: (error: string | null) => void;

  // Week management
  loadWeeks: (programId: string) => Promise<void>;
  setCurrentWeek: (week: WeekResponse | null) => void;
  createWeek: (
    programId: string,
    weekRequest: WeekRequest
  ) => Promise<WeekResponse>;
  updateWeek: (
    programId: string,
    weekId: string,
    weekRequest: WeekRequest
  ) => Promise<void>;
  deleteWeek: (programId: string, weekId: string) => Promise<void>;
  setWeeksLoading: (loading: boolean) => void;
  setWeeksError: (error: string | null) => void;

  // Workout management
  setWorkouts: (workouts: WorkoutResponse[]) => void;
  updateWorkoutRequest: (updates: Partial<WorkoutRequest>) => void;
  setWorkoutRequest: (workoutRequest: WorkoutRequest) => void;
  setWorkoutLoading: (loading: boolean) => void;
  setWorkoutSaving: (saving: boolean) => void;
  setWorkoutEditMode: (editMode: boolean) => void;
  setWorkoutIsOwner: (isOwner: boolean) => void;
  setWorkoutHasUnsavedChanges: (hasChanges: boolean) => void;
  setWorkoutError: (error: string | null) => void;

  // Exercise-specific methods
  updateExerciseInBlock: (
    blockIndex: number,
    exerciseIndex: number,
    updatedExercise: Exercise
  ) => void;
  updateExerciseInBlockPartial: (
    blockIndex: number,
    exerciseIndex: number,
    updates: Partial<Exercise>
  ) => void;
  addExerciseToBlock: (blockIndex: number, exercise: Exercise) => void;
  removeExerciseFromBlock: (blockIndex: number, exerciseIndex: number) => void;
  reorderExercisesInBlock: (
    blockIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void;

  // Utility methods
  clearCurrentProgram: () => void;
  clearCurrentWeek: () => void;
  clearCurrentWorkout: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const programUtils = {
  // Transform WorkoutResponse to WorkoutRequest
  workoutResponseToRequest: (
    response: WorkoutResponse,
    userId: string
  ): WorkoutRequest => {
    return {
      name: response.name || "",
      description: response.description || "",
      category: response.category || [],
      difficulty: response.difficulty || WorkoutDifficulty.BEGINNER,
      duration: response.duration || 0,
      blocks: response.blocks || [],
      accessType: response.accessType || ProfileAccess.Public,
      createdBy: userId,
      startDate: response.startDate ? new Date(response.startDate) : new Date(),
      endDate: response.endDate ? new Date(response.endDate) : new Date(),
    };
  },

  // Create default WorkoutRequest for new workouts
  createDefaultWorkoutRequest: (
    userId: string,
    duration: number = 0
  ): WorkoutRequest => {
    return {
      name: "New Workout",
      description: "",
      category: [],
      difficulty: WorkoutDifficulty.BEGINNER,
      duration,
      blocks: [],
      accessType: ProfileAccess.Public,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date(),
    };
  },

  // Convert muscleGroups to category array (for API)
  muscleGroupsToCategory: (muscleGroups: MuscleGroup[]): string[] => {
    return muscleGroups.map((mg) => mg.name);
  },

  // Convert category array to muscleGroups (from API)
  categoryToMuscleGroups: (category: string[]): MuscleGroup[] => {
    return category.map((name) => ({ name, percentage: 0 }));
  },

  // Create default exercise
  createDefaultExercise: (order: number = 0): Exercise => {
    return {
      name: "New Exercise",
      targetReps: 10,
      targetDurationSec: 0,
      targetWeight: 0,
      targetDistance: 0,
      notes: "",
      order,
      measurementType: MeasurementType.REPS,
    };
  },

  // Validate WorkoutRequest
  validateWorkoutRequest: (request: WorkoutRequest): string[] => {
    const errors: string[] = [];

    if (!request.name.trim()) {
      errors.push("Workout name is required");
    }

    if (request.duration && request.duration <= 0) {
      errors.push("Duration must be greater than 0");
    }

    if (!request.createdBy) {
      errors.push("Created by user ID is required");
    }

    return errors;
  },
};
