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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "text-lime"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
