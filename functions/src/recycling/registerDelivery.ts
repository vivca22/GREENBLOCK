import {onCall, HttpsError} from "firebase-functions/https";
import {admin, db, authAdmin, requireAdmin} from "../utils/admin";

const DEFAULT_POINTS_PER_GRAM = 10;

interface RegisterDeliveryData {
  studentEmail: string;
  weightGrams: number;
  plasticType: "PET" | "HDPE" | "LDPE" | "PP" | "mixed";
}

export const registerRecyclingDelivery = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  await requireAdmin(request.auth.uid);

  const {studentEmail, weightGrams, plasticType} = request.data as RegisterDeliveryData;

  if (!studentEmail || !weightGrams || weightGrams <= 0) {
    throw new HttpsError("invalid-argument", "Email y peso son requeridos");
  }

  let studentRecord;
  try {
    studentRecord = await authAdmin.getUserByEmail(studentEmail);
  } catch {
    throw new HttpsError("not-found", `No existe un usuario registrado con el email: ${studentEmail}`);
  }

  const studentUid = studentRecord.uid;

  const configDoc = await db.doc("config/app").get();
  const pointsPerGram: number = configDoc.data()?.pointsPerGram ?? DEFAULT_POINTS_PER_GRAM;
  const greenPointsAwarded = Math.floor(weightGrams * pointsPerGram);

  const deliveryRef = db.collection("recyclingDeliveries").doc();

  await db.runTransaction(async (tx) => {
    const studentRef = db.doc(`users/${studentUid}`);
    const studentSnap = await tx.get(studentRef);

    if (!studentSnap.exists) {
      tx.set(studentRef, {
        email: studentEmail,
        greenPoints: greenPointsAwarded,
        recyclingStats: {totalGrams: weightGrams, totalDeliveries: 1},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      tx.update(studentRef, {
        "greenPoints": admin.firestore.FieldValue.increment(greenPointsAwarded),
        "recyclingStats.totalGrams": admin.firestore.FieldValue.increment(weightGrams),
        "recyclingStats.totalDeliveries": admin.firestore.FieldValue.increment(1),
      });
    }

    tx.set(deliveryRef, {
      studentEmail,
      studentUid,
      weightGrams,
      plasticType: plasticType || "mixed",
      greenPointsAwarded,
      txHash: null,
      registeredByAdminUid: request.auth!.uid,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.set(db.collection(`users/${studentUid}/pointsHistory`).doc(), {
      type: "recycling_reward",
      amount: greenPointsAwarded,
      weightGrams,
      plasticType: plasticType || "mixed",
      deliveryId: deliveryRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return {success: true, deliveryId: deliveryRef.id, greenPointsAwarded, studentUid};
});
