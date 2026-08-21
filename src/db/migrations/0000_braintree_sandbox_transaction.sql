CREATE TABLE "braintree_sandbox_transaction" (
	"idempotency_key" uuid PRIMARY KEY NOT NULL,
	"request_fingerprint" text NOT NULL,
	"user_id" text NOT NULL,
	"transaction_id" text NOT NULL,
	"transaction_status" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"inventory_applied" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "braintree_sandbox_transaction_amount_check" CHECK ("braintree_sandbox_transaction"."amount" > 0)
);
--> statement-breakpoint
ALTER TABLE "braintree_sandbox_transaction" ADD CONSTRAINT "braintree_sandbox_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "braintree_sandbox_transaction_transaction_id_uidx" ON "braintree_sandbox_transaction" USING btree ("transaction_id");
--> statement-breakpoint
CREATE INDEX "braintree_sandbox_transaction_user_id_idx" ON "braintree_sandbox_transaction" USING btree ("user_id");
