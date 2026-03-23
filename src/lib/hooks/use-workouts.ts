"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Exercise,
  WorkoutSession,
  WorkoutSet,
  WorkoutDay,
  SetFeeling,
} from "@/types";

export function useExercises(workoutDay?: WorkoutDay) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
          .from("exercises")
          .select("*")
          .eq("is_active", true)
          .order("order_index");

        if (workoutDay) {
          query = query.eq("workout_day", workoutDay);
        }

        const { data, error: err } = await query;

        if (err) throw err;
        setExercises(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [workoutDay]);

  return { exercises, loading, error };
}

export function useWorkoutSession(date?: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const targetDate = date || new Date().toISOString().split("T")[0];

        const { data: sessionData, error: sessionErr } = await supabase
          .from("workout_sessions")
          .select("*")
          .eq("date", targetDate)
          .single();

        if (sessionErr && sessionErr.code !== "PGRST116") throw sessionErr;

        if (sessionData) {
          setSession(sessionData);

          const { data: setsData, error: setsErr } = await supabase
            .from("workout_sets")
            .select("*")
            .eq("session_id", sessionData.id)
            .order("set_number");

          if (setsErr) throw setsErr;
          setSets(setsData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [date]);

  const startSession = useCallback(
    async (workoutDay: WorkoutDay) => {
      try {
        const { data, error: err } = await supabase
          .from("workout_sessions")
          .insert({
            workout_day: workoutDay,
            date: new Date().toISOString().split("T")[0],
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (err) throw err;
        setSession(data);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error starting session");
        return null;
      }
    },
    [supabase]
  );

  const logSet = useCallback(
    async (
      exerciseId: string,
      setNumber: number,
      weightLbs: number | null,
      repsDone: number,
      feeling?: SetFeeling
    ) => {
      if (!session) return null;

      try {
        const { data, error: err } = await supabase
          .from("workout_sets")
          .insert({
            session_id: session.id,
            exercise_id: exerciseId,
            set_number: setNumber,
            weight_lbs: weightLbs,
            reps_done: repsDone,
            feeling,
          })
          .select()
          .single();

        if (err) throw err;
        setSets((prev) => [...prev, data]);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error logging set");
        return null;
      }
    },
    [session, supabase]
  );

  const finishSession = useCallback(
    async (notes?: string) => {
      if (!session) return null;

      try {
        const { data, error: err } = await supabase
          .from("workout_sessions")
          .update({
            finished_at: new Date().toISOString(),
            notes,
          })
          .eq("id", session.id)
          .select()
          .single();

        if (err) throw err;
        setSession(data);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error finishing session");
        return null;
      }
    },
    [session, supabase]
  );

  return {
    session,
    sets,
    loading,
    error,
    startSession,
    logSet,
    finishSession,
  };
}

export function useWorkoutHistory(limit = 10) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error: err } = await supabase
          .from("workout_sessions")
          .select("*")
          .order("date", { ascending: false })
          .limit(limit);

        if (err) throw err;
        setSessions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit]);

  return { sessions, loading, error };
}
