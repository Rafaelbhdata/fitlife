# FitLife — Project Context

## Estado actual
- [x] Estructura base Next.js 14 creada
- [x] Tailwind CSS configurado con tema FitLife
- [x] shadcn/ui instalado y configurado
- [x] Fuentes configuradas (Bebas Neue display, DM Sans body)
- [x] Tema oscuro por defecto con acento verde lima #c8f135
- [x] GitHub repo creado: https://github.com/Rafaelbhdata/fitlife
- [x] Schema Supabase diseñado (migraciones SQL listas)
- [x] **Migraciones aplicadas en Supabase** (11 tablas + 21 ejercicios)
- [x] Componentes de layout creados (Sidebar, Header, AppShell)
- [x] Componentes compartidos creados (CalorieRing, WaterProgress, etc.)
- [x] Módulo Dashboard implementado (v1)
- [x] Módulo Rutinas implementado (v1) con sesión de tracking
- [x] Módulo Alimentación implementado (v1)
- [x] Módulo Peso & Medidas implementado (v1)
- [x] Módulo Hidratación implementado (v1)
- [x] Módulo Hábitos & Journaling implementado (v1)
- [x] Módulo Reportes implementado (v1)
- [x] API routes con Supabase
- [x] Custom hooks para todos los módulos
- [x] Build compilando exitosamente
- [x] Fix: CSS @apply con opacity (color-mix)
- [x] Fix: base-ui/react asChild → render compatibility
- [x] Fix: Middleware auth redirect deshabilitado para desarrollo
- [ ] Deploy en Vercel configurado

## Últimos cambios
| Fecha | Agente | Descripción |
|-------|--------|-------------|
| 2026-03-23 | Setup | Creación proyecto Next.js 14 con App Router |
| 2026-03-23 | Setup | Instalación de dependencias |
| 2026-03-23 | UI | Configuración de design system FitLife |
| 2026-03-23 | GitHub | Repositorio creado en GitHub |
| 2026-03-23 | DB | Schema de Supabase completo con migraciones |
| 2026-03-23 | UI | Componentes de layout (Sidebar, Header, AppShell) |
| 2026-03-23 | UI | Componentes compartidos (CalorieRing, WaterProgress, etc.) |
| 2026-03-23 | Módulos | Todos los 7 módulos implementados con UI funcional |
| 2026-03-23 | API | Custom hooks para Supabase (workouts, nutrition, weight, hydration, habits) |
| 2026-03-23 | API | Ruta /api/stats para dashboard |
| 2026-03-23 | API | Fix compatibilidad base-ui/react (asChild → render) |
| 2026-03-23 | Deploy | vercel.json configurado |
| 2026-03-23 | Build | Fix errores de build (CSS opacity, unused vars, types) |
| 2026-03-23 | Auth | Middleware auth redirect deshabilitado para desarrollo |
| 2026-03-23 | DB | **Migraciones aplicadas via Supabase Management API** |
| 2026-03-23 | DB | Schema desplegado: 11 tablas, 21 ejercicios, RLS, triggers |

## Archivos clave
| Archivo | Propósito |
|---------|-----------|
| `src/app/layout.tsx` | Layout raíz con fuentes y providers |
| `src/app/globals.css` | Estilos globales y tema FitLife |
| `tailwind.config.ts` | Configuración Tailwind con colores y animaciones |
| `src/lib/constants.ts` | Constantes de la app (metas, ejercicios, etc.) |
| `src/lib/supabase/*` | Clientes de Supabase (browser, server, middleware) |
| `src/types/index.ts` | Definiciones TypeScript completas |
| `src/components/layout/*` | Sidebar, Header, AppShell, MobileNav |
| `src/components/shared/*` | CalorieRing, WaterProgress, MacroBar, etc. |
| `src/app/(dashboard)/*` | Todas las páginas de módulos |
| `supabase/migrations/*` | Migraciones SQL para Supabase |

## Módulos implementados

### Dashboard (`/dashboard`)
- Anillo de calorías con progreso
- Barras de macros (proteína, carbos, grasas)
- Widget de hidratación con botones rápidos
- Tarjeta de rutina del día
- Widget de peso con tendencia
- Lista de hábitos con checkboxes
- Accesos rápidos a módulos

