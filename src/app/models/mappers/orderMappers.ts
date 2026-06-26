import type { Order } from "../order.model";

export function isOrderStatus(value: unknown): value is Order["status"] {
  return value === "pending" || value === "confirmed" || value === "shipped" || value === "delivered" || value === "cancelled";
}

export function toOrder(raw: Record<string, unknown>): Order | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const userId = typeof raw.userId === "string" ? raw.userId : "";
  const kitName = typeof raw.kitName === "string" ? raw.kitName : "";
  const quantity = typeof raw.quantity === "number" ? raw.quantity : 0;
  const total = typeof raw.total === "number" ? raw.total : 0;
  const status = isOrderStatus(raw.status) ? raw.status : "pending";
  const trackingCode = typeof raw.trackingCode === "string" ? raw.trackingCode : null;

  if (!id || !userId || !kitName) return null;

  const shippingAddressRaw = raw.shippingAddress;
  const shippingAddress = (
    shippingAddressRaw && typeof shippingAddressRaw === "object"
      ? {
          fullName: typeof (shippingAddressRaw as Record<string, unknown>).fullName === "string" ? (shippingAddressRaw as Record<string, unknown>).fullName as string : "",
          city: typeof (shippingAddressRaw as Record<string, unknown>).city === "string" ? (shippingAddressRaw as Record<string, unknown>).city as string : "",
          street: typeof (shippingAddressRaw as Record<string, unknown>).street === "string" ? (shippingAddressRaw as Record<string, unknown>).street as string : "",
        }
      : { fullName: "", city: "", street: "" }
  );

  const createdAtRaw = raw.createdAt;
  const createdAt = (
    createdAtRaw &&
    typeof createdAtRaw === "object" &&
    typeof (createdAtRaw as Record<string, unknown>).seconds === "number"
      ? { seconds: (createdAtRaw as Record<string, unknown>).seconds as number }
      : null
  );

  return { id, userId, kitName, quantity, total, status, shippingAddress, trackingCode, createdAt };
}

export function parseOrders(data: Record<string, unknown>[]): Order[] {
  return data
    .map((item) => toOrder(item))
    .filter((item): item is Order => item !== null);
}
