export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  kitName: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  shippingAddress: { fullName: string; city: string; street: string };
  trackingCode: string | null;
  createdAt: { seconds: number } | null;
}
