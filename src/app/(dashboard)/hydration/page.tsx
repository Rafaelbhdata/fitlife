"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WaterProgress } from "@/components/shared";
import { HYDRATION_GOALS } from "@/lib/constants";
import { useHydration } from "@/lib/hooks/use-hydration";
import { Droplets, Clock, Trash2, Target, History, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function HydrationPage() {
  const { hydration, loading, error, addWater, removeWaterLog } = useHydration();

  const totalConsumed = hydration?.total_ml || 0;
  const goal = hydration?.goal_ml || HYDRATION_GOALS.daily_ml;
  const logs = hydration?.logs || [];

  const handleAddWater = async (amount: number) => {
    await addWater(amount);
  };

  const handleRemoveLog = async (id: string) => {
    await removeWaterLog(id);
  };

  const waterButtons = [
    { label: "Vaso", amount: HYDRATION_GOALS.glass_ml, icon: "🥛" },
    { label: "Botella", amount: HYDRATION_GOALS.bottle_ml, icon: "🍶" },
    { label: "Litro", amount: HYDRATION_GOALS.liter_ml, icon: "💧" },
  ];

  const remaining = Math.max(0, goal - totalConsumed);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-muted-foreground">Cargando hidratación...</p>
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
      <div>
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide">HIDRATACIÓN</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mantente hidratado durante el día
        </p>
      </div>

      {/* Main Progress */}
      <Card className="glass border-border/50">
        <CardContent className="flex flex-col items-center p-6 sm:p-8">
          <WaterProgress consumed={totalConsumed} goal={goal} />

          {/* Quick add buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 justify-center">
            {waterButtons.map((btn) => (
              <Button
                key={btn.amount}
                variant="outline"
                onClick={() => handleAddWater(btn.amount)}
                className="flex-col h-auto py-3 sm:py-4 px-4 sm:px-6 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-200"
              >
                <span className="text-xl sm:text-2xl mb-1">{btn.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{btn.label}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {btn.amount}ml
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-3">
        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-cyan-500" />
            <p className="font-display text-xl sm:text-2xl">{logs.length}</p>
            <p className="text-[10px] sm:text-sm text-muted-foreground">Registros</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-cyan-500" />
            <p className="font-display text-xl sm:text-2xl">
              {remaining}
              <span className="text-xs sm:text-sm text-muted-foreground">ml</span>
            </p>
            <p className="text-[10px] sm:text-sm text-muted-foreground">Restantes</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <History className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-cyan-500" />
            <p className="font-display text-xl sm:text-2xl">
              {logs.length > 0
                ? format(new Date(logs[0].logged_at), "HH:mm")
                : "--:--"}
            </p>
            <p className="text-[10px] sm:text-sm text-muted-foreground">Último</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's logs */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Registros de hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-secondary/50 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-cyan-500/15">
                      <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{log.amount_ml}ml</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.logged_at), "HH:mm")}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLog(log.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <Droplets className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay registros todavía</p>
              <p className="text-xs mt-1">¡Empieza a hidratarte!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder info */}
      <Card className="glass border-cyan-500/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-cyan-500/15 flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">Recordatorio activo</p>
              <p className="text-xs text-muted-foreground truncate">
                Recibirás una notificación cada 2 horas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
