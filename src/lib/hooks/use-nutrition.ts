"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { FoodItem, MealType, DailyNutrition } from "@/types";

export function useDailyNutrition(date?: string) {
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const targetDate = date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        setLoading(true);

        const { data: meals, error: mealsErr } = await supabase
          .from("meals")
          .select(
            `
            *,
            items:food_items(*)
          `
          )
          .eq("date", targetDate);

        if (mealsErr) throw mealsErr;

        // Calculate totals
        const totals = (meals || []).reduce(
          (acc, meal) => {
            const mealTotals = (meal.items || []).reduce(
              (mAcc: { calories: number; protein_g: number; carbs_g: number; fat_g: number }, item: FoodItem) => ({
                calories: mAcc.calories + (item.calories || 0),
                protein_g: mAcc.protein_g + (item.protein_g || 0),
                carbs_g: mAcc.carbs_g + (item.carbs_g || 0),
                fat_g: mAcc.fat_g + (item.fat_g || 0),
              }),
              { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
            );
            return {
              calories: acc.calories + mealTotals.calories,
              protein_g: acc.protein_g + mealTotals.protein_g,
              carbs_g: acc.carbs_g + mealTotals.carbs_g,
              fat_g: acc.fat_g + mealTotals.fat_g,
            };
          },
          { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
        );

        setNutrition({
          date: targetDate,
          ...totals,
          meals: meals || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching nutrition");
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [targetDate]);

  const addMeal = useCallback(
    async (mealType: MealType) => {
      try {
        const { data, error: err } = await supabase
          .from("meals")
          .insert({
            date: targetDate,
            meal_type: mealType,
          })
          .select()
          .single();

        if (err) throw err;
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error adding meal");
        return null;
      }
    },
    [targetDate, supabase]
  );

  const addFoodItem = useCallback(
    async (
      mealId: string,
      item: Omit<FoodItem, "id" | "meal_id" | "created_at">
    ) => {
      try {
        const { data, error: err } = await supabase
          .from("food_items")
          .insert({
            meal_id: mealId,
            ...item,
          })
          .select()
          .single();

        if (err) throw err;
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error adding food item");
        return null;
      }
    },
    [supabase]
  );

  const removeFoodItem = useCallback(
    async (itemId: string) => {
      try {
        const { error: err } = await supabase
          .from("food_items")
          .delete()
          .eq("id", itemId);

        if (err) throw err;
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error removing food item");
        return false;
      }
    },
    [supabase]
  );

  return {
    nutrition,
    loading,
    error,
    addMeal,
    addFoodItem,
    removeFoodItem,
  };
}

// Open Food Facts API types
interface OpenFoodFactsProduct {
  product_name?: string;
  code?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

// Open Food Facts API search
export async function searchFoodOpenFoodFacts(query: string) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=10`
    );

    if (!response.ok) throw new Error("API error");

    const data = await response.json();

    return (data.products || []).map((product: OpenFoodFactsProduct) => ({
      name: product.product_name || "Unknown",
      calories: product.nutriments?.["energy-kcal_100g"] || 0,
      protein_g: product.nutriments?.proteins_100g || 0,
      carbs_g: product.nutriments?.carbohydrates_100g || 0,
      fat_g: product.nutriments?.fat_100g || 0,
      serving_size: "100g",
      barcode: product.code || null,
    }));
  } catch {
    console.error("Error searching food:", query);
    return [];
  }
}
