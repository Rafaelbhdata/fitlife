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
  id,
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
        "flex w-full items-center gap-3 rounded-lg border p-3 transition-all duration-200",
        checked
          ? "border-lime/30 bg-lime/5"
          : "border-border bg-card hover:border-border/80 hover:bg-secondary/50",
        className
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-200",
          checked
            ? "border-lime bg-lime"
            : "border-muted-foreground/30"
        )}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-4 w-4 text-dark" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Icon */}
      {icon && <span className="text-lg">{icon}</span>}

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-left text-sm font-medium transition-colors duration-200",
          checked ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </button>
  );
}
