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

  const isComplete = percentage >= 100;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Water container */}
      <div className="relative h-28 sm:h-32 w-16 sm:w-20 rounded-b-3xl rounded-t-xl border-2 border-cyan-500/30 bg-secondary/50 overflow-hidden">
        {/* Water fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
          style={{
            height: mounted ? `${percentage}%` : "0%",
            background: isComplete
              ? "linear-gradient(to top, #06b6d4, #22d3ee)"
              : "linear-gradient(to top, #0891b2, #22d3ee)"
          }}
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

          {/* Bubbles effect when filling */}
          {mounted && percentage > 20 && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
              <div className="absolute bottom-4 right-3 w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-6 left-3 w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          )}
        </div>

        {/* Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplets className={cn(
            "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-500",
            percentage > 50 ? "text-white/80" : "text-cyan-500/50"
          )} />
        </div>

        {/* Completion glow */}
        {isComplete && (
          <div className="absolute inset-0 bg-cyan-400/20 animate-pulse-subtle" />
        )}
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="font-display text-xl sm:text-2xl">
          <span className={cn(isComplete && "text-cyan-400")}>{glasses}</span>
          <span className="text-muted-foreground"> / {goalGlasses}</span>
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">vasos</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {(consumed / 1000).toFixed(1)}L de {(goal / 1000).toFixed(1)}L
        </p>
        {isComplete && (
          <p className="text-xs text-cyan-400 mt-1 animate-scale-in">
            ¡Meta cumplida!
          </p>
        )}
      </div>
    </div>
  );
}
