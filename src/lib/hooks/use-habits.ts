"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { HabitLog, HabitWithLog, JournalEntry } from "@/types";
import { DEFAULT_HABITS } from "@/lib/constants";

export function useHabits(date?: string) {
  const [habits, setHabits] = useState<HabitWithLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const targetDate = date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);

        // Get habits
        const { data: habitsData, error: habitsErr } = await supabase
          .from("habits")
          .select("*")
          .eq("is_active", true)
          .order("order_index");

        if (habitsErr) throw habitsErr;

        // Get logs for today
        const { data: logsData, error: logsErr } = await supabase
          .from("habit_logs")
          .select("*")
          .eq("date", targetDate);

        if (logsErr) throw logsErr;

        // Merge habits with their logs
        const habitsWithLogs = (habitsData || []).map((habit) => ({
          ...habit,
          log: logsData?.find((log) => log.habit_id === habit.id) || null,
        }));

        setHabits(habitsWithLogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching habits");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [targetDate]);

  const toggleHabit = useCallback(
    async (habitId: string, completed: boolean) => {
      try {
        const existingLog = habits.find((h) => h.id === habitId)?.log;

        if (existingLog) {
          // Update existing log
          const { error: err } = await supabase
            .from("habit_logs")
            .update({ completed })
            .eq("id", existingLog.id);

          if (err) throw err;
        } else {
          // Create new log
          const { error: err } = await supabase.from("habit_logs").insert({
            habit_id: habitId,
            date: targetDate,
            completed,
          });

          if (err) throw err;
        }

        setHabits((prev) =>
          prev.map((h) =>
            h.id === habitId
              ? { ...h, log: { ...h.log, completed } as HabitLog }
              : h
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error toggling habit");
        return false;
      }
    },
    [habits, targetDate, supabase]
  );

  const createDefaultHabits = useCallback(async () => {
    try {
      const habitsToInsert = DEFAULT_HABITS.map((habit, index) => ({
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        order_index: index,
        is_active: true,
      }));

      const { error: err } = await supabase
        .from("habits")
        .insert(habitsToInsert);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating default habits"
      );
      return false;
    }
  }, [supabase]);

  const completedCount = habits.filter((h) => h.log?.completed).length;
  const totalCount = habits.length;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    habits,
    completedCount,
    totalCount,
    completionRate,
    loading,
    error,
    toggleHabit,
    createDefaultHabits,
  };
}

export function useJournal(date?: string) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const targetDate = date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);

        const { data, error: err } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("date", targetDate)
          .single();

        if (err && err.code !== "PGRST116") throw err;
        setEntry(data || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching journal entry"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [targetDate]);

  const saveEntry = useCallback(
    async (content: string, mood?: number, promptsUsed?: string[]) => {
      try {
        const { data, error: err } = await supabase
          .from("journal_entries")
          .upsert(
            {
              date: targetDate,
              content,
              mood,
              prompts_used: promptsUsed,
            },
            { onConflict: "user_id,date" }
          )
          .select()
          .single();

        if (err) throw err;
        setEntry(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error saving journal entry"
        );
        return null;
      }
    },
    [targetDate, supabase]
  );

  return {
    entry,
    loading,
    error,
    saveEntry,
  };
}

export function useJournalHistory(limit = 10) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error: err } = await supabase
          .from("journal_entries")
          .select("*")
          .order("date", { ascending: false })
          .limit(limit);

        if (err) throw err;
        setEntries(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching journal history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [limit]);

  return { entries, loading, error };
}
