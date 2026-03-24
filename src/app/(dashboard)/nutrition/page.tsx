"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalorieRing, MacroBar } from "@/components/shared";
import { NUTRITION_GOALS, MEAL_TYPE_LABELS } from "@/lib/constants";
import { useDailyNutrition, searchFoodOpenFoodFacts } from "@/lib/hooks/use-nutrition";
import { MealType, FoodItem } from "@/types";
import { Plus, Search, Scan, Clock, Trash2, Loader2, AlertCircle, Utensils } from "lucide-react";

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const mealTimes: Record<MealType, string> = {
  breakfast: "6:00 - 10:00",
  lunch: "12:00 - 15:00",
  dinner: "18:00 - 21:00",
  snack: "Cualquier hora",
};

export default function NutritionPage() {
  const { nutrition, loading, error, addMeal, addFoodItem, removeFoodItem } = useDailyNutrition();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    name: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    serving_size: string;
  }>>([]);
  const [searching, setSearching] = useState(false);

  const totals = {
    calories: nutrition?.calories || 0,
    protein: nutrition?.protein_g || 0,
    carbs: nutrition?.carbs_g || 0,
    fat: nutrition?.fat_g || 0,
  };

  const getMealItems = (mealType: MealType) => {
    return nutrition?.meals?.find(m => m.meal_type === mealType)?.items || [];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await searchFoodOpenFoodFacts(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const handleAddFood = async (mealType: MealType, food: typeof searchResults[0]) => {
    let meal = nutrition?.meals?.find(m => m.meal_type === mealType);
    if (!meal) {
      meal = await addMeal(mealType);
    }
    if (meal) {
      await addFoodItem(meal.id, {
        name: food.name,
        calories: food.calories,
        protein_g: food.protein_g,
        carbs_g: food.carbs_g,
        fat_g: food.fat_g,
        serving_size: food.serving_size,
        barcode: null,
      });
      setSearchResults([]);
      setSearchQuery("");
    }
  };

  const handleRemoveFood = async (itemId: string) => {
    await removeFoodItem(itemId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime" />
          <p className="text-muted-foreground">Cargando alimentación...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide">ALIMENTACIÓN</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra tus comidas y alcanza tus metas
        </p>
      </div>

      {/* Summary Cards - Stack on mobile */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardContent className="flex items-center justify-center p-4 sm:p-6">
            <CalorieRing
              consumed={totals.calories}
              goal={NUTRITION_GOALS.calories}
              size="lg"
            />
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <MacroBar
              label="Proteína"
              current={totals.protein}
              goal={NUTRITION_GOALS.protein_max}
              color="red"
            />
            <MacroBar
              label="Carbohidratos"
              current={totals.carbs}
              goal={NUTRITION_GOALS.carbs}
              color="blue"
            />
            <MacroBar
              label="Grasas"
              current={totals.fat}
              goal={NUTRITION_GOALS.fat}
              color="yellow"
            />
          </CardContent>
        </Card>
      </div>

      {/* Search & Add */}
      <Card className="glass border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 bg-secondary/50 border-0 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-lime/30 text-lime hover:bg-lime/10 flex-1 sm:flex-none">
                <Scan className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Escanear</span>
              </Button>
              <Button
                className="bg-lime text-dark hover:bg-lime/90 font-semibold flex-1 sm:flex-none"
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Buscar</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Resultados de búsqueda:</p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((food, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{food.name}</p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mt-1">
                        <span>{food.calories} kcal</span>
                        <span className="text-red-400">P: {food.protein_g}g</span>
                        <span className="text-blue-400">C: {food.carbs_g}g</span>
                        <span className="text-yellow-400">G: {food.fat_g}g</span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {mealTypes.map((type) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-lime hover:bg-lime/10"
                          onClick={() => handleAddFood(type, food)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span className="text-[10px]">{MEAL_TYPE_LABELS[type].slice(0, 3)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meals Tabs */}
      <Tabs defaultValue="breakfast" className="space-y-4">
        {/* Scrollable tabs on mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto sm:grid sm:w-full sm:grid-cols-4 bg-secondary/50 p-1 rounded-xl">
            {mealTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="data-[state=active]:bg-lime data-[state=active]:text-dark rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
              >
                {MEAL_TYPE_LABELS[type]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {mealTypes.map((type) => {
          const items = getMealItems(type);
          return (
            <TabsContent key={type} value={type} className="space-y-3 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">{mealTimes[type]}</span>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item: FoodItem) => (
                    <Card key={item.id} className="glass border-border/50">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mt-1">
                              <span className="text-red-400">P: {item.protein_g}g</span>
                              <span className="text-blue-400">C: {item.carbs_g}g</span>
                              <span className="text-yellow-400">G: {item.fat_g}g</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg sm:text-xl text-lime">
                              {item.calories}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-red-500"
                              onClick={() => handleRemoveFood(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass border-border/50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                    <Utensils className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No hay alimentos registrados
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Usa la búsqueda para agregar alimentos
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
