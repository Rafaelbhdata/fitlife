"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { REST_TIMER_OPTIONS, DEFAULT_REST_TIME } from "@/lib/constants";

interface RestTimerProps {
  onComplete?: () => void;
  className?: string;
}

export function RestTimer({ onComplete, className }: RestTimerProps) {
  const [duration, setDuration] = useState(DEFAULT_REST_TIME);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  const percentage = (timeLeft / duration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsRunning(true);
  }, [timeLeft, duration]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Timer Display */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Background circle */}
        <svg className="absolute h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="#c8f135"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={364.42}
            strokeDashoffset={364.42 - (percentage / 100) * 364.42}
            className="transition-[stroke-dashoffset] duration-200"
          />
        </svg>

        {/* Time display */}
        <span className={cn(
          "font-display text-4xl",
          timeLeft <= 10 && timeLeft > 0 && "timer-pulse text-lime"
        )}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePause}
            className="h-12 w-12 rounded-full border-lime/30 hover:bg-lime/10"
          >
            <Pause className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleStart}
            className="h-12 w-12 rounded-full bg-lime text-dark hover:bg-lime-400"
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Duration options */}
      <div className="flex gap-2">
        {REST_TIMER_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={duration === option ? "default" : "outline"}
            size="sm"
            onClick={() => handleDurationChange(option)}
            className={cn(
              "text-xs",
              duration === option && "bg-lime text-dark hover:bg-lime-400"
            )}
          >
            {option}s
          </Button>
        ))}
      </div>
    </div>
  );
}
