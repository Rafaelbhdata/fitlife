"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_USER_PROFILE } from "@/lib/constants";
import { useBodyMeasurements } from "@/lib/hooks/use-weight";
import { useAuth } from "@/lib/hooks/use-auth";
import { Scale, TrendingDown, TrendingUp, Target, Plus, Calendar, Activity, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WeightPage() {
  const { measurements, latestMeasurement, weightChange, loading, error, addMeasurement } = useBodyMeasurements();
  const { profile } = useAuth();
  const [useLbs, setUseLbs] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    waist: "",
    hip: "",
  });

  const latestWeight = latestMeasurement?.weight_kg || DEFAULT_USER_PROFILE.weight_kg;
  const targetWeight = profile?.target_weight_kg || DEFAULT_USER_PROFILE.target_weight_kg;
  const initialWeight = DEFAULT_USER_PROFILE.weight_kg;
  const remainingToGoal = latestWeight - targetWeight;
  const progressPercentage = Math.min(
    Math.max(((initialWeight - latestWeight) / (initialWeight - targetWeight)) * 100, 0),
    100
  );

  const convertWeight = (kg: number) => {
    return useLbs ? (kg * 2.20462).toFixed(1) : kg.toFixed(1);
  };

  const weightUnit = useLbs ? "lbs" : "kg";

  // Calculate BMI
  const heightCm = profile?.height_cm || DEFAULT_USER_PROFILE.height_cm;
  const heightM = heightCm / 100;
  const bmi = latestWeight / (heightM * heightM);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Bajo peso", color: "text-yellow-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-orange-500" };
    return { label: "Obesidad", color: "text-red-500" };
  };

  const bmiCategory = getBmiCategory(bmi);

  const handleSave = async () => {
    if (!formData.weight) return;
    setSaving(true);

    const weightKg = useLbs
      ? parseFloat(formData.weight) / 2.20462
      : parseFloat(formData.weight);

    await addMeasurement({
      weight_kg: weightKg,
      waist_cm: formData.waist ? parseFloat(formData.waist) : undefined,
      hip_cm: formData.hip ? parseFloat(formData.hip) : undefined,
    });

    setSaving(false);
    setDialogOpen(false);
    setFormData({ weight: "", waist: "", hip: "" });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-lime" />
          <p className="text-muted-foreground">Cargando medidas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-muted-foreground">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide">PESO & MEDIDAS</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sigue tu progreso hacia tu meta
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="unit-toggle" className="text-xs sm:text-sm text-muted-foreground">kg</Label>
            <Switch
              id="unit-toggle"
              checked={useLbs}
              onCheckedChange={setUseLbs}
            />
            <Label htmlFor="unit-toggle" className="text-xs sm:text-sm text-muted-foreground">lbs</Label>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lime text-dark hover:bg-lime/90 font-semibold">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Registrar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Registrar medidas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm">Peso ({weightUnit})</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder={`ej: ${convertWeight(85)}`}
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="bg-secondary/50 border-0 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-sm">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.5"
                    placeholder="ej: 88"
                    value={formData.waist}
                    onChange={(e) => setFormData(prev => ({ ...prev, waist: e.target.value }))}
                    className="bg-secondary/50 border-0 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-sm">Cadera (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    step="0.5"
                    placeholder="ej: 98"
                    value={formData.hip}
                    onChange={(e) => setFormData(prev => ({ ...prev, hip: e.target.value }))}
                    className="bg-secondary/50 border-0 rounded-xl"
                  />
                </div>
                <Button
                  className="w-full bg-lime text-dark hover:bg-lime/90 font-semibold"
                  onClick={handleSave}
                  disabled={saving || !formData.weight}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Peso actual</p>
                <p className="font-display text-2xl sm:text-3xl truncate">
                  {convertWeight(latestWeight)}
                  <span className="text-sm sm:text-lg text-muted-foreground ml-1">{weightUnit}</span>
                </p>
              </div>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-lime/15 flex-shrink-0">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Esta semana</p>
                <p className={`font-display text-2xl sm:text-3xl ${weightChange && weightChange < 0 ? "text-green-500" : weightChange && weightChange > 0 ? "text-red-500" : ""}`}>
                  {weightChange !== null ? (
                    <>
                      {weightChange > 0 ? "+" : ""}{convertWeight(Math.abs(weightChange))}
                      <span className="text-sm sm:text-lg ml-1">{weightUnit}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </p>
              </div>
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg flex-shrink-0 ${weightChange && weightChange < 0 ? "bg-green-500/15" : "bg-red-500/15"}`}>
                {weightChange && weightChange < 0 ? (
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Para la meta</p>
                <p className="font-display text-2xl sm:text-3xl truncate">
                  {convertWeight(remainingToGoal)}
                  <span className="text-sm sm:text-lg text-muted-foreground ml-1">{weightUnit}</span>
                </p>
              </div>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-lime/15 flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-lime" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">IMC</p>
                <p className="font-display text-2xl sm:text-3xl">
                  {bmi.toFixed(1)}
                </p>
                <p className={`text-[10px] sm:text-xs ${bmiCategory.color}`}>
                  {bmiCategory.label}
                </p>
              </div>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to goal */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Progreso hacia la meta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Inicio: {convertWeight(initialWeight)} {weightUnit}</span>
              <span className="text-lime">Meta: {convertWeight(targetWeight)} {weightUnit}</span>
            </div>
            <div className="relative h-3 sm:h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime to-lime/80 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              <span className="text-lime font-semibold">{progressPercentage.toFixed(0)}%</span> completado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Historial
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-lime h-8 px-2 text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Ver todo
          </Button>
        </CardHeader>
        <CardContent>
          {measurements.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {measurements.map((measurement, index) => (
                <div
                  key={measurement.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{measurement.date}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {measurement.waist_cm && <span>Cintura: {measurement.waist_cm}cm</span>}
                      {measurement.hip_cm && <span>Cadera: {measurement.hip_cm}cm</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-display text-lg sm:text-xl">
                      {convertWeight(measurement.weight_kg)} {weightUnit}
                    </p>
                    {index < measurements.length - 1 && (
                      <p className={`text-[10px] sm:text-xs ${
                        measurement.weight_kg < measurements[index + 1]?.weight_kg
                          ? "text-green-500"
                          : measurement.weight_kg > measurements[index + 1]?.weight_kg
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}>
                        {measurement.weight_kg < measurements[index + 1]?.weight_kg ? "-" : "+"}
                        {Math.abs(measurement.weight_kg - (measurements[index + 1]?.weight_kg || measurement.weight_kg)).toFixed(1)} {weightUnit}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay registros todavía</p>
              <p className="text-xs mt-1">Registra tu peso para comenzar a trackear</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
