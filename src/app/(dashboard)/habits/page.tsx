"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitCheckbox } from "@/components/shared";
import { JOURNAL_PROMPTS } from "@/lib/constants";
import { useHabits, useJournal, useJournalHistory } from "@/lib/hooks/use-habits";
import { CheckSquare, BookOpen, Flame, Sparkles, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function HabitsPage() {
  const { habits, completedCount, totalCount, completionRate, loading: habitsLoading, error: habitsError, toggleHabit, createDefaultHabits } = useHabits();
  const { entry, saveEntry } = useJournal();
  const { entries: journalHistory, loading: historyLoading } = useJournalHistory(5);

  const [journalEntry, setJournalEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleHabitToggle = async (id: string, checked: boolean) => {
    await toggleHabit(id, checked);
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setJournalEntry((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
  };

  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) return;
    setSaving(true);
    const promptsUsed = selectedPrompt ? [selectedPrompt] : undefined;
    await saveEntry(journalEntry, undefined, promptsUsed);
    setSaving(false);
  };

  // Loading state
  if (habitsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime" />
          <p className="text-muted-foreground">Cargando hábitos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (habitsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">Error al cargar hábitos</p>
          <p className="text-sm text-muted-foreground">{habitsError}</p>
        </div>
      </div>
    );
  }

  // No habits - show create default
  if (habits.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckSquare className="h-12 w-12 text-lime" />
          <h2 className="font-display text-2xl">Configura tus hábitos</h2>
          <p className="text-muted-foreground max-w-md">
            Aún no tienes hábitos configurados. Crea los hábitos predeterminados para comenzar a trackear tu progreso diario.
          </p>
          <Button
            onClick={createDefaultHabits}
            className="bg-lime text-dark hover:bg-lime/90 font-semibold mt-2"
          >
            Crear hábitos predeterminados
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
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide">HÁBITOS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Construye tu mejor versión día a día
          </p>
        </div>
        <Badge variant="outline" className="border-orange-500/30 text-orange-500 gap-1.5 w-fit">
          <Flame className="h-3.5 w-3.5" />
          Racha: {completedCount > 0 ? "activa" : "0 días"}
        </Badge>
      </div>

      <Tabs defaultValue="habits" className="space-y-6">
        {/* Tab navigation */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto sm:grid sm:w-full sm:grid-cols-2 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger
              value="habits"
              className="data-[state=active]:bg-lime data-[state=active]:text-dark rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Hábitos
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="data-[state=active]:bg-lime data-[state=active]:text-dark rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Journaling
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6 animate-fade-in-up">
          {/* Progress */}
          <Card className="glass border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Progreso de hoy</p>
                  <p className="font-display text-2xl sm:text-3xl">
                    {completedCount} / {totalCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl sm:text-4xl text-lime">
                    {completionRate}%
                  </p>
                </div>
              </div>
              <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-lime to-lime/80 transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Habits List */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Hábitos diarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journaling Tab */}
        <TabsContent value="journal" className="space-y-6 animate-fade-in-up">
          {/* Prompts */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-lime" />
                Prompts para reflexionar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {JOURNAL_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptClick(prompt)}
                    className={`text-[10px] sm:text-xs h-7 sm:h-8 ${
                      selectedPrompt === prompt
                        ? "border-lime bg-lime/10 text-lime"
                        : "border-border/50 hover:border-lime/30"
                    }`}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Journal Entry */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Entrada de hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="¿Cómo fue tu día? ¿Qué aprendiste? ¿Qué te gustaría mejorar?"
                value={journalEntry || entry?.content || ""}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[160px] sm:min-h-[200px] bg-secondary/50 border-0 resize-none rounded-xl text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {(journalEntry || entry?.content || "").length} caracteres
                </p>
                <Button
                  className="bg-lime text-dark hover:bg-lime/90 font-semibold"
                  disabled={!(journalEntry || entry?.content)?.trim() || saving}
                  onClick={handleSaveJournal}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar entrada"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous entries */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Entradas anteriores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : journalHistory.length > 0 ? (
                <div className="space-y-2">
                  {journalHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.date), { addSuffix: true, locale: es })}
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{entry.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No hay entradas anteriores</p>
                  <p className="text-xs mt-1">Empieza a escribir tu primera entrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
