"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalorieRing, MacroBar } from "@/components/shared";
import { NUTRITION_GOALS, MEAL_TYPE_LABELS } from "@/lib/constants";
import { MealType } from "@/types";
import { Plus, Search, Scan, Clock } from "lucide-react";

// Mock data
const mockMeals = {
  breakfast: [
    { id: "1", name: "Huevos revueltos (3)", calories: 210, protein: 18, carbs: 2, fat: 15 },
    { id: "2", name: "Pan integral (2 rebanadas)", calories: 160, protein: 6, carbs: 28, fat: 2 },
  ],
  lunch: [
    { id: "3", name: "Pechuga de pollo (150g)", calories: 248, protein: 46, carbs: 0, fat: 5 },
    { id: "4", name: "Arroz (1 taza)", calories: 206, protein: 4, carbs: 45, fat: 0 },
    { id: "5", name: "Brócoli (1 taza)", calories: 55, protein: 4, carbs: 11, fat: 0 },
  ],
  dinner: [],
  snack: [
    { id: "6", name: "Yogurt griego (170g)", calories: 100, protein: 17, carbs: 6, fat: 0 },
  ],
};

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export default function NutritionPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate totals from mock data
  const totals = Object.values(mockMeals).flat().reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl tracking-wide">ALIMENTACIÓN</h1>
        <p className="text-muted-foreground">
          Registra tus comidas y alcanza tus metas
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-border/50">
          <CardContent className="flex items-center justify-center p-6">
            <CalorieRing
              consumed={totals.calories}
              goal={NUTRITION_GOALS.calories}
              size="lg"
            />
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar alimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
            </div>
            <Button variant="outline" className="border-lime/30 text-lime hover:bg-lime/10">
              <Scan className="h-4 w-4 mr-2" />
              Escanear
            </Button>
            <Button className="bg-lime text-dark hover:bg-lime-400">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meals Tabs */}
      <Tabs defaultValue="breakfast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          {mealTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="data-[state=active]:bg-lime data-[state=active]:text-dark"
            >
              {MEAL_TYPE_LABELS[type]}
            </TabsTrigger>
          ))}
        </TabsList>

        {mealTypes.map((type) => (
          <TabsContent key={type} value={type} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {type === "breakfast" && "6:00 - 10:00"}
                  {type === "lunch" && "12:00 - 15:00"}
                  {type === "dinner" && "18:00 - 21:00"}
                  {type === "snack" && "Cualquier hora"}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-lime">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            {mockMeals[type].length > 0 ? (
              <div className="space-y-2">
                {mockMeals[type].map((item) => (
                  <Card key={item.id} className="glass border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>P: {item.protein}g</span>
                            <span>C: {item.carbs}g</span>
                            <span>G: {item.fat}g</span>
                          </div>
                        </div>
                        <span className="font-display text-xl text-lime">
                          {item.calories}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass border-border/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-2">
                    No hay alimentos registrados
                  </p>
                  <Button variant="outline" size="sm" className="border-lime/30 text-lime">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar alimento
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
