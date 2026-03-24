"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardStats, WorkoutDay } from "@/types";
import { NUTRITION_GOALS, HYDRATION_GOALS, WORKOUT_SCHEDULE } from "@/lib/constants";
import { format } from "date-fns";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const today = new Date().toISOString().split("T")[0];
        const dayOfWeek = format(new Date(), "EEEE").toLowerCase() as keyof typeof WORKOUT_SCHEDULE;

        // Parallel requests
        const [
          nutritionResult,
          waterResult,
          habitsResult,
          weightResult,
          workoutResult,
        ] = await Promise.all([
          // Calories and macros from meals
          supabase
            .from("meals")
            .select("items:food_items(calories, protein_g, carbs_g, fat_g)")
            .eq("date", today),

          // Water total
          supabase
            .from("water_logs")
            .select("amount_ml")
            .eq("date", today),

          // Habits completion
          supabase
            .from("habits")
            .select("id, habit_logs!inner(completed)")
            .eq("is_active", true)
            .eq("habit_logs.date", today),

          // Latest weight measurements
          supabase
            .from("body_measurements")
            .select("weight_kg, date")
            .order("date", { ascending: false })
            .limit(2),

          // Today's workout
          supabase
            .from("workout_sessions")
            .select("*")
            .eq("date", today)
            .single(),
        ]);

        // Calculate calories and macros
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        if (nutritionResult.data) {
          nutritionResult.data.forEach((meal) => {
            if (Array.isArray(meal.items)) {
              meal.items.forEach((item: { calories?: number; protein_g?: number; carbs_g?: number; fat_g?: number }) => {
                totalCalories += item.calories || 0;
                totalProtein += item.protein_g || 0;
                totalCarbs += item.carbs_g || 0;
                totalFat += item.fat_g || 0;
              });
            }
          });
        }

        // Calculate water
        const totalWater = waterResult.data?.reduce(
          (sum, log) => sum + (log.amount_ml || 0),
          0
        ) || 0;

        // Calculate habits
        const habitsData = habitsResult.data || [];
        const completedHabits = habitsData.filter(
          (h) => Array.isArray(h.habit_logs) && h.habit_logs.some((log: { completed: boolean }) => log.completed)
        ).length;

        // Get weight data
        const weights = weightResult.data || [];
        const currentWeight = weights[0]?.weight_kg || null;
        const previousWeight = weights[1]?.weight_kg || null;

        // Determine today's workout
        const todayWorkoutDay = WORKOUT_SCHEDULE[dayOfWeek] || null;
        const workoutCompleted = workoutResult.data?.finished_at != null;

        setStats({
          calories: {
            consumed: totalCalories,
            goal: NUTRITION_GOALS.calories,
          },
          macros: {
            protein_g: totalProtein,
            carbs_g: totalCarbs,
            fat_g: totalFat,
          },
          water: {
            consumed_ml: totalWater,
            goal_ml: HYDRATION_GOALS.daily_ml,
          },
          habits: {
            completed: completedHabits,
            total: habitsData.length,
          },
          weight: {
            current_kg: currentWeight || 0,
            previous_week_kg: previousWeight,
            difference: currentWeight && previousWeight
              ? currentWeight - previousWeight
              : null,
          },
          todayWorkout: {
            day: todayWorkoutDay as WorkoutDay | null,
            completed: workoutCompleted,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching dashboard stats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
