CREATE TABLE IF NOT EXISTS "screen_time_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" date NOT NULL,
	"minutes" integer NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sleep_records" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sleep_records" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sleep_records" DROP COLUMN IF EXISTS "screen_time";