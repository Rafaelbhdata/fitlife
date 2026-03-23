-- ============================================
-- FitLife Database Schema
-- Migration: 001_initial_schema
-- Created: 2026-03-23
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE muscle_group AS ENUM (
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'full_body'
);

CREATE TYPE workout_day AS ENUM (
  'upper_a', 'lower_a', 'upper_b', 'lower_b'
);

CREATE TYPE set_feeling AS ENUM (
  'too_heavy', 'hard', 'perfect', 'light', 'want_more'
);

CREATE TYPE meal_type AS ENUM (
  'breakfast', 'lunch', 'dinner', 'snack'
);

CREATE TYPE weight_unit AS ENUM (
  'lbs', 'bodyweight', 'seconds'
);

-- ============================================
-- USER PROFILES
-- ============================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  height_cm NUMERIC(5,2) DEFAULT 163,
  target_weight_kg NUMERIC(5,2) DEFAULT 79,
  daily_calorie_goal INTEGER DEFAULT 1685,
  daily_water_goal_ml INTEGER DEFAULT 2500,
  preferred_weight_unit TEXT DEFAULT 'kg' CHECK (preferred_weight_unit IN ('kg', 'lbs')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- EXERCISES (Reference Table)
-- ============================================

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups muscle_group[] NOT NULL,
  workout_day workout_day NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps_min INTEGER NOT NULL,
  reps_max INTEGER NOT NULL,
  suggested_weight_lbs NUMERIC(6,2),
  weight_unit weight_unit DEFAULT 'lbs',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS needed - exercises are read-only reference data

-- ============================================
-- WORKOUT SESSIONS
-- ============================================

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_day workout_day NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date, workout_day)
);

CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, date DESC);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workout sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- WORKOUT SETS
-- ============================================

CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight_lbs NUMERIC(6,2),
  reps_done INTEGER NOT NULL,
  feeling set_feeling,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workout_sets_session ON workout_sets(session_id);
CREATE INDEX idx_workout_sets_exercise ON workout_sets(exercise_id);

ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workout sets" ON workout_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = workout_sets.session_id
      AND ws.user_id = auth.uid()
    )
  );

-- ============================================
-- MEALS
-- ============================================

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type meal_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meals_user_date ON meals(user_id, date DESC);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meals" ON meals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FOOD ITEMS
-- ============================================

CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories NUMERIC(7,2) NOT NULL DEFAULT 0,
  protein_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  serving_size TEXT,
  barcode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_items_meal ON food_items(meal_id);

ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food items" ON food_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meals m
      WHERE m.id = food_items.meal_id
      AND m.user_id = auth.uid()
    )
  );

-- ============================================
-- BODY MEASUREMENTS
-- ============================================

CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2) NOT NULL,
  waist_cm NUMERIC(5,2),
  hip_cm NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

CREATE INDEX idx_body_measurements_user_date ON body_measurements(user_id, date DESC);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own measurements" ON body_measurements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- WATER LOGS
-- ============================================

CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_logs_user_date ON water_logs(user_id, date DESC);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own water logs" ON water_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HABITS
-- ============================================

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user ON habits(user_id);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HABIT LOGS
-- ============================================

CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(habit_id, date)
);

CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date DESC);
CREATE INDEX idx_habit_logs_habit ON habit_logs(habit_id);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habit logs" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- JOURNAL ENTRIES
-- ============================================

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  prompts_used TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date)
);

CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, date DESC);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get daily nutrition summary
CREATE OR REPLACE FUNCTION get_daily_nutrition(p_user_id UUID, p_date DATE)
RETURNS TABLE (
  total_calories NUMERIC,
  total_protein NUMERIC,
  total_carbs NUMERIC,
  total_fat NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(fi.calories), 0) as total_calories,
    COALESCE(SUM(fi.protein_g), 0) as total_protein,
    COALESCE(SUM(fi.carbs_g), 0) as total_carbs,
    COALESCE(SUM(fi.fat_g), 0) as total_fat
  FROM meals m
  LEFT JOIN food_items fi ON fi.meal_id = m.id
  WHERE m.user_id = p_user_id AND m.date = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily water total
CREATE OR REPLACE FUNCTION get_daily_water(p_user_id UUID, p_date DATE)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount_ml), 0)
  INTO total
  FROM water_logs
  WHERE user_id = p_user_id AND date = p_date;

  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get habit completion for a date
CREATE OR REPLACE FUNCTION get_habits_completion(p_user_id UUID, p_date DATE)
RETURNS TABLE (
  completed INTEGER,
  total INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(CASE WHEN hl.completed = TRUE THEN 1 END)::INTEGER as completed,
    COUNT(h.id)::INTEGER as total
  FROM habits h
  LEFT JOIN habit_logs hl ON hl.habit_id = h.id AND hl.date = p_date
  WHERE h.user_id = p_user_id AND h.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VIEWS
-- ============================================

-- View for exercise progress over time
CREATE OR REPLACE VIEW exercise_progress AS
SELECT
  ws.user_id,
  wset.exercise_id,
  e.name as exercise_name,
  ws.date,
  MAX(wset.weight_lbs) as max_weight,
  MAX(wset.reps_done) as max_reps
FROM workout_sets wset
JOIN workout_sessions ws ON ws.id = wset.session_id
JOIN exercises e ON e.id = wset.exercise_id
GROUP BY ws.user_id, wset.exercise_id, e.name, ws.date
ORDER BY ws.date DESC;
