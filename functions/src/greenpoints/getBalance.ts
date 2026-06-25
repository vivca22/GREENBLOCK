import {onCall, HttpsError} from "firebase-functions/https";
import {db} from "../utils/admin";

export const getBalance = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const userSnap = await db.doc(`users/${request.auth.uid}`).get();

  if (!userSnap.exists) {
    return {greenPoints: 0, recyclingStats: {totalGrams: 0, totalDeliveries: 0}};
  }

  const data = userSnap.data()!;
  return {
    greenPoints: data.greenPoints || 0,
    recyclingStats: data.recyclingStats || {totalGrams: 0, totalDeliveries: 0},
  };
});
