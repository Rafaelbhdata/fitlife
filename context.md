# FitLife — Project Context

## Estado actual
- [x] Estructura base Next.js 14 creada
- [x] Tailwind CSS configurado con tema FitLife
- [x] shadcn/ui instalado y configurado
- [x] Fuentes configuradas (Bebas Neue display, DM Sans body)
- [x] Tema oscuro por defecto con acento verde lima #c8f135
- [x] GitHub repo creado: https://github.com/Rafaelbhdata/fitlife
- [x] Schema Supabase diseñado (migraciones SQL listas)
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
| 2026-03-23 | GitHub | Repositorio creado en GitHub |
| 2026-03-23 | DB | Schema de Supabase completo con migraciones |

## Archivos clave
| Archivo | Propósito |
|---------|-----------|
| `src/app/layout.tsx` | Layout raíz con fuentes y providers |
| `src/app/globals.css` | Estilos globales y tema FitLife |
| `tailwind.config.ts` | Configuración Tailwind con colores y animaciones |
| `src/lib/utils.ts` | Utilidades (cn para clases) |
| `src/lib/constants.ts` | Constantes de la app (metas, ejercicios, etc.) |
| `src/lib/supabase/*` | Clientes de Supabase (browser, server, middleware) |
| `src/types/index.ts` | Definiciones TypeScript completas |
| `src/middleware.ts` | Middleware de autenticación |
| `src/components/ui/*` | Componentes shadcn/ui |
| `supabase/migrations/*` | Migraciones SQL para Supabase |
| `context.md` | Este archivo - contexto del proyecto |

## Schema de base de datos

### Tablas creadas:

| Tabla | Descripción | RLS |
|-------|-------------|-----|
| `user_profiles` | Perfil de usuario (altura, metas, preferencias) | ✅ |
| `exercises` | Catálogo de ejercicios (21 precargados) | ❌ (read-only) |
| `workout_sessions` | Sesiones de entrenamiento | ✅ |
| `workout_sets` | Sets por ejercicio en cada sesión | ✅ |
| `meals` | Registros de comidas por día | ✅ |
| `food_items` | Items de comida por meal | ✅ |
| `body_measurements` | Peso y medidas corporales semanales | ✅ |
| `water_logs` | Registro de hidratación | ✅ |
| `habits` | Definición de hábitos personalizados | ✅ |
| `habit_logs` | Registro diario de hábitos | ✅ |
| `journal_entries` | Entradas de journaling | ✅ |

### Enums creados:
- `muscle_group`: chest, back, shoulders, biceps, triceps, quadriceps, hamstrings, glutes, calves, core, full_body
- `workout_day`: upper_a, lower_a, upper_b, lower_b
- `set_feeling`: too_heavy, hard, perfect, light, want_more
- `meal_type`: breakfast, lunch, dinner, snack
- `weight_unit`: lbs, bodyweight, seconds

### Funciones creadas:
- `get_daily_nutrition(user_id, date)` - Resumen nutricional del día
- `get_daily_water(user_id, date)` - Total de agua del día
- `get_habits_completion(user_id, date)` - Progreso de hábitos
- `handle_new_user()` - Crear perfil automáticamente al registrarse

### Para aplicar el schema:
1. Ir a Supabase Dashboard > SQL Editor
2. Ejecutar `supabase/migrations/001_initial_schema.sql`
3. Ejecutar `supabase/migrations/002_seed_exercises.sql`

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
2. **Supabase**: BaaS completo con auth, database, realtime, RLS habilitado
3. **shadcn/ui**: Componentes accesibles y personalizables
4. **Tema oscuro por defecto**: Mejor para apps de fitness, menor fatiga visual
5. **Colores**: Fondo #0e0e0e, acento lima #c8f135 para energía y fitness
6. **Fuentes**: Bebas Neue (display/títulos), DM Sans (body/legibilidad)
7. **Row Level Security**: Todas las tablas de usuario tienen RLS habilitado
8. **Ejercicios como referencia**: Tabla `exercises` sin RLS, datos precargados

## Estructura de carpetas
```
fitkis/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Rutas de autenticación
│   │   ├── (dashboard)/      # Rutas principales de la app
│   │   │   ├── dashboard/    # Módulo Dashboard
│   │   │   ├── workouts/     # Módulo Rutinas
│   │   │   ├── nutrition/    # Módulo Alimentación
│   │   │   ├── weight/       # Módulo Peso & Medidas
│   │   │   ├── hydration/    # Módulo Hidratación
│   │   │   ├── habits/       # Módulo Hábitos & Journaling
│   │   │   └── reports/      # Módulo Reportes
│   │   ├── api/              # API routes
│   │   └── layout.tsx        # Layout raíz
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Navbar, Sidebar, etc.
│   │   └── [module]/         # Componentes por módulo
│   ├── lib/
│   │   ├── supabase/         # Cliente y helpers de Supabase
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils.ts          # Utilidades generales
│   │   └── constants.ts      # Constantes de la app
│   └── types/
│       └── index.ts          # TypeScript types
├── supabase/
│   └── migrations/           # Archivos SQL de migración
├── public/                   # Assets estáticos
└── context.md               # Este archivo
```

## Próximos pasos
1. **Agente UI**: Crear componentes de layout (Sidebar, Navbar, AppShell)
2. **Agente Módulo Dashboard**: Implementar página principal con widgets
3. **Agente Módulo Rutinas**: Implementar tracking de ejercicios
4. Continuar con los demás módulos...

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
