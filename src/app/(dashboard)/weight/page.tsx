"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_USER_PROFILE } from "@/lib/constants";
import { Scale, TrendingDown, Target, Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data
const mockMeasurements = [
  { date: "2026-03-23", weight_kg: 85.2, waist_cm: 88, hip_cm: 98 },
  { date: "2026-03-16", weight_kg: 86.0, waist_cm: 89, hip_cm: 98 },
  { date: "2026-03-09", weight_kg: 85.8, waist_cm: 89, hip_cm: 99 },
  { date: "2026-03-02", weight_kg: 86.5, waist_cm: 90, hip_cm: 99 },
];

export default function WeightPage() {
  const [useLbs, setUseLbs] = useState(false);

  const latestWeight = mockMeasurements[0].weight_kg;
  const previousWeight = mockMeasurements[1]?.weight_kg || latestWeight;
  const weightChange = latestWeight - previousWeight;
  const targetWeight = DEFAULT_USER_PROFILE.target_weight_kg;
  const remainingToGoal = latestWeight - targetWeight;
  const progressPercentage = ((DEFAULT_USER_PROFILE.weight_kg - latestWeight) / (DEFAULT_USER_PROFILE.weight_kg - targetWeight)) * 100;

  const convertWeight = (kg: number) => {
    return useLbs ? (kg * 2.20462).toFixed(1) : kg.toFixed(1);
  };

  const weightUnit = useLbs ? "lbs" : "kg";

  // Calculate BMI
  const heightM = DEFAULT_USER_PROFILE.height_cm / 100;
  const bmi = latestWeight / (heightM * heightM);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Bajo peso", color: "text-yellow-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-orange-500" };
    return { label: "Obesidad", color: "text-red-500" };
  };

  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide">PESO & MEDIDAS</h1>
          <p className="text-muted-foreground">
            Sigue tu progreso hacia tu meta
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="unit-toggle" className="text-sm text-muted-foreground">kg</Label>
            <Switch
              id="unit-toggle"
              checked={useLbs}
              onCheckedChange={setUseLbs}
            />
            <Label htmlFor="unit-toggle" className="text-sm text-muted-foreground">lbs</Label>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-lime text-dark hover:bg-lime-400">
                <Plus className="h-4 w-4 mr-2" />
                Registrar
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border">
              <DialogHeader>
                <DialogTitle>Registrar medidas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso ({weightUnit})</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder={`ej: ${convertWeight(85)}`}
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.5"
                    placeholder="ej: 88"
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hip">Cadera (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    step="0.5"
                    placeholder="ej: 98"
                    className="bg-secondary border-0"
                  />
                </div>
                <Button className="w-full bg-lime text-dark hover:bg-lime-400">
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peso actual</p>
                <p className="font-display text-3xl">
                  {convertWeight(latestWeight)}
                  <span className="text-lg text-muted-foreground ml-1">{weightUnit}</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
                <Scale className="h-5 w-5 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta semana</p>
                <p className={`font-display text-3xl ${weightChange < 0 ? "text-green-500" : weightChange > 0 ? "text-red-500" : ""}`}>
                  {weightChange > 0 ? "+" : ""}{convertWeight(Math.abs(weightChange))}
                  <span className="text-lg ml-1">{weightUnit}</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingDown className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Para la meta</p>
                <p className="font-display text-3xl">
                  {convertWeight(remainingToGoal)}
                  <span className="text-lg text-muted-foreground ml-1">{weightUnit}</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
                <Target className="h-5 w-5 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IMC</p>
                <p className="font-display text-3xl">
                  {bmi.toFixed(1)}
                </p>
                <p className={`text-sm ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to goal */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Progreso hacia la meta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Inicio: {convertWeight(DEFAULT_USER_PROFILE.weight_kg)} {weightUnit}</span>
              <span className="text-lime">Meta: {convertWeight(targetWeight)} {weightUnit}</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-lime transition-all duration-500"
                style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {progressPercentage.toFixed(0)}% completado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Historial
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-lime">
            <Calendar className="h-4 w-4 mr-1" />
            Ver todo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMeasurements.map((measurement, index) => (
              <div
                key={measurement.date}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="font-medium">{measurement.date}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>Cintura: {measurement.waist_cm}cm</span>
                    <span>Cadera: {measurement.hip_cm}cm</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">
                    {convertWeight(measurement.weight_kg)} {weightUnit}
                  </p>
                  {index > 0 && (
                    <p className={`text-sm ${
                      measurement.weight_kg < mockMeasurements[index - 1]?.weight_kg
                        ? "text-green-500"
                        : measurement.weight_kg > mockMeasurements[index - 1]?.weight_kg
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}>
                      {measurement.weight_kg < mockMeasurements[index - 1]?.weight_kg ? "-" : "+"}
                      {Math.abs(measurement.weight_kg - (mockMeasurements[index - 1]?.weight_kg || measurement.weight_kg)).toFixed(1)} {weightUnit}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
