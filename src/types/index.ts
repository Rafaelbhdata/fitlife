// ============================================
// FitLife - Type Definitions
// ============================================

// ============================================
// User & Auth
// ============================================
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Exercises & Workouts
// ============================================
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "full_body";

export type WorkoutDay = "upper_a" | "lower_a" | "upper_b" | "lower_b";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_groups: MuscleGroup[];
  workout_day: WorkoutDay;
  sets: number;
  reps_min: number;
  reps_max: number;
  suggested_weight_lbs: number | null;
  weight_unit: "lbs" | "bodyweight" | "seconds";
  order_index: number;
  created_at: string;
}

export type SetFeeling = "too_heavy" | "hard" | "perfect" | "light" | "want_more";

export const SET_FEELING_EMOJI: Record<SetFeeling, string> = {
  too_heavy: "😅",
  hard: "😤",
  perfect: "👌",
  light: "😊",
  want_more: "🔥",
};

export const SET_FEELING_LABELS: Record<SetFeeling, string> = {
  too_heavy: "Muy pesado",
  hard: "Difícil",
  perfect: "Perfecto",
  light: "Ligero",
  want_more: "Quiero más",
};

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_day: WorkoutDay;
  date: string;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  weight_lbs: number | null;
  reps_done: number;
  feeling: SetFeeling | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSessionWithSets extends WorkoutSession {
  sets: (WorkoutSet & { exercise: Exercise })[];
}

// ============================================
// Nutrition
// ============================================
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Comida",
  dinner: "Cena",
  snack: "Snacks",
};

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  created_at: string;
}

export interface FoodItem {
  id: string;
  meal_id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_size: string | null;
  barcode: string | null;
  created_at: string;
}

export interface MealWithItems extends Meal {
  items: FoodItem[];
}

export interface DailyNutrition {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals: MealWithItems[];
}

export interface NutritionGoals {
  calories: number;
  protein_min: number;
  protein_max: number;
  carbs: number;
  fat: number;
}

// ============================================
// Body Measurements
// ============================================
export type WeightUnit = "kg" | "lbs";

export interface BodyMeasurement {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  waist_cm: number | null;
  hip_cm: number | null;
  notes: string | null;
  created_at: string;
}

export interface BodyGoals {
  current_weight_kg: number;
  target_weight_kg: number;
  height_cm: number;
}

// ============================================
// Hydration
// ============================================
export type WaterAmount = 250 | 500 | 1000;

export interface WaterLog {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface DailyHydration {
  date: string;
  total_ml: number;
  goal_ml: number;
  logs: WaterLog[];
}

// ============================================
// Habits
// ============================================
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface HabitWithLog extends Habit {
  log: HabitLog | null;
}

// ============================================
// Journaling
// ============================================
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  content: string;
  mood: number | null; // 1-5 scale
  prompts_used: string[] | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Dashboard & Stats
// ============================================
export interface DashboardStats {
  calories: {
    consumed: number;
    goal: number;
  };
  water: {
    consumed_ml: number;
    goal_ml: number;
  };
  habits: {
    completed: number;
    total: number;
  };
  weight: {
    current_kg: number;
    previous_week_kg: number | null;
    difference: number | null;
  };
  todayWorkout: {
    day: WorkoutDay | null;
    completed: boolean;
  };
}

// ============================================
// Reports
// ============================================
export interface WeeklyReport {
  week_start: string;
  week_end: string;
  workouts: {
    completed: number;
    total_exercises: number;
    exercises_progression: {
      exercise_id: string;
      exercise_name: string;
      start_weight: number;
      end_weight: number;
      change: number;
    }[];
  };
  nutrition: {
    avg_calories: number;
    avg_protein: number;
    avg_carbs: number;
    avg_fat: number;
  };
  weight: {
    start_kg: number | null;
    end_kg: number | null;
    change: number | null;
  };
  habits: {
    completion_rate: number;
    by_habit: {
      habit_id: string;
      habit_name: string;
      completed_days: number;
    }[];
  };
  journal_entries: JournalEntry[];
}

// ============================================
// Notifications
// ============================================
export type NotificationType = "hydration" | "meal" | "workout";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