### Rutinas (`/workouts`)
- Vista de semana con días de entrenamiento
- Tabs para cada tipo de rutina (Upper A, Lower A, etc.)
- Lista de ejercicios con series/reps/peso
- **Sesión activa** (`/workouts/session/[day]`)
  - Registro de peso y reps por set
  - Selector de sensación (emojis)
  - Timer de descanso configurable (60/90/120s)
  - Notas por ejercicio
  - Barra de progreso
  - Ejercicios colapsables

### Alimentación (`/nutrition`)
- Anillo de calorías del día
- Barras de macros
- Búsqueda de alimentos
- Tabs por tipo de comida (Desayuno, Comida, Cena, Snacks)
- Lista de alimentos registrados

### Peso & Medidas (`/weight`)
- Peso actual con tendencia
- Cambio semanal
- Distancia a meta
- IMC calculado
- Toggle kg/lbs
- Historial de mediciones
- Barra de progreso hacia meta
- Dialog para registrar nuevas medidas

### Hidratación (`/hydration`)
- Visualización de vaso/botella de agua
- Botones rápidos (vaso, botella, litro)
- Lista de registros del día
- Estadísticas (registros, restante, último registro)

### Hábitos (`/habits`)
- Lista de hábitos con checkboxes animados
- Barra de progreso diaria
- Racha de días
- Tab de Journaling
- Prompts de reflexión
- Textarea para entrada de journal
- Entradas anteriores

### Reportes (`/reports`)
- Resumen de entrenamientos completados
- Promedio de calorías/macros
- Cambio de peso semanal
- Tasa de completitud de hábitos
- Progresión de ejercicios (peso)
- Desglose de hábitos por día
- Botón para exportar PDF

## Schema de base de datos

### Tablas creadas:
| Tabla | Descripción | RLS |
|-------|-------------|-----|
| `user_profiles` | Perfil de usuario | ✅ |
| `exercises` | Catálogo de ejercicios (21 precargados) | ❌ |
| `workout_sessions` | Sesiones de entrenamiento | ✅ |
| `workout_sets` | Sets por ejercicio | ✅ |
| `meals` | Registros de comidas | ✅ |
| `food_items` | Items de comida | ✅ |
| `body_measurements` | Peso y medidas | ✅ |
| `water_logs` | Registro de hidratación | ✅ |
| `habits` | Hábitos | ✅ |
| `habit_logs` | Registro de hábitos | ✅ |
| `journal_entries` | Journaling | ✅ |

### Estado del schema:
✅ **Ya aplicado** en Supabase proyecto `hjjhseahmuqtjukgfeej`
- 11 tablas creadas con RLS habilitado
- 21 ejercicios precargados (Upper A: 5, Lower A: 5, Upper B: 5, Lower B: 6)
- Triggers para auto-actualizar updated_at
- Funciones: get_daily_nutrition, get_daily_water, get_habits_completion
- Trigger on_auth_user_created para crear perfil automáticamente

## Variables de entorno requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Decisiones de arquitectura
1. **Next.js 14 App Router**: Server components por defecto
2. **Supabase**: BaaS con RLS habilitado
3. **shadcn/ui**: Componentes personalizados
4. **Tema oscuro**: Fondo #0e0e0e, acento #c8f135
5. **Fuentes**: Bebas Neue (display), DM Sans (body)
6. **Mock data**: UI funcional antes de conectar Supabase
7. **Componentes colapsables**: Ejercicios en sesión de workout

## Próximos pasos
1. **Deploy en Vercel**: Configurar proyecto y variables de entorno
2. **Autenticación**: Crear página de login/signup con Supabase Auth
3. **Conectar módulos**: Reemplazar mock data con hooks de Supabase
4. **Mejoras futuras**:
   - Open Food Facts API para buscador de alimentos (ya integrado en hook)
   - Export PDF funcional con jsPDF
   - Notificaciones in-app
   - PWA manifest

## Datos iniciales importantes
- **Meta calórica**: 1,685 kcal/día
- **Macros**: P 130-150g, C ~160g, G ~55g
- **Hidratación**: 2.5L diarios
- **Peso inicial**: 86 kg
- **Peso meta**: 79 kg
- **Rutina**: Upper/Lower 4 días

## Comandos útiles
```bash
npm run dev     # Desarrollo
npm run build   # Build
npm run lint    # Lint
```
