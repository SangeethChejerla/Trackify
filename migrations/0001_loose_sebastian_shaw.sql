CREATE TABLE IF NOT EXISTS "sleep_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"sleep_time" timestamp NOT NULL,
	"wake_time" timestamp NOT NULL,
	"screen_time" integer NOT NULL,
	"total_sleep" integer NOT NULL,
	"quality" integer NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now()
);
