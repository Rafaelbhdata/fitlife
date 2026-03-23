// ============================================
// FitLife - App Constants
// ============================================

// ============================================
// User Profile Defaults
// ============================================
export const DEFAULT_USER_PROFILE = {
  weight_kg: 86,
  weight_lbs: 189,
  height_cm: 163,
  target_weight_kg: 79,
  target_weight_lbs: 174,
} as const;

// ============================================
// Nutrition Goals
// ============================================
export const NUTRITION_GOALS = {
  calories: 1685,
  protein_min: 130,
  protein_max: 150,
  carbs: 160,
  fat: 55,
} as const;

// ============================================
// Hydration Goals
// ============================================
export const HYDRATION_GOALS = {
  daily_ml: 2500,
  glass_ml: 250,
  bottle_ml: 500,
  liter_ml: 1000,
  glasses_per_day: 10,
} as const;

// ============================================
// Workout Schedule
// ============================================
export const WORKOUT_SCHEDULE = {
  monday: "upper_a",
  tuesday: "lower_a",
  wednesday: null,
  thursday: "upper_b",
  friday: "lower_b",
  saturday: null,
  sunday: null,
} as const;

export const WORKOUT_DAY_LABELS = {
  upper_a: "Upper A - Pecho, Hombro, Tríceps",
  lower_a: "Lower A - Cuádriceps, Glúteos",
  upper_b: "Upper B - Espalda, Bíceps",
  lower_b: "Lower B - Isquios, Glúteos, Core",
} as const;

export const WORKOUT_DAY_SHORT = {
  upper_a: "Upper A",
  lower_a: "Lower A",
  upper_b: "Upper B",
  lower_b: "Lower B",
} as const;

// ============================================
// Rest Timer Options (seconds)
// ============================================
export const REST_TIMER_OPTIONS = [60, 90, 120] as const;
export const DEFAULT_REST_TIME = 90;

// ============================================
// Default Habits
// ============================================
export const DEFAULT_HABITS = [
  {
    name: "Dormir 7-8 horas",
    description: "Descanso adecuado para recuperación",
    icon: "🌙",
  },
  {
    name: "Cumplir meta de proteína",
    description: "Alcanzar 130-150g de proteína",
    icon: "🥩",
  },
  {
    name: "No refresco ni alcohol",
    description: "Evitar calorías vacías",
    icon: "🚫",
  },
  {
    name: "30 min mínimo de movimiento",
    description: "Actividad física diaria",
    icon: "🏃",
  },
  {
    name: "Tomar agua meta",
    description: "2.5 litros de agua",
    icon: "💧",
  },
  {
    name: "Journaling del día",
    description: "Reflexión diaria",
    icon: "📝",
  },
] as const;

// ============================================
// Journaling Prompts
// ============================================
export const JOURNAL_PROMPTS = [
  "¿Cómo te sentiste hoy?",
  "¿Qué comiste bien?",
  "¿Qué podrías mejorar mañana?",
  "¿Cuál fue tu logro del día?",
  "¿Qué te costó más trabajo?",
  "¿Cómo estuvo tu energía?",
  "¿Dormiste bien anoche?",
  "¿Qué te motivó hoy?",
] as const;

