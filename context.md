# FitLife — Project Context

## Estado actual
- [x] Estructura base Next.js 14 creada
- [x] Tailwind CSS configurado con tema FitLife
- [x] shadcn/ui instalado y configurado
- [x] Fuentes configuradas (Bebas Neue display, DM Sans body)
- [x] Tema oscuro por defecto con acento verde lima #c8f135
- [ ] GitHub repo inicializado
- [ ] Schema Supabase creado
- [ ] Módulos implementados (0/7)
- [ ] API routes creadas
- [ ] Deploy en Vercel configurado

## Últimos cambios
| Fecha | Agente | Descripción |
|-------|--------|-------------|
| 2026-03-23 | Setup | Creación proyecto Next.js 14 con App Router |
| 2026-03-23 | Setup | Instalación de dependencias: Supabase, Recharts, Framer Motion, jsPDF |
| 2026-03-23 | Setup | Configuración shadcn/ui con componentes base |
| 2026-03-23 | UI | Configuración de design system FitLife |

## Archivos clave
| Archivo | Propósito |
|---------|-----------|
| `src/app/layout.tsx` | Layout raíz con fuentes y providers |
| `src/app/globals.css` | Estilos globales y tema FitLife |
| `tailwind.config.ts` | Configuración Tailwind con colores y animaciones |
| `src/lib/utils.ts` | Utilidades (cn para clases) |
| `src/components/ui/*` | Componentes shadcn/ui |
| `context.md` | Este archivo - contexto del proyecto |

## Schema de base de datos
*Pendiente de creación por Agente DB*

Tablas planeadas:
- `users` - Información del usuario
- `exercises` - Catálogo de ejercicios (precargados)
- `routines` - Rutinas de entrenamiento
- `workout_sessions` - Sesiones de entrenamiento
- `workout_sets` - Sets por ejercicio en cada sesión
- `meals` - Registros de comidas
- `food_items` - Items de comida por meal
- `body_measurements` - Peso y medidas corporales
- `water_logs` - Registro de hidratación
- `habits` - Definición de hábitos
- `habit_logs` - Registro diario de hábitos
- `journal_entries` - Entradas de journaling

## Variables de entorno requeridas
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Decisiones de arquitectura
1. **Next.js 14 App Router**: Server components por defecto, mejor performance
2. **Supabase**: BaaS completo con auth, database, realtime
3. **shadcn/ui**: Componentes accesibles y personalizables
4. **Tema oscuro por defecto**: Mejor para apps de fitness, menor fatiga visual
5. **Colores**: Fondo #0e0e0e, acento lima #c8f135 para energía y fitness
6. **Fuentes**: Bebas Neue (display/títulos), DM Sans (body/legibilidad)
7. **Client-side hydration**: Manejo de estado local + Supabase para persistencia

## Estructura de carpetas (planeada)
```
src/
├── app/
│   ├── (auth)/           # Rutas de autenticación
│   ├── (dashboard)/      # Rutas principales de la app
│   │   ├── dashboard/    # Módulo Dashboard
│   │   ├── workouts/     # Módulo Rutinas
│   │   ├── nutrition/    # Módulo Alimentación
│   │   ├── weight/       # Módulo Peso & Medidas
│   │   ├── hydration/    # Módulo Hidratación
│   │   ├── habits/       # Módulo Hábitos & Journaling
│   │   └── reports/      # Módulo Reportes
│   ├── api/              # API routes
│   └── layout.tsx        # Layout raíz
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Navbar, Sidebar, etc.
│   ├── dashboard/        # Componentes del dashboard
│   ├── workouts/         # Componentes de rutinas
│   ├── nutrition/        # Componentes de nutrición
│   ├── weight/           # Componentes de peso
│   ├── hydration/        # Componentes de hidratación
│   ├── habits/           # Componentes de hábitos
│   └── reports/          # Componentes de reportes
├── lib/
│   ├── supabase/         # Cliente y helpers de Supabase
│   ├── hooks/            # Custom hooks
│   ├── utils.ts          # Utilidades generales
│   └── constants.ts      # Constantes de la app
└── types/
    └── index.ts          # TypeScript types
```

## Próximos pasos
1. **Agente GitHub**: Inicializar repo git y crear en GitHub con gh CLI
2. **Agente DB**: Crear schema completo en Supabase con migraciones
3. **Agente UI**: Crear componentes de layout (Sidebar, Navbar, AppShell)
4. **Agente Módulo**: Implementar Dashboard como primer módulo

## Datos iniciales importantes
- **Meta calórica**: 1,685 kcal/día
- **Macros**: Proteína 130-150g, Carbohidratos ~160g, Grasas ~55g
- **Hidratación**: 2.5L diarios (10 vasos de 250ml)
- **Peso inicial**: 86 kg / 189 lbs
- **Altura**: 163 cm
- **Peso meta**: 79 kg / 174 lbs
- **Rutina**: Upper/Lower 4 días (Lun, Mar, Jue, Vie)

## Comandos útiles
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```
