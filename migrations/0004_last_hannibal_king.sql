CREATE TABLE IF NOT EXISTS "food_intake" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"breakfast" boolean DEFAULT false,
	"lunch" boolean DEFAULT false,
	"snacks" boolean DEFAULT false,
	"dinner" boolean DEFAULT false,
	"water_intake" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
