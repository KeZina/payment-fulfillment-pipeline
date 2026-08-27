import * as v from "valibot";

export const PositiveIntegerSchema = v.pipe(
  v.number(),
  v.safeInteger(),
  v.minValue(1),
);

export const MONEY_AMOUNT_REGEX = /^\d+\.\d{2}$/;

export const MONEY_AMOUNT_CAPTURE_REGEX = /^(\d+)\.(\d{2})$/;

export const MoneyAmountSchema = v.pipe(
  v.string(),
  v.maxLength(20),
  v.regex(MONEY_AMOUNT_REGEX),
);

export const BasketPriceSchema = v.pipe(
  v.string(),
  v.maxLength(11),
  v.regex(MONEY_AMOUNT_REGEX),
);
