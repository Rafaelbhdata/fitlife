"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalorieRing, WaterProgress, MacroBar, StatCard, HabitCheckbox } from "@/components/shared";
import { NUTRITION_GOALS, HYDRATION_GOALS, WORKOUT_DAY_SHORT, WORKOUT_SCHEDULE } from "@/lib/constants";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { useHabits } from "@/lib/hooks/use-habits";
import { useHydration } from "@/lib/hooks/use-hydration";
import {
  Dumbbell,
  Scale,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Utensils,
  Droplets,
  CheckSquare,
  Flame,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { habits, completedCount, totalCount, toggleHabit, loading: habitsLoading, createDefaultHabits } = useHabits();
  const { hydration, addWater, loading: hydrationLoading } = useHydration();

  const today = new Date();
  const dayOfWeek = format(today, "EEEE", { locale: es }).toLowerCase() as keyof typeof WORKOUT_SCHEDULE;
  const todayWorkoutDay = WORKOUT_SCHEDULE[dayOfWeek];

  const weightDiff = stats?.weight.difference || 0;

  const handleHabitToggle = async (id: string, checked: boolean) => {
    await toggleHabit(id, checked);
  };

  const handleAddWater = async (amount: number) => {
    await addWater(amount);
  };

  // Loading state
  if (statsLoading && habitsLoading && hydrationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime" />
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground">{statsError}</p>
        </div>
      </div>
    );
  }

  // Create default habits if none exist
  if (!habitsLoading && habits.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckSquare className="h-12 w-12 text-lime" />
          <h2 className="font-display text-2xl">¡Bienvenido a FitLife!</h2>
          <p className="text-muted-foreground max-w-md">
            Parece que es tu primera vez. Vamos a configurar tus hábitos para comenzar tu transformación.
          </p>
          <Button
            onClick={createDefaultHabits}
            className="bg-lime text-dark hover:bg-lime/90 font-semibold mt-2"
          >
            Crear mis hábitos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide">DASHBOARD</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen de tu día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-500 gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            Racha: {completedCount > 0 ? "activa" : "0 días"}
          </Badge>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Calories Card */}
        <Card className="glass glass-hover border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Calorías
            </CardTitle>
            <Link href="/nutrition">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80 h-8 px-2 text-xs">
                Ver más <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CalorieRing
              consumed={stats?.calories.consumed || 0}
              goal={stats?.calories.goal || NUTRITION_GOALS.calories}
              size="lg"
            />
            <div className="w-full space-y-3">
              <MacroBar
                label="Proteína"
                current={0}
                goal={NUTRITION_GOALS.protein_max}
                color="red"
              />
              <MacroBar
                label="Carbohidratos"
                current={0}
                goal={NUTRITION_GOALS.carbs}
                color="blue"
              />
              <MacroBar
                label="Grasas"
                current={0}
                goal={NUTRITION_GOALS.fat}
                color="yellow"
              />
            </div>
          </CardContent>
        </Card>

        {/* Water Card */}
        <Card className="glass glass-hover border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Hidratación
            </CardTitle>
            <Link href="/hydration">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80 h-8 px-2 text-xs">
                Ver más <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <WaterProgress
              consumed={hydration?.total_ml || stats?.water.consumed_ml || 0}
              goal={hydration?.goal_ml || stats?.water.goal_ml || HYDRATION_GOALS.daily_ml}
            />
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 h-8 text-xs"
                onClick={() => handleAddWater(250)}
                disabled={hydrationLoading}
              >
                <Droplets className="h-3.5 w-3.5 mr-1" />
                +250ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 h-8 text-xs"
                onClick={() => handleAddWater(500)}
                disabled={hydrationLoading}
              >
                +500ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 h-8 text-xs"
                onClick={() => handleAddWater(1000)}
                disabled={hydrationLoading}
              >
                +1L
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Workout Card */}
        <Card className="glass glass-hover border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Rutina del día
            </CardTitle>
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80 h-8 px-2 text-xs">
                Ir <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayWorkoutDay ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/15 border border-lime/20">
                    <Dumbbell className="h-6 w-6 text-lime" />
                  </div>
                  <div>
                    <p className="font-display text-xl">
                      {WORKOUT_DAY_SHORT[todayWorkoutDay]}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {todayWorkoutDay === "upper_a" && "Pecho, Hombro, Tríceps"}
                      {todayWorkoutDay === "lower_a" && "Cuádriceps, Glúteos"}
                      {todayWorkoutDay === "upper_b" && "Espalda, Bíceps"}
                      {todayWorkoutDay === "lower_b" && "Isquios, Glúteos, Core"}
                    </p>
                  </div>
                </div>
                {stats?.todayWorkout?.completed ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-lime/10 border border-lime/20">
                    <CheckSquare className="h-5 w-5 text-lime" />
                    <span className="text-sm text-lime font-medium">¡Completado!</span>
                  </div>
                ) : (
                  <Link href={`/workouts/session/${todayWorkoutDay}`}>
                    <Button className="w-full bg-lime text-dark hover:bg-lime/90 font-semibold">
                      Iniciar entrenamiento
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mb-3">
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Día de descanso</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Recupérate para mañana
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Card */}
        <Card className="glass glass-hover border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Peso actual
            </CardTitle>
            <Link href="/weight">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80 h-8 px-2 text-xs">
                Ver más <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-3xl sm:text-4xl">
                  {stats?.weight.current_kg || "--"}
                  <span className="text-base sm:text-lg text-muted-foreground ml-1">kg</span>
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {weightDiff < 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-xs sm:text-sm text-green-500">
                        {Math.abs(weightDiff).toFixed(1)} kg esta semana
                      </span>
                    </>
                  ) : weightDiff > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-xs sm:text-sm text-red-500">
                        +{weightDiff.toFixed(1)} kg esta semana
                      </span>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {stats?.weight.current_kg ? "Sin cambios" : "Sin datos"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-lime/15 border border-lime/20">
                <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits Card - Spans 2 columns on larger screens */}
        <Card className="glass glass-hover border-border/50 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Hábitos del día
              </CardTitle>
              <Badge variant="secondary" className="bg-lime/15 text-lime border-0 text-xs">
                {completedCount} / {totalCount}
              </Badge>
            </div>
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="text-lime hover:text-lime/80 h-8 px-2 text-xs">
                Ver más <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {habitsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : habits.length > 0 ? (
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {habits.map((habit) => (
                  <HabitCheckbox
                    key={habit.id}
                    id={habit.id}
                    label={habit.name}
                    icon={habit.icon || "✓"}
                    checked={habit.log?.completed || false}
                    onCheckedChange={(checked) => handleHabitToggle(habit.id, checked)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay hábitos configurados
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Responsive grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Link href="/nutrition" className="block">
          <StatCard
            title="Registrar comida"
            value="+"
            icon={Utensils}
            className="h-full"
          />
        </Link>
        <Link href="/hydration" className="block">
          <StatCard
            title="Registrar agua"
            value="+"
            icon={Droplets}
            className="h-full"
          />
        </Link>
        <Link href="/habits" className="block">
          <StatCard
            title="Ver hábitos"
            value={`${completedCount}/${totalCount}`}
            icon={CheckSquare}
            className="h-full"
          />
        </Link>
        <Link href="/workouts" className="block">
          <StatCard
            title="Entrenamientos"
            value="→"
            icon={Dumbbell}
            className="h-full"
          />
        </Link>
      </div>
    </div>
  );
}
