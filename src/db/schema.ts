import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core';

export const workouts = pgTable('workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: text('user_id').notNull(),
  name: text('name').notNull(),
  started_at: timestamp('started_at').notNull(),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const exercises = pgTable('exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const workout_exercises = pgTable('workout_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  workout_id: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exercise_id: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const sets = pgTable('sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workout_exercise_id: uuid('workout_exercise_id').notNull().references(() => workout_exercises.id, { onDelete: 'cascade' }),
  set_number: integer('set_number').notNull(),
  weight: numeric('weight', { precision: 6, scale: 2 }),
  reps: integer('reps'),
});