// ============================================
// Exercise Data - Initial Load
// ============================================
export const INITIAL_EXERCISES = {
  upper_a: [
    {
      name: "Press de Banca en Smith Machine",
      description:
        "Acostado en banco plano, agarre a la anchura de hombros. Baja la barra controladamente hasta el pecho y empuja hacia arriba.",
      muscle_groups: ["chest", "triceps", "shoulders"],
      sets: 4,
      reps_min: 8,
      reps_max: 10,
      suggested_weight_lbs: 80,
      weight_unit: "lbs",
    },
    {
      name: "Press Militar con Mancuernas",
      description:
        "Sentado o de pie, mancuernas a la altura de los hombros. Empuja hacia arriba hasta extender los brazos.",
      muscle_groups: ["shoulders", "triceps"],
      sets: 3,
      reps_min: 10,
      reps_max: 12,
      suggested_weight_lbs: 20,
      weight_unit: "lbs",
    },
    {
      name: "Aperturas Pec Deck",
      description:
        "En máquina pec deck, brazos abiertos. Junta los brazos al frente contrayendo el pecho.",
      muscle_groups: ["chest"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: 60,
      weight_unit: "lbs",
    },
    {
      name: "Elevaciones Laterales",
      description:
        "De pie, mancuernas a los lados. Eleva los brazos lateralmente hasta la altura de los hombros.",
      muscle_groups: ["shoulders"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: 10,
      weight_unit: "lbs",
    },
    {
      name: "Tríceps Polea Cuerda",
      description:
        "En polea alta con cuerda. Extiende los codos empujando hacia abajo y separa las cuerdas al final.",
      muscle_groups: ["triceps"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: 35,
      weight_unit: "lbs",
    },
  ],
  upper_b: [
    {
      name: "Jalón al Pecho en Polea",
      description:
        "En máquina de polea alta, agarre ancho. Tira de la barra hacia el pecho contrayendo la espalda.",
      muscle_groups: ["back", "biceps"],
      sets: 4,
      reps_min: 8,
      reps_max: 10,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Remo con Barra",
      description:
        "Inclinado hacia adelante, barra colgando. Tira de la barra hacia el abdomen apretando los omóplatos.",
      muscle_groups: ["back", "biceps"],
      sets: 3,
      reps_min: 8,
      reps_max: 10,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Remo Mancuerna 1 Mano",
      description:
        "Apoyado en banco con una mano y rodilla. Tira de la mancuerna hacia la cadera.",
      muscle_groups: ["back", "biceps"],
      sets: 3,
      reps_min: 10,
      reps_max: 12,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Curl Bíceps con Barra",
      description:
        "De pie, barra con agarre supino. Flexiona los codos llevando la barra hacia los hombros.",
      muscle_groups: ["biceps"],
      sets: 3,
      reps_min: 10,
      reps_max: 12,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Curl Martillo Mancuernas",
      description:
        "De pie, mancuernas con agarre neutro. Flexiona alternando o simultáneo.",
      muscle_groups: ["biceps"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
  ],
  lower_a: [
    {
      name: "Sentadilla con Barra",
      description:
        "Barra en espalda alta, pies a la anchura de hombros. Baja hasta que los muslos estén paralelos al suelo.",
      muscle_groups: ["quadriceps", "glutes"],
      sets: 4,
      reps_min: 8,
      reps_max: 10,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Prensa de Pierna",
      description:
        "En máquina de prensa, pies a la anchura de hombros. Empuja la plataforma extendiendo las piernas.",
      muscle_groups: ["quadriceps", "glutes"],
      sets: 3,
      reps_min: 10,
      reps_max: 12,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Extensión Cuádriceps Máquina",
      description:
        "Sentado en máquina de extensión. Extiende las piernas contrayendo los cuádriceps.",
      muscle_groups: ["quadriceps"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Zancadas con Mancuernas",
      description:
        "De pie con mancuernas. Da un paso adelante y baja hasta que ambas rodillas estén a 90 grados.",
      muscle_groups: ["quadriceps", "glutes"],
      sets: 3,
      reps_min: 10,
      reps_max: 10,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Elevación Pantorrillas",
      description:
        "De pie en máquina o escalón. Eleva los talones lo más alto posible y baja controladamente.",
      muscle_groups: ["calves"],
      sets: 3,
      reps_min: 15,
      reps_max: 20,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
  ],
  lower_b: [
    {
      name: "Peso Muerto con Barra",
      description:
        "Barra en el suelo, agarre a la anchura de hombros. Levanta manteniendo la espalda recta, empujando caderas.",
      muscle_groups: ["hamstrings", "glutes", "back"],
      sets: 4,
      reps_min: 6,
      reps_max: 8,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Curl Femoral Máquina",
      description:
        "Acostado boca abajo en máquina. Flexiona las piernas llevando los talones hacia los glúteos.",
      muscle_groups: ["hamstrings"],
      sets: 3,
      reps_min: 12,
      reps_max: 15,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Hip Thrust con Barra",
      description:
        "Espalda apoyada en banco, barra sobre caderas. Eleva las caderas apretando glúteos arriba.",
      muscle_groups: ["glutes", "hamstrings"],
      sets: 3,
      reps_min: 10,
      reps_max: 12,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Abducción Cadera Máquina",
      description:
        "Sentado en máquina de abducción. Abre las piernas contra la resistencia.",
      muscle_groups: ["glutes"],
      sets: 3,
      reps_min: 15,
      reps_max: 15,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
    {
      name: "Plancha Abdominal",
      description:
        "Apoyado en antebrazos y puntas de pies. Mantén el cuerpo recto, contrayendo el core.",
      muscle_groups: ["core"],
      sets: 3,
      reps_min: 30,
      reps_max: 45,
      suggested_weight_lbs: null,
      weight_unit: "seconds",
    },
    {
      name: "Crunch en Polea",
      description:
        "De rodillas frente a polea alta con cuerda. Flexiona el torso hacia abajo contrayendo abdominales.",
      muscle_groups: ["core"],
      sets: 3,
      reps_min: 15,
      reps_max: 15,
      suggested_weight_lbs: null,
      weight_unit: "lbs",
    },
  ],
} as const;

// ============================================
// Notification Settings
// ============================================
export const NOTIFICATION_INTERVALS = {
  hydration_hours: 2,
  meal_reminder_hours: [8, 13, 19], // 8am, 1pm, 7pm
} as const;

// ============================================
// UI Constants
// ============================================
export const CHART_COLORS = {
  primary: "#c8f135",
  secondary: "#a1a1aa",
  calories: "#c8f135",
  protein: "#ef4444",
  carbs: "#3b82f6",
  fat: "#f59e0b",
  water: "#06b6d4",
} as const;

// ============================================
// Date Formats
// ============================================
export const DATE_FORMATS = {
  display: "d 'de' MMMM, yyyy",
  short: "dd/MM/yyyy",
  day: "EEEE",
  time: "HH:mm",
  iso: "yyyy-MM-dd",
} as const;
