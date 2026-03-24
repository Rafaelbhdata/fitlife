"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Scale,
  Droplets,
  CheckSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Rutinas",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Alimentación",
    href: "/nutrition",
    icon: Utensils,
  },
  {
    name: "Peso",
    href: "/weight",
    icon: Scale,
  },
  {
    name: "Hidratación",
    href: "/hydration",
    icon: Droplets,
  },
  {
    name: "Hábitos",
    href: "/habits",
    icon: CheckSquare,
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-card/95 backdrop-blur-xl transition-all duration-300 hidden lg:block",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime transition-all duration-300 group-hover:lime-glow-sm">
              <Zap className="h-5 w-5 text-dark" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl tracking-wider text-foreground">
              FITLIFE
            </span>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-lime transition-all duration-300 hover:lime-glow-sm"
          >
            <Zap className="h-5 w-5 text-dark" strokeWidth={2.5} />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-lime/15 text-lime"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-lime/20"
                    : "bg-transparent group-hover:bg-secondary"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-lime" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              </div>
              {!collapsed && (
                <span className="transition-colors duration-200">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-lime" />
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.name}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Colapsar</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
