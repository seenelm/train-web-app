// WorkoutView/types.ts

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: string;
  completed: boolean;
  notes?: string;
  measurementType?: 'reps' | 'time' | 'distance' | 'bodyweight';
}

export interface Circuit {
  id: string;
  name: string;
  sets: number;
  exercises: Exercise[];
}

export interface MuscleGroup {
  name: string;
  percentage: number;
}

export interface WorkoutDetails {
  id: string;
  title: string;
  description: string;
  duration: number;
  muscleGroups: MuscleGroup[];
  circuits: Circuit[];
  completed: boolean;
}
