import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NUTRITION_GOALS, HYDRATION_GOALS, WORKOUT_SCHEDULE } from "@/lib/constants";
import { format } from "date-fns";

export async function GET() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const dayOfWeek = format(new Date(), "EEEE").toLowerCase() as keyof typeof WORKOUT_SCHEDULE;

    // Get user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parallel requests for dashboard stats
    const [
      nutritionResult,
      waterResult,
      habitsResult,
      weightResult,
      workoutResult,
    ] = await Promise.all([
      // Calories
      supabase.rpc("get_daily_nutrition", {
        p_user_id: user.id,
        p_date: today,
      }),
      // Water
      supabase.rpc("get_daily_water", {
        p_user_id: user.id,
        p_date: today,
      }),
      // Habits
      supabase.rpc("get_habits_completion", {
        p_user_id: user.id,
        p_date: today,
      }),
      // Weight
      supabase
        .from("body_measurements")
        .select("weight_kg")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(2),
      // Today's workout
      supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single(),
    ]);

    const weights = weightResult.data || [];
    const currentWeight = weights[0]?.weight_kg || null;
    const previousWeight = weights[1]?.weight_kg || null;
    const todayWorkoutDay = WORKOUT_SCHEDULE[dayOfWeek] || null;

    const stats = {
      calories: {
        consumed: nutritionResult.data?.[0]?.total_calories || 0,
        goal: NUTRITION_GOALS.calories,
      },
      water: {
        consumed_ml: waterResult.data || 0,
        goal_ml: HYDRATION_GOALS.daily_ml,
      },
      habits: {
        completed: habitsResult.data?.[0]?.completed || 0,
        total: habitsResult.data?.[0]?.total || 0,
      },
      weight: {
        current_kg: currentWeight || 0,
        previous_week_kg: previousWeight,
        difference:
          currentWeight && previousWeight
            ? currentWeight - previousWeight
            : null,
      },
      todayWorkout: {
        day: todayWorkoutDay,
        completed: workoutResult.data?.finished_at != null,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
