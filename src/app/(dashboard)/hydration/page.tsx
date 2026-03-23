"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WaterProgress } from "@/components/shared";
import { HYDRATION_GOALS } from "@/lib/constants";
import { Droplets, Plus, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data
const mockWaterLogs = [
  { id: "1", amount_ml: 500, logged_at: new Date().setHours(8, 30) },
  { id: "2", amount_ml: 250, logged_at: new Date().setHours(10, 15) },
  { id: "3", amount_ml: 500, logged_at: new Date().setHours(12, 0) },
  { id: "4", amount_ml: 250, logged_at: new Date().setHours(14, 30) },
  { id: "5", amount_ml: 250, logged_at: new Date().setHours(16, 0) },
];

export default function HydrationPage() {
  const [logs, setLogs] = useState(mockWaterLogs);

  const totalConsumed = logs.reduce((sum, log) => sum + log.amount_ml, 0);
  const goal = HYDRATION_GOALS.daily_ml;

  const addWater = (amount: number) => {
    const newLog = {
      id: Date.now().toString(),
      amount_ml: amount,
      logged_at: Date.now(),
    };
    setLogs([newLog, ...logs]);
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  const waterButtons = [
    { label: "Vaso", amount: HYDRATION_GOALS.glass_ml, icon: "🥛" },
    { label: "Botella", amount: HYDRATION_GOALS.bottle_ml, icon: "🍶" },
    { label: "Litro", amount: HYDRATION_GOALS.liter_ml, icon: "💧" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl tracking-wide">HIDRATACIÓN</h1>
        <p className="text-muted-foreground">
          Mantente hidratado durante el día
        </p>
      </div>

      {/* Main Progress */}
      <Card className="glass border-border/50">
        <CardContent className="flex flex-col items-center p-8">
          <WaterProgress consumed={totalConsumed} goal={goal} />

          {/* Quick add buttons */}
          <div className="flex gap-3 mt-6">
            {waterButtons.map((btn) => (
              <Button
                key={btn.amount}
                variant="outline"
                onClick={() => addWater(btn.amount)}
                className="flex-col h-auto py-4 px-6 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/50"
              >
                <span className="text-2xl mb-1">{btn.icon}</span>
                <span className="font-medium">{btn.label}</span>
                <span className="text-xs text-muted-foreground">
                  {btn.amount}ml
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <Droplets className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
            <p className="font-display text-2xl">{logs.length}</p>
            <p className="text-sm text-muted-foreground">Registros hoy</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl mb-2">🎯</p>
            <p className="font-display text-2xl">
              {Math.max(0, goal - totalConsumed)}ml
            </p>
            <p className="text-sm text-muted-foreground">Restantes</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl mb-2">⏰</p>
            <p className="font-display text-2xl">
              {logs.length > 0
                ? format(new Date(logs[0].logged_at), "HH:mm")
                : "--:--"}
            </p>
            <p className="text-sm text-muted-foreground">Último registro</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's logs */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Registros de hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <Droplets className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium">{log.amount_ml}ml</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.logged_at), "HH:mm")}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLog(log.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Droplets className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No hay registros todavía</p>
              <p className="text-sm">¡Empieza a hidratarte!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder info */}
      <Card className="glass border-border/50 border-cyan-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Clock className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <p className="font-medium">Recordatorio activo</p>
              <p className="text-sm text-muted-foreground">
                Recibirás una notificación cada 2 horas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
