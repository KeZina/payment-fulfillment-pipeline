-- Re-point any order line items referencing a duplicate item row to the
-- canonical (lowest id) row for that name, so history stays linked.
WITH canonical_items AS (
	SELECT "name", MIN("id") AS "canonical_id"
	FROM "item"
	GROUP BY "name"
)
UPDATE "order_line_item" AS "oli"
SET "item_id" = "ci"."canonical_id"
FROM "item" AS "dup"
JOIN canonical_items AS "ci" ON "ci"."name" = "dup"."name"
WHERE "oli"."item_id" = "dup"."id"
	AND "dup"."id" <> "ci"."canonical_id";
--> statement-breakpoint
-- Remove duplicate item rows introduced by repeated seeding, keeping the
-- lowest id per name.
WITH canonical_items AS (
	SELECT "name", MIN("id") AS "canonical_id"
	FROM "item"
	GROUP BY "name"
)
DELETE FROM "item" AS "dup"
USING canonical_items AS "ci"
WHERE "ci"."name" = "dup"."name"
	AND "dup"."id" <> "ci"."canonical_id";
--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_name_unique" UNIQUE("name");
