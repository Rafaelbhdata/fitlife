"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Droplets } from "lucide-react";

interface WaterProgressProps {
  consumed: number;
  goal: number;
  className?: string;
}

export function WaterProgress({ consumed, goal, className }: WaterProgressProps) {
  const [mounted, setMounted] = useState(false);
  const percentage = Math.min((consumed / goal) * 100, 100);
  const glasses = Math.floor(consumed / 250);
  const goalGlasses = Math.floor(goal / 250);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Water container */}
      <div className="relative h-32 w-20 rounded-b-3xl rounded-t-lg border-2 border-border bg-secondary overflow-hidden">
        {/* Water fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ height: mounted ? `${percentage}%` : "0%" }}
        >
          {/* Wave effect */}
          <div className="absolute -top-2 left-0 right-0 h-4">
            <svg
              viewBox="0 0 80 16"
              className="w-full h-full water-fill"
              preserveAspectRatio="none"
            >
              <path
                d="M0 8 Q10 4, 20 8 T40 8 T60 8 T80 8 V16 H0 Z"
                fill="currentColor"
                className="text-cyan-400"
              />
            </svg>
          </div>
        </div>

        {/* Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplets className={cn(
            "h-6 w-6 transition-colors duration-500",
            percentage > 50 ? "text-white/80" : "text-cyan-500/50"
          )} />
        </div>
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="font-display text-2xl">
          {glasses} / {goalGlasses}
        </p>
        <p className="text-xs text-muted-foreground">vasos</p>
        <p className="text-sm text-muted-foreground mt-1">
          {(consumed / 1000).toFixed(1)}L de {(goal / 1000).toFixed(1)}L
        </p>
      </div>
    </div>
  );
}
