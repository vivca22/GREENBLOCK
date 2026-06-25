import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const callRegisterRecyclingDelivery = httpsCallable<
  { studentEmail: string; weightGrams: number; plasticType: string },
  { success: boolean; deliveryId: string; greenPointsAwarded: number }
>(functions, "registerRecyclingDelivery");

export const callGetRecyclingHistory = httpsCallable<
  { studentEmail?: string; limitNum?: number },
  Array<Record<string, unknown>>
>(functions, "getRecyclingHistory");

export const callCreateOrder = httpsCallable<
  { kitId: string; quantity: number; shippingAddress: Record<string, string> },
  { orderId: string }
>(functions, "createOrder");

export const callGetOrders = httpsCallable<
  { adminView?: boolean; status?: string; limitNum?: number },
  Array<Record<string, unknown>>
>(functions, "getOrders");

export const callUpdateOrderStatus = httpsCallable<
  { orderId: string; status: string; trackingCode?: string; trackingUrl?: string },
  { success: boolean }
>(functions, "updateOrderStatus");

export const callGetBalance = httpsCallable<
  Record<string, never>,
  { greenPoints: number; recyclingStats: { totalGrams: number; totalDeliveries: number } }
>(functions, "getBalance");

export const callGetTransactions = httpsCallable<
  { limitNum?: number },
  Array<Record<string, unknown>>
>(functions, "getTransactions");
