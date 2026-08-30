import * as v from "valibot";
import {
  DISCOUNT_AMOUNT_REGEX,
  NON_NEGATIVE_INTEGER_REGEX,
} from "@/constants/admin";
import { MoneyAmountSchema } from "./shared";

export const DiscountAmountSchema = v.pipe(
  v.string(),
  v.maxLength(4),
  v.regex(
    DISCOUNT_AMOUNT_REGEX,
    "Discount must be between 0.00 and 1.00.",
  ),
);

// Kept as a validated string (like price/discount above) instead of a
// number so the input can reject invalid keystrokes on blur/submit instead
// of silently coercing them to 0.
export const NonNegativeIntegerSchema = v.pipe(  v.string(),
  v.maxLength(9),
  v.regex(NON_NEGATIVE_INTEGER_REGEX, "Quantity must be a whole number of 0 or greater."),
);

export const UpdateItemSchema = v.object({
  itemId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  price: MoneyAmountSchema,
  discount: DiscountAmountSchema,
  quantity: NonNegativeIntegerSchema,
});
