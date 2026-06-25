import {onCall, HttpsError} from "firebase-functions/https";
import {admin, db} from "../utils/admin";

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  province: string;
  phone: string;
  reference?: string;
}

interface CreateOrderData {
  kitId: string;
  quantity: number;
  shippingAddress: ShippingAddress;
}

export const createOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const {kitId, quantity, shippingAddress} = request.data as CreateOrderData;

  if (!kitId || !quantity || quantity < 1 || !shippingAddress) {
    throw new HttpsError("invalid-argument", "Datos de orden incompletos");
  }

  const kitRef = db.doc(`kits/${kitId}`);
  const orderRef = db.collection("orders").doc();

  await db.runTransaction(async (tx) => {
    const kitSnap = await tx.get(kitRef);
    if (!kitSnap.exists) {
      throw new HttpsError("not-found", "Kit no encontrado");
    }

    const kit = kitSnap.data()!;
    if (!kit.isActive) {
      throw new HttpsError("failed-precondition", "Este kit no está disponible");
    }
    if (kit.stock < quantity) {
      throw new HttpsError("failed-precondition", `Stock insuficiente. Disponible: ${kit.stock}`);
    }

    tx.set(orderRef, {
      userId: request.auth!.uid,
      kitId,
      kitName: kit.name,
      quantity,
      unitPrice: kit.price,
      total: kit.price * quantity,
      shippingAddress,
      status: "pending",
      trackingCode: null,
      trackingUrl: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.update(kitRef, {
      stock: admin.firestore.FieldValue.increment(-quantity),
    });
  });

  return {orderId: orderRef.id};
});
