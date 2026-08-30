export type HistoryOrderDetailLineItem = {
  id: string;
  itemName: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

export type HistoryOrderDetailProps = {
  id: string;
  status: string;
  totalAmount: string;
  currency: string;
  createdAt: Date;
  recipientName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryInstructions: string;
  lineItems: HistoryOrderDetailLineItem[];
  title?: string;
  backHref?: string;
  backLabel?: string;
};
