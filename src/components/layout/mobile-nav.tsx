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
  Scale,
  FileText,
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

const secondaryNav = [
  {
    name: "Peso",
    href: "/weight",
    icon: Scale,
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileText,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-card/90 backdrop-blur-xl border-t border-border/50" />

      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 touch-highlight min-w-[56px]",
                isActive
                  ? "text-lime"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                  isActive && "bg-lime/20"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-lime" : "text-muted-foreground"
                )}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute bottom-1 h-1 w-1 rounded-full bg-lime animate-scale-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
