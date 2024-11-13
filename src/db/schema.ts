import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const moods = pgTable('moods', {
  id: serial('id').primaryKey(),
  mood: integer('mood').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Mood = typeof moods.$inferSelect;
export type NewMood = typeof moods.$inferInsert;

export const sleepRecords = pgTable('sleep_records', {
  id: serial('id').primaryKey(),
  date: date('date').notNull().defaultNow(), // The actual date of the sleep record
  sleepTime: timestamp('sleep_time').notNull(),
  wakeTime: timestamp('wake_time').notNull(),
  totalSleep: integer('total_sleep').notNull(), // in minutes
  quality: integer('quality').notNull(), // 1-5 rating
  createdAt: timestamp('created_at').defaultNow(),
});

export const screenTimeRecords = pgTable('screen_time_records', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  minutes: integer('minutes').notNull(),
  category: text('category').notNull(), // work, entertainment, social, etc.
  createdAt: timestamp('created_at').defaultNow(),
});

export const foodIntakeTable = pgTable('food_intake', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  breakfast: boolean('breakfast').default(false),
  lunch: boolean('lunch').default(false),
  snacks: boolean('snacks').default(false),
  dinner: boolean('dinner').default(false),
  waterIntake: integer('water_intake').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
