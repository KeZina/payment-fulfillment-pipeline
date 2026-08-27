import "server-only";

import { CENTS_PER_UNIT } from "@/constants/money";
import { MONEY_AMOUNT_CAPTURE_REGEX } from "@/schemas/shared";

export function priceToCents(price: string) {
  const match = MONEY_AMOUNT_CAPTURE_REGEX.exec(price);

  if (!match) {
    return null;
  }

  const [, whole, fraction] = match;

  return BigInt(whole) * CENTS_PER_UNIT + BigInt(fraction);
}

export function formatCents(cents: bigint) {
  const whole = cents / CENTS_PER_UNIT;
  const fraction = (cents % CENTS_PER_UNIT).toString().padStart(2, "0");

  return `${whole}.${fraction}`;
}
