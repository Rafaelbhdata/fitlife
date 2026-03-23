"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  unit?: string;
  color?: "lime" | "red" | "blue" | "yellow";
  showPercentage?: boolean;
  className?: string;
}

const colorClasses = {
  lime: "bg-lime",
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};

export function MacroBar({
  label,
  current,
  goal,
  unit = "g",
  color = "lime",
  showPercentage = false,
  className,
}: MacroBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isOver = current > goal;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium",
          isOver ? "text-red-500" : "text-foreground"
        )}>
          {current.toFixed(0)}{unit}
          <span className="text-muted-foreground"> / {goal}{unit}</span>
          {showPercentage && (
            <span className="text-muted-foreground ml-2">
              ({percentage.toFixed(0)}%)
            </span>
          )}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isOver ? "bg-red-500" : colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
