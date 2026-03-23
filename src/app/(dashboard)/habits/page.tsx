"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitCheckbox } from "@/components/shared";
import { DEFAULT_HABITS, JOURNAL_PROMPTS } from "@/lib/constants";
import { CheckSquare, BookOpen, Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockHabits = DEFAULT_HABITS.map((h, i) => ({
  id: String(i + 1),
  ...h,
  completed: i < 3, // First 3 completed
}));

export default function HabitsPage() {
  const [habits, setHabits] = useState(mockHabits);
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  const handleHabitToggle = (id: string, checked: boolean) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: checked } : h))
    );
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setJournalEntry((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">HÁBITOS</h1>
          <p className="text-muted-foreground">
            Construye tu mejor versión día a día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-500">
            <Flame className="h-3 w-3 mr-1" />
            Racha: 12 días
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="habits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger
            value="habits"
            className="data-[state=active]:bg-lime data-[state=active]:text-dark"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Hábitos
          </TabsTrigger>
          <TabsTrigger
            value="journal"
            className="data-[state=active]:bg-lime data-[state=active]:text-dark"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Journaling
          </TabsTrigger>
        </TabsList>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          {/* Progress */}
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Progreso de hoy</p>
                  <p className="font-display text-3xl">
                    {completedCount} / {totalCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl text-lime">
                    {completionRate}%
                  </p>
                </div>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-lime transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Habits List */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hábitos diarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journaling Tab */}
        <TabsContent value="journal" className="space-y-6">
          {/* Prompts */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
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
                    className={`text-xs ${
                      selectedPrompt === prompt
                        ? "border-lime bg-lime/10 text-lime"
                        : "border-border/50"
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
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entrada de hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="¿Cómo fue tu día? ¿Qué aprendiste? ¿Qué te gustaría mejorar?"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[200px] bg-secondary border-0 resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {journalEntry.length} caracteres
                </p>
                <Button
                  className="bg-lime text-dark hover:bg-lime-400"
                  disabled={!journalEntry.trim()}
                >
                  Guardar entrada
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous entries */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Entradas anteriores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Ayer", preview: "Hoy me sentí muy bien después del entrenamiento..." },
                  { date: "Hace 2 días", preview: "Necesito mejorar mi hidratación, olvidé tomar agua..." },
                  { date: "Hace 3 días", preview: "Gran día de alimentación, cumplí todos los macros..." },
                ].map((entry, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <p className="text-sm text-muted-foreground">{entry.date}</p>
                    <p className="text-sm mt-1 line-clamp-2">{entry.preview}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
