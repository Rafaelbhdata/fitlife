"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalorieRing, MacroBar } from "@/components/shared";
import { NUTRITION_GOALS } from "@/lib/constants";
import {
  FileText,
  Download,
  Calendar,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Scale,
} from "lucide-react";

// Mock data for weekly report
const mockWeeklyData = {
  week: "18 - 24 Marzo 2026",
  workouts: {
    completed: 4,
    total: 4,
    exercises: [
      { name: "Press de Banca", startWeight: 75, endWeight: 80, change: 5 },
      { name: "Sentadilla", startWeight: 100, endWeight: 105, change: 5 },
      { name: "Peso Muerto", startWeight: 110, endWeight: 115, change: 5 },
    ],
  },
  nutrition: {
    avgCalories: 1650,
    avgProtein: 142,
    avgCarbs: 155,
    avgFat: 52,
  },
  weight: {
    start: 86.0,
    end: 85.2,
    change: -0.8,
  },
  habits: {
    completionRate: 85,
    byHabit: [
      { name: "Dormir 7-8 horas", completed: 6 },
      { name: "Meta proteína", completed: 7 },
      { name: "No refresco/alcohol", completed: 7 },
      { name: "30 min movimiento", completed: 5 },
      { name: "Meta agua", completed: 6 },
      { name: "Journaling", completed: 5 },
    ],
  },
};

export default function ReportsPage() {
  const handleExportPDF = () => {
    // TODO: Implement PDF export with jsPDF
    console.log("Exporting PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">REPORTES</h1>
          <p className="text-muted-foreground">
            Resumen semanal de tu progreso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border">
            <Calendar className="h-4 w-4 mr-2" />
            Semana anterior
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-lime text-dark hover:bg-lime-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Week selector */}
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <FileText className="h-5 w-5 text-lime" />
            <span className="font-display text-xl">{mockWeeklyData.week}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Workouts */}
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
                <Dumbbell className="h-5 w-5 text-lime" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entrenamientos</p>
                <p className="font-display text-2xl">
                  {mockWeeklyData.workouts.completed}/{mockWeeklyData.workouts.total}
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-0">
              100% completado
            </Badge>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Promedio calorías</p>
            <CalorieRing
              consumed={mockWeeklyData.nutrition.avgCalories}
              goal={NUTRITION_GOALS.calories}
              size="sm"
              showLabel={false}
            />
            <p className="font-display text-xl text-center mt-2">
              {mockWeeklyData.nutrition.avgCalories} kcal
            </p>
          </CardContent>
        </Card>

        {/* Weight Change */}
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                {mockWeeklyData.weight.change < 0 ? (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cambio de peso</p>
                <p className={`font-display text-2xl ${
                  mockWeeklyData.weight.change < 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {mockWeeklyData.weight.change > 0 ? "+" : ""}
                  {mockWeeklyData.weight.change} kg
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {mockWeeklyData.weight.start} → {mockWeeklyData.weight.end} kg
            </p>
          </CardContent>
        </Card>

        {/* Habits */}
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
                <CheckSquare className="h-5 w-5 text-lime" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hábitos</p>
                <p className="font-display text-2xl">
                  {mockWeeklyData.habits.completionRate}%
                </p>
              </div>
            </div>
            <Badge className="bg-lime/10 text-lime border-0">
              Buen progreso
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exercise Progress */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progresión de ejercicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockWeeklyData.workouts.exercises.map((exercise) => (
              <div
                key={exercise.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="font-medium">{exercise.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {exercise.startWeight} → {exercise.endWeight} lbs
                  </p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-0">
                  +{exercise.change} lbs
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Macros Average */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio de macros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MacroBar
              label="Proteína"
              current={mockWeeklyData.nutrition.avgProtein}
              goal={NUTRITION_GOALS.protein_max}
              color="red"
            />
            <MacroBar
              label="Carbohidratos"
              current={mockWeeklyData.nutrition.avgCarbs}
              goal={NUTRITION_GOALS.carbs}
              color="blue"
            />
            <MacroBar
              label="Grasas"
              current={mockWeeklyData.nutrition.avgFat}
              goal={NUTRITION_GOALS.fat}
              color="yellow"
            />
          </CardContent>
        </Card>

        {/* Habit Breakdown */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Desglose de hábitos (días completados de 7)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockWeeklyData.habits.byHabit.map((habit) => (
                <div
                  key={habit.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <span className="text-sm">{habit.name}</span>
                  <Badge variant="outline" className={
                    habit.completed >= 6
                      ? "border-green-500/30 text-green-500"
                      : habit.completed >= 4
                      ? "border-yellow-500/30 text-yellow-500"
                      : "border-red-500/30 text-red-500"
                  }>
                    {habit.completed}/7
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
