const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatBasketPrice = (price: number | string) =>
  currencyFormatter.format(Number(price));
