"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DailyHydration } from "@/types";
import { HYDRATION_GOALS } from "@/lib/constants";

export function useHydration(date?: string) {
  const [hydration, setHydration] = useState<DailyHydration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const targetDate = date || new Date().toISOString().split("T")[0];

  const fetchHydration = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: err } = await supabase
        .from("water_logs")
        .select("*")
        .eq("date", targetDate)
        .order("logged_at", { ascending: false });

      if (err) throw err;

      const totalMl = (data || []).reduce(
        (sum, log) => sum + log.amount_ml,
        0
      );

      setHydration({
        date: targetDate,
        total_ml: totalMl,
        goal_ml: HYDRATION_GOALS.daily_ml,
        logs: data || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching hydration");
    } finally {
      setLoading(false);
    }
  }, [targetDate, supabase]);

  useEffect(() => {
    fetchHydration();
  }, [fetchHydration]);

  const addWater = useCallback(
    async (amountMl: number) => {
      try {
        const { data, error: err } = await supabase
          .from("water_logs")
          .insert({
            date: targetDate,
            amount_ml: amountMl,
            logged_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (err) throw err;

        setHydration((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            total_ml: prev.total_ml + amountMl,
            logs: [data, ...prev.logs],
          };
        });

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error adding water");
        return null;
      }
    },
    [targetDate, supabase]
  );

  const removeWaterLog = useCallback(
    async (logId: string) => {
      try {
        const logToRemove = hydration?.logs.find((l) => l.id === logId);
        if (!logToRemove) return false;

        const { error: err } = await supabase
          .from("water_logs")
          .delete()
          .eq("id", logId);

        if (err) throw err;

        setHydration((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            total_ml: prev.total_ml - logToRemove.amount_ml,
            logs: prev.logs.filter((l) => l.id !== logId),
          };
        });

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error removing water log");
        return false;
      }
    },
    [hydration, supabase]
  );

  return {
    hydration,
    loading,
    error,
    addWater,
    removeWaterLog,
    refresh: fetchHydration,
  };
}
