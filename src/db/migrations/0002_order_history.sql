CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"status" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"recipient_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"delivery_address" text NOT NULL,
	"delivery_instructions" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "order_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "order_total_amount_check" CHECK ("order"."total_amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "order_line_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"item_id" integer,
	"item_name" text NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" numeric(10, 2) NOT NULL,
	CONSTRAINT "order_line_item_quantity_check" CHECK ("order_line_item"."quantity" > 0),
	CONSTRAINT "order_line_item_unit_price_check" CHECK ("order_line_item"."unit_price" >= 0),
	CONSTRAINT "order_line_item_line_total_check" CHECK ("order_line_item"."line_total" >= 0)
);
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_idempotency_key_braintree_sandbox_transaction_idempotency_key_fk" FOREIGN KEY ("idempotency_key") REFERENCES "public"."braintree_sandbox_transaction"("idempotency_key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_line_item" ADD CONSTRAINT "order_line_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_line_item" ADD CONSTRAINT "order_line_item_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_user_id_idx" ON "order" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "order_line_item_order_id_idx" ON "order_line_item" USING btree ("order_id");