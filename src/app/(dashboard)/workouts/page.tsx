"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WORKOUT_DAY_LABELS, WORKOUT_DAY_SHORT, INITIAL_EXERCISES } from "@/lib/constants";
import { Dumbbell, Clock, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

type WorkoutDay = keyof typeof INITIAL_EXERCISES;

const workoutDays: WorkoutDay[] = ["upper_a", "lower_a", "upper_b", "lower_b"];

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">RUTINAS</h1>
          <p className="text-muted-foreground">
            Tu programa Upper/Lower de 4 días
          </p>
        </div>
        <Link href="/workouts/history">
          <Button variant="outline" className="border-lime/30 text-lime hover:bg-lime/10">
            <Calendar className="h-4 w-4 mr-2" />
            Historial
          </Button>
        </Link>
      </div>

      {/* Weekly Schedule */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Semana actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => {
              const workoutDay = i === 0 ? "upper_a" : i === 1 ? "lower_a" : i === 3 ? "upper_b" : i === 4 ? "lower_b" : null;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    workoutDay ? "bg-lime/10 border border-lime/20" : "bg-secondary"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{day}</span>
                  {workoutDay ? (
                    <span className="text-xs font-medium text-lime mt-1">
                      {WORKOUT_DAY_SHORT[workoutDay]}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-1">
                      Desc
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Workout Tabs */}
      <Tabs defaultValue="upper_a" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          {workoutDays.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="data-[state=active]:bg-lime data-[state=active]:text-dark"
            >
              {WORKOUT_DAY_SHORT[day]}
            </TabsTrigger>
          ))}
        </TabsList>

        {workoutDays.map((day) => (
          <TabsContent key={day} value={day} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">{WORKOUT_DAY_SHORT[day]}</h2>
                <p className="text-sm text-muted-foreground">
                  {WORKOUT_DAY_LABELS[day]}
                </p>
              </div>
              <Link href={`/workouts/session/${day}`}>
                <Button className="bg-lime text-dark hover:bg-lime-400">
                  Iniciar sesión
                </Button>
              </Link>
            </div>

            <div className="grid gap-3">
              {INITIAL_EXERCISES[day].map((exercise, index) => (
                <Card key={index} className="glass border-border/50 hover:border-lime/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-lime font-display text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {exercise.sets} x {exercise.reps_min}-{exercise.reps_max}
                            </Badge>
                            {exercise.suggested_weight_lbs && (
                              <Badge variant="outline" className="text-xs border-lime/30 text-lime">
                                {exercise.suggested_weight_lbs} lbs
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
