import {onCall, HttpsError} from "firebase-functions/https";
import {admin, db, requireAdmin} from "../utils/admin";

interface UpdateOrderData {
  orderId: string;
  status: "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingCode?: string;
  trackingUrl?: string;
}

export const updateOrderStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  await requireAdmin(request.auth.uid);

  const {orderId, status, trackingCode, trackingUrl} = request.data as UpdateOrderData;

  if (!orderId || !status) {
    throw new HttpsError("invalid-argument", "orderId y status son requeridos");
  }

  const orderRef = db.doc(`orders/${orderId}`);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) {
    throw new HttpsError("not-found", "Orden no encontrada");
  }

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  if (trackingCode) updateData.trackingCode = trackingCode;
  if (trackingUrl) updateData.trackingUrl = trackingUrl;

  await orderRef.update(updateData);
  return {success: true};
});
