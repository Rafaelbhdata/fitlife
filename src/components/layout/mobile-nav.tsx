"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Droplets,
  CheckSquare,
} from "lucide-react";

const navigation = [
  {
    name: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Rutinas",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Comida",
    href: "/nutrition",
    icon: Utensils,
  },
  {
    name: "Agua",
    href: "/hydration",
    icon: Droplets,
  },
  {
    name: "Hábitos",
    href: "/habits",
    icon: CheckSquare,
  },
];


export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]" />

      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-1 py-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-4 py-2.5 transition-all duration-200 touch-highlight min-w-[60px] min-h-[56px]",
                isActive
                  ? "text-lime"
                  : "text-muted-foreground active:text-foreground active:scale-95"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                  isActive && "bg-lime/15 shadow-sm"
                )}
              >
                <Icon
                  className={cn(
                    "h-[22px] w-[22px] transition-all duration-200",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide transition-colors duration-200",
                  isActive ? "text-lime" : "text-muted-foreground"
                )}
              >
                {item.name}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-lime animate-scale-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
