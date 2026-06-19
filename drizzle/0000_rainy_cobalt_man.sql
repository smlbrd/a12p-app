CREATE TABLE "coins"
(
    "id"           uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name"         varchar(255)                               NOT NULL,
    "is_completed" boolean          DEFAULT false             NOT NULL,
    CONSTRAINT "coins_name_unique" UNIQUE ("name")
);
--> statement-breakpoint
CREATE TABLE "coins_to_duties"
(
    "coin_id" uuid NOT NULL,
    "duty_id" uuid NOT NULL,
    CONSTRAINT "coins_to_duties_coin_id_duty_id_pk" PRIMARY KEY ("coin_id", "duty_id")
);
--> statement-breakpoint
CREATE TABLE "duties"
(
    "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "number"      integer                                    NOT NULL,
    "description" text                                       NOT NULL,
    CONSTRAINT "duties_number_unique" UNIQUE ("number")
);
--> statement-breakpoint
ALTER TABLE "coins_to_duties"
    ADD CONSTRAINT "coins_to_duties_coin_id_coins_id_fk" FOREIGN KEY ("coin_id") REFERENCES "coins"."coins" ("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coins_to_duties"
    ADD CONSTRAINT "coins_to_duties_duty_id_duties_id_fk" FOREIGN KEY ("duty_id") REFERENCES "coins"."duties" ("id") ON DELETE cascade ON UPDATE no action;