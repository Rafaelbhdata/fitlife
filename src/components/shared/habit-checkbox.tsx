"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HabitCheckboxProps {
  id: string;
  label: string;
  icon?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function HabitCheckbox({
  label,
  icon,
  checked,
  onCheckedChange,
  className,
}: HabitCheckboxProps) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex w-full items-center gap-2 sm:gap-3 rounded-xl border p-2.5 sm:p-3 transition-all duration-200 group touch-highlight",
        checked
          ? "border-lime/30 bg-lime/5"
          : "border-border/50 bg-card hover:border-lime/20 hover:bg-secondary/50",
        className
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md border-2 transition-all duration-200 flex-shrink-0",
          checked
            ? "border-lime bg-lime scale-100"
            : "border-muted-foreground/30 group-hover:border-lime/50"
        )}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-dark" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Icon */}
      {icon && (
        <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
      )}

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-left text-xs sm:text-sm font-medium transition-colors duration-200 truncate",
          checked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {label}
      </span>

      {/* Completion indicator */}
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-1.5 w-1.5 rounded-full bg-lime flex-shrink-0"
        />
      )}
    </button>
  );
}
