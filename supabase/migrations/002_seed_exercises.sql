-- ============================================
-- FitLife Database Seed Data
-- Migration: 002_seed_exercises
-- Created: 2026-03-23
-- ============================================

-- ============================================
-- UPPER A EXERCISES (Monday)
-- ============================================

INSERT INTO exercises (name, description, muscle_groups, workout_day, sets, reps_min, reps_max, suggested_weight_lbs, weight_unit, order_index)
VALUES
  (
    'Press de Banca en Smith Machine',
    'Acostado en banco plano, agarre a la anchura de hombros. Baja la barra controladamente hasta el pecho y empuja hacia arriba.',
    ARRAY['chest', 'triceps', 'shoulders']::muscle_group[],
    'upper_a',
    4, 8, 10, 80, 'lbs', 1
  ),
  (
    'Press Militar con Mancuernas',
    'Sentado o de pie, mancuernas a la altura de los hombros. Empuja hacia arriba hasta extender los brazos.',
    ARRAY['shoulders', 'triceps']::muscle_group[],
    'upper_a',
    3, 10, 12, 20, 'lbs', 2
  ),
  (
    'Aperturas Pec Deck',
    'En máquina pec deck, brazos abiertos. Junta los brazos al frente contrayendo el pecho.',
    ARRAY['chest']::muscle_group[],
    'upper_a',
    3, 12, 15, 60, 'lbs', 3
  ),
  (
    'Elevaciones Laterales',
    'De pie, mancuernas a los lados. Eleva los brazos lateralmente hasta la altura de los hombros.',
    ARRAY['shoulders']::muscle_group[],
    'upper_a',
    3, 12, 15, 10, 'lbs', 4
  ),
  (
    'Tríceps Polea Cuerda',
    'En polea alta con cuerda. Extiende los codos empujando hacia abajo y separa las cuerdas al final.',
    ARRAY['triceps']::muscle_group[],
    'upper_a',
    3, 12, 15, 35, 'lbs', 5
  );

-- ============================================
-- LOWER A EXERCISES (Tuesday)
-- ============================================

INSERT INTO exercises (name, description, muscle_groups, workout_day, sets, reps_min, reps_max, suggested_weight_lbs, weight_unit, order_index)
VALUES
  (
    'Sentadilla con Barra',
    'Barra en espalda alta, pies a la anchura de hombros. Baja hasta que los muslos estén paralelos al suelo.',
    ARRAY['quadriceps', 'glutes']::muscle_group[],
    'lower_a',
    4, 8, 10, NULL, 'lbs', 1
  ),
  (
    'Prensa de Pierna',
    'En máquina de prensa, pies a la anchura de hombros. Empuja la plataforma extendiendo las piernas.',
    ARRAY['quadriceps', 'glutes']::muscle_group[],
    'lower_a',
    3, 10, 12, NULL, 'lbs', 2
  ),
  (
    'Extensión Cuádriceps Máquina',
    'Sentado en máquina de extensión. Extiende las piernas contrayendo los cuádriceps.',
    ARRAY['quadriceps']::muscle_group[],
    'lower_a',
    3, 12, 15, NULL, 'lbs', 3
  ),
  (
    'Zancadas con Mancuernas',
    'De pie con mancuernas. Da un paso adelante y baja hasta que ambas rodillas estén a 90 grados.',
    ARRAY['quadriceps', 'glutes']::muscle_group[],
    'lower_a',
    3, 10, 10, NULL, 'lbs', 4
  ),
  (
    'Elevación Pantorrillas',
    'De pie en máquina o escalón. Eleva los talones lo más alto posible y baja controladamente.',
    ARRAY['calves']::muscle_group[],
    'lower_a',
    3, 15, 20, NULL, 'lbs', 5
  );

-- ============================================
-- UPPER B EXERCISES (Thursday)
-- ============================================

INSERT INTO exercises (name, description, muscle_groups, workout_day, sets, reps_min, reps_max, suggested_weight_lbs, weight_unit, order_index)
VALUES
  (
    'Jalón al Pecho en Polea',
    'En máquina de polea alta, agarre ancho. Tira de la barra hacia el pecho contrayendo la espalda.',
    ARRAY['back', 'biceps']::muscle_group[],
    'upper_b',
    4, 8, 10, NULL, 'lbs', 1
  ),
  (
    'Remo con Barra',
    'Inclinado hacia adelante, barra colgando. Tira de la barra hacia el abdomen apretando los omóplatos.',
    ARRAY['back', 'biceps']::muscle_group[],
    'upper_b',
    3, 8, 10, NULL, 'lbs', 2
  ),
  (
    'Remo Mancuerna 1 Mano',
    'Apoyado en banco con una mano y rodilla. Tira de la mancuerna hacia la cadera.',
    ARRAY['back', 'biceps']::muscle_group[],
    'upper_b',
    3, 10, 12, NULL, 'lbs', 3
  ),
  (
    'Curl Bíceps con Barra',
    'De pie, barra con agarre supino. Flexiona los codos llevando la barra hacia los hombros.',
    ARRAY['biceps']::muscle_group[],
    'upper_b',
    3, 10, 12, NULL, 'lbs', 4
  ),
  (
    'Curl Martillo Mancuernas',
    'De pie, mancuernas con agarre neutro. Flexiona alternando o simultáneo.',
    ARRAY['biceps']::muscle_group[],
    'upper_b',
    3, 12, 15, NULL, 'lbs', 5
  );

-- ============================================
-- LOWER B EXERCISES (Friday)
-- ============================================

INSERT INTO exercises (name, description, muscle_groups, workout_day, sets, reps_min, reps_max, suggested_weight_lbs, weight_unit, order_index)
VALUES
  (
    'Peso Muerto con Barra',
    'Barra en el suelo, agarre a la anchura de hombros. Levanta manteniendo la espalda recta, empujando caderas.',
    ARRAY['hamstrings', 'glutes', 'back']::muscle_group[],
    'lower_b',
    4, 6, 8, NULL, 'lbs', 1
  ),
  (
    'Curl Femoral Máquina',
    'Acostado boca abajo en máquina. Flexiona las piernas llevando los talones hacia los glúteos.',
    ARRAY['hamstrings']::muscle_group[],
    'lower_b',
    3, 12, 15, NULL, 'lbs', 2
  ),
  (
    'Hip Thrust con Barra',
    'Espalda apoyada en banco, barra sobre caderas. Eleva las caderas apretando glúteos arriba.',
    ARRAY['glutes', 'hamstrings']::muscle_group[],
    'lower_b',
    3, 10, 12, NULL, 'lbs', 3
  ),
  (
    'Abducción Cadera Máquina',
    'Sentado en máquina de abducción. Abre las piernas contra la resistencia.',
    ARRAY['glutes']::muscle_group[],
    'lower_b',
    3, 15, 15, NULL, 'lbs', 4
  ),
  (
    'Plancha Abdominal',
    'Apoyado en antebrazos y puntas de pies. Mantén el cuerpo recto, contrayendo el core.',
    ARRAY['core']::muscle_group[],
    'lower_b',
    3, 30, 45, NULL, 'seconds', 5
  ),
  (
    'Crunch en Polea',
    'De rodillas frente a polea alta con cuerda. Flexiona el torso hacia abajo contrayendo abdominales.',
    ARRAY['core']::muscle_group[],
    'lower_b',
    3, 15, 15, NULL, 'lbs', 6
  );
