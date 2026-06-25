import {onCall, HttpsError} from "firebase-functions/https";
import {db, requireAdmin} from "../utils/admin";

interface GetOrdersData {
  adminView?: boolean;
  status?: string;
  limitNum?: number;
}

export const getOrders = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const {adminView, status, limitNum} = (request.data as GetOrdersData) || {};

  if (adminView) {
    await requireAdmin(request.auth.uid);
    let query: FirebaseFirestore.Query = db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(limitNum || 100);

    if (status) {
      query = db
        .collection("orders")
        .where("status", "==", status)
        .orderBy("createdAt", "desc")
        .limit(limitNum || 100);
    }

    const snap = await query.get();
    return snap.docs.map((d) => ({id: d.id, ...d.data()}));
  }

  const snap = await db
    .collection("orders")
    .where("userId", "==", request.auth.uid)
    .orderBy("createdAt", "desc")
    .limit(limitNum || 50)
    .get();

  return snap.docs.map((d) => ({id: d.id, ...d.data()}));
});
