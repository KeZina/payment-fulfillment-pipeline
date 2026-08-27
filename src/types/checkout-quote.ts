export type CheckoutQuoteItemSnapshot = {
  id: number;
  name: string;
  salePrice: string;
  quantity: number;
};

export type CheckoutQuoteResult =
  | { success: true; amount: string; items: CheckoutQuoteItemSnapshot[] }
  | { success: false };
