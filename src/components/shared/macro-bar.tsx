"use client";

import { cn } from "@/lib/utils";

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

const glowClasses = {
  lime: "shadow-[0_0_10px_rgba(200,241,53,0.3)]",
  red: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
  blue: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
  yellow: "shadow-[0_0_10px_rgba(234,179,8,0.3)]",
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
    <div className={cn("space-y-1.5 sm:space-y-2", className)}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium tabular-nums",
          isOver ? "text-red-500" : "text-foreground"
        )}>
          {current.toFixed(0)}{unit}
          <span className="text-muted-foreground"> / {goal}{unit}</span>
          {showPercentage && (
            <span className="text-muted-foreground ml-1 sm:ml-2">
              ({percentage.toFixed(0)}%)
            </span>
          )}
        </span>
      </div>
      <div className="relative h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isOver ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : cn(colorClasses[color], glowClasses[color])
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
