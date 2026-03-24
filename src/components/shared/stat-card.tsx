"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "glass border-border/50 transition-all duration-300 card-interactive group",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="font-display text-2xl sm:text-3xl tracking-wide">{value}</p>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                <span
                  className={cn(
                    "font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-muted-foreground">vs semana</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-lime/10 group-hover:bg-lime/20 transition-colors duration-300 flex-shrink-0">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-lime" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
