"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RestTimer } from "@/components/shared";
import {
  INITIAL_EXERCISES,
  WORKOUT_DAY_LABELS,
  WORKOUT_DAY_SHORT,
  SET_FEELING_EMOJI,
  SET_FEELING_LABELS,
} from "@/lib/constants";
import { SetFeeling, WorkoutDay } from "@/types";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SetData {
  setNumber: number;
  weight: string;
  reps: string;
  feeling: SetFeeling | null;
  completed: boolean;
}

interface ExerciseData {
  exerciseIndex: number;
  sets: SetData[];
  notes: string;
  expanded: boolean;
}

export default function WorkoutSessionPage() {
  const params = useParams();
  const router = useRouter();
  const day = params.day as WorkoutDay;

  const exercises = INITIAL_EXERCISES[day] || [];
  const [sessionData, setSessionData] = useState<ExerciseData[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Initialize session data
  useEffect(() => {
    const initialData = exercises.map((exercise, index) => ({
      exerciseIndex: index,
      sets: Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: exercise.suggested_weight_lbs?.toString() || "",
        reps: "",
        feeling: null,
        completed: false,
      })),
      notes: "",
      expanded: index === 0,
    }));
    setSessionData(initialData);
  }, [day]);

  const handleStartSession = () => {
    setSessionStarted(true);
    setStartTime(new Date());
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetData,
    value: string | SetFeeling | boolean
  ) => {
    setSessionData((prev) =>
      prev.map((ex) => {
        if (ex.exerciseIndex === exerciseIndex) {
          const newSets = [...ex.sets];
          newSets[setIndex] = { ...newSets[setIndex], [field]: value };
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    );
  };

  const handleCompleteSet = (exerciseIndex: number, setIndex: number) => {
    handleSetChange(exerciseIndex, setIndex, "completed", true);
    setShowTimer(true);
  };

  const handleNotesChange = (exerciseIndex: number, notes: string) => {
    setSessionData((prev) =>
      prev.map((ex) =>
        ex.exerciseIndex === exerciseIndex ? { ...ex, notes } : ex
      )
    );
  };

  const toggleExpanded = (exerciseIndex: number) => {
    setSessionData((prev) =>
      prev.map((ex) =>
        ex.exerciseIndex === exerciseIndex
          ? { ...ex, expanded: !ex.expanded }
          : ex
      )
    );
  };

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = sessionData.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progress = Math.round((completedSets / totalSets) * 100);

  const handleFinishSession = () => {
    // TODO: Save to Supabase
    console.log("Session data:", sessionData);
    router.push("/workouts");
  };

  if (!exercises.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Rutina no encontrada</p>
        <Button
          variant="outline"
          onClick={() => router.push("/workouts")}
          className="mt-4"
        >
          Volver a rutinas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/workouts")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl tracking-wide">
              {WORKOUT_DAY_SHORT[day]}
            </h1>
            <p className="text-sm text-muted-foreground">
              {WORKOUT_DAY_LABELS[day]}
            </p>
          </div>
        </div>

        {sessionStarted && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {startTime && (
                <>Iniciado: {startTime.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {sessionStarted && (
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="font-display text-xl">
                {completedSets} / {totalSets} sets
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-lime transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start button */}
      {!sessionStarted && (
        <Card className="glass border-lime/20">
          <CardContent className="p-6 text-center">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-lime" />
            <h2 className="font-display text-2xl mb-2">¿Listo para entrenar?</h2>
            <p className="text-muted-foreground mb-4">
              {exercises.length} ejercicios • {totalSets} sets en total
            </p>
            <Button
              onClick={handleStartSession}
              className="bg-lime text-dark hover:bg-lime-400"
              size="lg"
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercises */}
      {sessionStarted && (
        <div className="space-y-4">
          {exercises.map((exercise, exerciseIndex) => {
            const exerciseData = sessionData[exerciseIndex];
            if (!exerciseData) return null;

            const completedExSets = exerciseData.sets.filter(
              (s) => s.completed
            ).length;
            const isComplete = completedExSets === exercise.sets;

            return (
              <Collapsible
                key={exerciseIndex}
                open={exerciseData.expanded}
                onOpenChange={() => toggleExpanded(exerciseIndex)}
              >
                <Card
                  className={cn(
                    "glass border-border/50 transition-colors",
                    isComplete && "border-lime/30 bg-lime/5"
                  )}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg font-display text-lg",
                              isComplete
                                ? "bg-lime text-dark"
                                : "bg-lime/10 text-lime"
                            )}
                          >
                            {isComplete ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              exerciseIndex + 1
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {exercise.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {exercise.sets} x {exercise.reps_min}-
                                {exercise.reps_max}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {completedExSets}/{exercise.sets} completados
                              </span>
                            </div>
                          </div>
                        </div>
                        {exerciseData.expanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {exercise.description}
                      </p>

                      {/* Sets */}
                      <div className="space-y-3">
                        {exerciseData.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg",
                              set.completed
                                ? "bg-lime/10 border border-lime/20"
                                : "bg-secondary/50"
                            )}
                          >
                            <span className="font-display text-lg w-8">
                              {set.setNumber}
                            </span>

                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <Input
                                  type="number"
                                  placeholder="lbs"
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  disabled={set.completed}
                                  className="h-9 bg-background border-0 text-center"
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  placeholder="reps"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  disabled={set.completed}
                                  className="h-9 bg-background border-0 text-center"
                                />
                              </div>
                            </div>

                            {/* Feeling selector */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xl"
                                  disabled={set.completed}
                                >
                                  {set.feeling
                                    ? SET_FEELING_EMOJI[set.feeling]
                                    : "😐"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass border-border max-w-xs">
                                <DialogHeader>
                                  <DialogTitle>¿Cómo se sintió?</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-5 gap-2 pt-4">
                                  {(
                                    Object.keys(SET_FEELING_EMOJI) as SetFeeling[]
                                  ).map((feeling) => (
                                    <Button
                                      key={feeling}
                                      variant="ghost"
                                      className="flex-col h-auto py-3"
                                      onClick={() => {
                                        handleSetChange(
                                          exerciseIndex,
                                          setIndex,
                                          "feeling",
                                          feeling
                                        );
                                      }}
                                    >
                                      <span className="text-2xl">
                                        {SET_FEELING_EMOJI[feeling]}
                                      </span>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {SET_FEELING_LABELS[feeling]}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Complete button */}
                            {set.completed ? (
                              <Check className="h-5 w-5 text-lime" />
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleCompleteSet(exerciseIndex, setIndex)
                                }
                                className="border-lime/30 text-lime hover:bg-lime/10"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div>
                        <Textarea
                          placeholder="Notas del ejercicio..."
                          value={exerciseData.notes}
                          onChange={(e) =>
                            handleNotesChange(exerciseIndex, e.target.value)
                          }
                          className="bg-secondary border-0 resize-none h-20"
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Rest Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="glass border-border w-80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Descanso</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTimer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <RestTimer onComplete={() => setShowTimer(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Finish Session */}
      {sessionStarted && completedSets > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium">{completedSets} sets completados</p>
              <p className="text-sm text-muted-foreground">
                {progress}% del entrenamiento
              </p>
            </div>
            <Button
              onClick={handleFinishSession}
              className="bg-lime text-dark hover:bg-lime-400"
            >
              <Save className="h-4 w-4 mr-2" />
              Terminar sesión
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
