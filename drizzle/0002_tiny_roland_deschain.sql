CREATE TYPE "coins"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "coins"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "coins"."role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "coins"."coins_to_duties" DROP CONSTRAINT "coins_to_duties_coin_id_duty_id_pk";