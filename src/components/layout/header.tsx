"use client";

import { Bell, Search, User, Menu, Zap, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Scale,
  Droplets,
  CheckSquare,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Rutinas", href: "/workouts", icon: Dumbbell },
  { name: "Alimentación", href: "/nutrition", icon: Utensils },
  { name: "Peso", href: "/weight", icon: Scale },
  { name: "Hidratación", href: "/hydration", icon: Droplets },
  { name: "Hábitos", href: "/habits", icon: CheckSquare },
  { name: "Reportes", href: "/reports", icon: FileText },
];

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);
  const pathname = usePathname();
  const { user, signOut, getInitials, getDisplayName, loading } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left side - Mobile menu + Title & Date */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-foreground"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border/50 p-4">
              <SheetTitle className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime">
                  <Zap className="h-5 w-5 text-dark" strokeWidth={2.5} />
                </div>
                <span className="font-display text-2xl tracking-wider">FITLIFE</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-lime/15 text-lime"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-lime")} />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-lime" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Title & Date */}
        <div className="flex flex-col">
          {title && (
            <h1 className="font-display text-xl sm:text-2xl tracking-wide text-foreground">
              {title}
            </h1>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground">{capitalizedToday}</p>
        </div>
      </div>

      {/* Right side - Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - hidden on mobile, compact on tablet */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-48 lg:w-64 pl-9 bg-secondary/50 border-0 focus-visible:ring-lime/50 rounded-xl"
          />
        </div>

        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-lime p-0 text-[10px] text-dark flex items-center justify-center font-semibold">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Notificaciones
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-lg">💧</span>
                <span className="font-medium text-sm">Hora de hidratarte</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Han pasado 2 horas desde tu último vaso de agua
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍽️</span>
                <span className="font-medium text-sm">Registra tu comida</span>
              </div>
              <span className="text-xs text-muted-foreground">
                No olvides registrar tu almuerzo
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-lg">💪</span>
                <span className="font-medium text-sm">¡Día de Upper A!</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Hoy toca: Pecho, Hombro, Tríceps
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0"
            >
              <Avatar className="h-9 w-9 border-2 border-lime/30 transition-all duration-200 hover:border-lime/50">
                <AvatarFallback className="bg-lime/10 text-lime font-semibold text-sm">
                  {loading ? "..." : getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "..."}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer focus:text-destructive"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
