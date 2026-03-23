"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BodyMeasurement } from "@/types";

export function useBodyMeasurements(limit = 10) {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLoading(true);

        const { data, error: err } = await supabase
          .from("body_measurements")
          .select("*")
          .order("date", { ascending: false })
          .limit(limit);

        if (err) throw err;
        setMeasurements(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching measurements"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [limit]);

  const addMeasurement = useCallback(
    async (data: {
      weight_kg: number;
      waist_cm?: number;
      hip_cm?: number;
      notes?: string;
    }) => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Upsert - update if exists for today, insert if not
        const { data: result, error: err } = await supabase
          .from("body_measurements")
          .upsert(
            {
              date: today,
              ...data,
            },
            { onConflict: "user_id,date" }
          )
          .select()
          .single();

        if (err) throw err;

        setMeasurements((prev) => {
          const existing = prev.findIndex((m) => m.date === today);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = result;
            return updated;
          }
          return [result, ...prev];
        });

        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error adding measurement"
        );
        return null;
      }
    },
    [supabase]
  );

  const latestMeasurement = measurements[0] || null;
  const previousMeasurement = measurements[1] || null;

  const weightChange = latestMeasurement && previousMeasurement
    ? latestMeasurement.weight_kg - previousMeasurement.weight_kg
    : null;

  return {
    measurements,
    latestMeasurement,
    previousMeasurement,
    weightChange,
    loading,
    error,
    addMeasurement,
  };
}
