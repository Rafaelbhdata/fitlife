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
  sm: { width: 80, stroke: 6, fontSize: "text-sm" },
  md: { width: 120, stroke: 8, fontSize: "text-lg" },
  lg: { width: 160, stroke: 10, fontSize: "text-2xl" },
};

export function CalorieRing({
  consumed,
  goal,
  size = "md",
  showLabel = true,
  className,
}: CalorieRingProps) {
  const [mounted, setMounted] = useState(false);
  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((consumed / goal) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOver = consumed > goal;

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
          stroke={isOver ? "#ef4444" : "#c8f135"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>

      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-display tracking-wide", fontSize)}>
            {consumed.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            / {goal.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">kcal</span>
        </div>
      )}
    </div>
  );
}
