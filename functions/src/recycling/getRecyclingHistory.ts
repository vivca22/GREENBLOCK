import {onCall, HttpsError} from "firebase-functions/https";
import {db, requireAdmin} from "../utils/admin";

interface GetHistoryData {
  studentEmail?: string;
  limitNum?: number;
}

export const getRecyclingHistory = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const {studentEmail, limitNum} = (request.data as GetHistoryData) || {};

  await requireAdmin(request.auth.uid);

  let query: FirebaseFirestore.Query = db
    .collection("recyclingDeliveries")
    .orderBy("registeredAt", "desc")
    .limit(limitNum || 50);

  if (studentEmail) {
    query = db
      .collection("recyclingDeliveries")
      .where("studentEmail", "==", studentEmail)
      .orderBy("registeredAt", "desc")
      .limit(limitNum || 50);
  }

  const snap = await query.get();
  return snap.docs.map((d) => ({id: d.id, ...d.data()}));
});
