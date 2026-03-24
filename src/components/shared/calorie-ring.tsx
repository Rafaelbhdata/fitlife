"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizes = {
  sm: { width: 80, stroke: 6, fontSize: "text-sm", subFontSize: "text-[10px]" },
  md: { width: 120, stroke: 8, fontSize: "text-lg", subFontSize: "text-xs" },
  lg: { width: 150, stroke: 10, fontSize: "text-2xl", subFontSize: "text-xs" },
};

export function CalorieRing({
  consumed,
  goal,
  size = "md",
  showLabel = true,
  className,
}: CalorieRingProps) {
  const [mounted, setMounted] = useState(false);
  const { width, stroke, fontSize, subFontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((consumed / goal) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOver = consumed > goal;
  const remaining = Math.max(0, goal - consumed);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={width}
        height={width}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="url(#calorieGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{
            filter: isOver ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))" : "drop-shadow(0 0 6px rgba(200, 241, 53, 0.3))"
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {isOver ? (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#c8f135" />
                <stop offset="100%" stopColor="#a5d610" />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display tracking-wide tabular-nums", fontSize)}>
            {consumed.toLocaleString()}
          </span>
          <span className={cn("text-muted-foreground", subFontSize)}>
            / {goal.toLocaleString()} kcal
          </span>
          {!isOver && (
            <span className={cn("text-lime mt-0.5", subFontSize)}>
              {remaining.toLocaleString()} restantes
            </span>
          )}
          {isOver && (
            <span className={cn("text-red-500 mt-0.5", subFontSize)}>
              +{(consumed - goal).toLocaleString()} excedido
            </span>
          )}
        </div>
      )}
    </div>
  );
}
