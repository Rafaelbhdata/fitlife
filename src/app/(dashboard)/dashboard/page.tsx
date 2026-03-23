"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalorieRing, WaterProgress, MacroBar, StatCard, HabitCheckbox } from "@/components/shared";
import { NUTRITION_GOALS, HYDRATION_GOALS, WORKOUT_DAY_SHORT, WORKOUT_SCHEDULE } from "@/lib/constants";
import {
  Dumbbell,
  Scale,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Utensils,
  Droplets,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data - esto vendrá de Supabase
const mockData = {
  calories: { consumed: 1250, goal: NUTRITION_GOALS.calories },
  macros: {
    protein: 95,
    carbs: 120,
    fat: 45,
  },
  water: { consumed: 1750, goal: HYDRATION_GOALS.daily_ml },
  weight: {
    current: 85.2,
    previousWeek: 86.0,
  },
  habits: [
    { id: "1", name: "Dormir 7-8 horas", icon: "🌙", completed: true },
    { id: "2", name: "Cumplir meta de proteína", icon: "🥩", completed: false },
    { id: "3", name: "No refresco ni alcohol", icon: "🚫", completed: true },
    { id: "4", name: "30 min de movimiento", icon: "🏃", completed: true },
    { id: "5", name: "Tomar agua meta", icon: "💧", completed: false },
    { id: "6", name: "Journaling del día", icon: "📝", completed: false },
  ],
  todayWorkout: {
    day: "upper_a" as const,
    completed: false,
  },
};

export default function DashboardPage() {
  const [habits, setHabits] = useState(mockData.habits);

  const today = new Date();
  const dayOfWeek = format(today, "EEEE", { locale: es }).toLowerCase() as keyof typeof WORKOUT_SCHEDULE;
  const todayWorkoutDay = WORKOUT_SCHEDULE[dayOfWeek];

  const weightDiff = mockData.weight.current - mockData.weight.previousWeek;
  const completedHabits = habits.filter((h) => h.completed).length;

  const handleHabitToggle = (id: string, checked: boolean) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: checked } : h))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">DASHBOARD</h1>
          <p className="text-muted-foreground">
            Resumen de tu día
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-lime/30 text-lime">
            Racha: 12 días
          </Badge>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calories Card */}
        <Card className="glass border-border/50 col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Calorías
            </CardTitle>
            <Link href="/nutrition">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80">
                Ver más <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CalorieRing
              consumed={mockData.calories.consumed}
              goal={mockData.calories.goal}
              size="lg"
            />
            <div className="w-full space-y-3">
              <MacroBar
                label="Proteína"
                current={mockData.macros.protein}
                goal={NUTRITION_GOALS.protein_max}
                color="red"
              />
              <MacroBar
                label="Carbohidratos"
                current={mockData.macros.carbs}
                goal={NUTRITION_GOALS.carbs}
                color="blue"
              />
              <MacroBar
                label="Grasas"
                current={mockData.macros.fat}
                goal={NUTRITION_GOALS.fat}
                color="yellow"
              />
            </div>
          </CardContent>
        </Card>

        {/* Water Card */}
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hidratación
            </CardTitle>
            <Link href="/hydration">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80">
                Ver más <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <WaterProgress
              consumed={mockData.water.consumed}
              goal={mockData.water.goal}
            />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
                <Droplets className="h-4 w-4 mr-1" />
                +250ml
              </Button>
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
                +500ml
              </Button>
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">
                +1L
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Workout Card */}
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rutina del día
            </CardTitle>
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80">
                Ir <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayWorkoutDay ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/10">
                    <Dumbbell className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <p className="font-display text-xl">
                      {WORKOUT_DAY_SHORT[todayWorkoutDay]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {todayWorkoutDay === "upper_a" && "Pecho, Hombro, Tríceps"}
                      {todayWorkoutDay === "lower_a" && "Cuádriceps, Glúteos"}
                      {todayWorkoutDay === "upper_b" && "Espalda, Bíceps"}
                      {todayWorkoutDay === "lower_b" && "Isquios, Glúteos, Core"}
                    </p>
                  </div>
                </div>
                <Link href={`/workouts/session/${todayWorkoutDay}`}>
                  <Button className="w-full bg-lime text-dark hover:bg-lime-400">
                    Iniciar entrenamiento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mb-3">
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Día de descanso</p>
                <p className="text-sm text-muted-foreground">
                  Recupérate para mañana
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Card */}
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso actual
            </CardTitle>
            <Link href="/weight">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80">
                Ver más <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-4xl">
                  {mockData.weight.current}
                  <span className="text-lg text-muted-foreground ml-1">kg</span>
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {weightDiff < 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">
                        {Math.abs(weightDiff).toFixed(1)} kg esta semana
                      </span>
                    </>
                  ) : weightDiff > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        +{weightDiff.toFixed(1)} kg esta semana
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sin cambios esta semana
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime/10">
                <Scale className="h-7 w-7 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Card */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hábitos del día
              </CardTitle>
              <Badge variant="secondary" className="bg-lime/10 text-lime">
                {completedHabits} / {habits.length}
              </Badge>
            </div>
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80">
                Ver más <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {habits.map((habit) => (
                <HabitCheckbox
                  key={habit.id}
                  id={habit.id}
                  label={habit.name}
                  icon={habit.icon}
                  checked={habit.completed}
                  onCheckedChange={(checked) => handleHabitToggle(habit.id, checked)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Link href="/nutrition">
          <StatCard
            title="Registrar comida"
            value="+"
            icon={Utensils}
            className="cursor-pointer"
          />
        </Link>
        <Link href="/hydration">
          <StatCard
            title="Registrar agua"
            value="+"
            icon={Droplets}
            className="cursor-pointer"
          />
        </Link>
        <Link href="/habits">
          <StatCard
            title="Ver hábitos"
            value={`${completedHabits}/${habits.length}`}
            icon={CheckSquare}
            className="cursor-pointer"
          />
        </Link>
        <Link href="/workouts">
          <StatCard
            title="Entrenamientos"
            value="→"
            icon={Dumbbell}
            className="cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}
