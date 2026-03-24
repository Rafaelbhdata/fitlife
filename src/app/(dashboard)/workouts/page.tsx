"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WORKOUT_DAY_LABELS, WORKOUT_DAY_SHORT, INITIAL_EXERCISES } from "@/lib/constants";
import { useExercises, useWorkoutHistory } from "@/lib/hooks/use-workouts";
import { ChevronRight, Calendar, Play, Loader2, AlertCircle, Dumbbell, CheckCircle } from "lucide-react";
import Link from "next/link";
import { WorkoutDay } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const workoutDays: WorkoutDay[] = ["upper_a", "lower_a", "upper_b", "lower_b"];

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const workoutSchedule = [
  { day: "Lun", workout: "upper_a" as WorkoutDay | null },
  { day: "Mar", workout: "lower_a" as WorkoutDay | null },
  { day: "Mié", workout: null },
  { day: "Jue", workout: "upper_b" as WorkoutDay | null },
  { day: "Vie", workout: "lower_b" as WorkoutDay | null },
  { day: "Sáb", workout: null },
  { day: "Dom", workout: null },
];

export default function WorkoutsPage() {
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  const { sessions, loading: historyLoading } = useWorkoutHistory(5);

  // Group exercises by workout day
  const exercisesByDay = workoutDays.reduce((acc, day) => {
    acc[day] = exercises.filter(e => e.workout_day === day);
    return acc;
  }, {} as Record<WorkoutDay, typeof exercises>);

  // Check if we have exercises in DB, otherwise use constants
  const getExercisesForDay = (day: WorkoutDay) => {
    if (exercisesByDay[day]?.length > 0) {
      return exercisesByDay[day];
    }
    // Fallback to constants if no exercises in DB
    return INITIAL_EXERCISES[day].map((e, i) => ({
      id: `${day}-${i}`,
      ...e,
      workout_day: day,
      order_index: i,
      is_active: true,
    }));
  };

  // Loading state
  if (exercisesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime" />
          <p className="text-muted-foreground">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (exercisesError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">Error al cargar rutinas</p>
          <p className="text-sm text-muted-foreground">{exercisesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide">RUTINAS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tu programa Upper/Lower de 4 días
          </p>
        </div>
        <Link href="/workouts/history">
          <Button variant="outline" className="border-lime/30 text-lime hover:bg-lime/10 w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Historial
          </Button>
        </Link>
      </div>

      {/* Weekly Schedule */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Semana actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: Horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-7 sm:overflow-visible">
            {workoutSchedule.map((item, i) => {
              const workoutDay = item.workout;
              const isToday = i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0);
              return (
                <div
                  key={item.day}
                  className={`flex flex-col items-center p-3 rounded-xl min-w-[60px] sm:min-w-0 transition-all duration-200 ${
                    workoutDay
                      ? "bg-lime/10 border border-lime/20"
                      : "bg-secondary/50"
                  } ${isToday ? "ring-2 ring-lime/50" : ""}`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-lime" : "text-muted-foreground"}`}>
                    {item.day}
                  </span>
                  {workoutDay ? (
                    <span className="text-xs font-semibold text-lime mt-1">
                      {WORKOUT_DAY_SHORT[workoutDay]}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Desc
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Sesiones recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/15">
                      {session.finished_at ? (
                        <CheckCircle className="h-5 w-5 text-lime" />
                      ) : (
                        <Dumbbell className="h-5 w-5 text-lime" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {WORKOUT_DAY_SHORT[session.workout_day as WorkoutDay]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.date), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={session.finished_at ? "default" : "secondary"}
                    className={session.finished_at ? "bg-lime/20 text-lime border-0" : ""}
                  >
                    {session.finished_at ? "Completado" : "En progreso"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Tabs */}
      <Tabs defaultValue="upper_a" className="space-y-4">
        {/* Mobile: Horizontal scroll for tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto sm:grid sm:w-full sm:grid-cols-4 bg-secondary/50 p-1 rounded-xl">
            {workoutDays.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="data-[state=active]:bg-lime data-[state=active]:text-dark rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
              >
                {WORKOUT_DAY_SHORT[day]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {workoutDays.map((day) => {
          const dayExercises = getExercisesForDay(day);
          return (
            <TabsContent key={day} value={day} className="space-y-4 animate-fade-in-up">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl">{WORKOUT_DAY_SHORT[day]}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {WORKOUT_DAY_LABELS[day]}
                  </p>
                </div>
                <Link href={`/workouts/session/${day}`} className="w-full sm:w-auto">
                  <Button className="bg-lime text-dark hover:bg-lime/90 font-semibold w-full sm:w-auto">
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar sesión
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3">
                {dayExercises.map((exercise, index) => (
                  <Card
                    key={exercise.id}
                    className="glass border-border/50 hover:border-lime/20 transition-all duration-200 card-interactive"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-lime/15 text-lime font-display text-base sm:text-lg flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base truncate">{exercise.name}</p>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 h-5 sm:h-6">
                                {exercise.sets} x {exercise.reps_min}-{exercise.reps_max}
                              </Badge>
                              {exercise.suggested_weight_lbs && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs border-lime/30 text-lime px-1.5 sm:px-2 h-5 sm:h-6">
                                  {exercise.suggested_weight_lbs} lbs
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
