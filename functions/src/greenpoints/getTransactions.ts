import {onCall, HttpsError} from "firebase-functions/https";
import {db} from "../utils/admin";

interface GetTransactionsData {
  limitNum?: number;
}

export const getTransactions = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const {limitNum} = (request.data as GetTransactionsData) || {};

  const snap = await db
    .collection(`users/${request.auth.uid}/pointsHistory`)
    .orderBy("createdAt", "desc")
    .limit(limitNum || 30)
    .get();

  return snap.docs.map((d) => ({id: d.id, ...d.data()}));
});
