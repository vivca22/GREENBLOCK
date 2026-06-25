import * as admin from "firebase-admin";
import {HttpsError} from "firebase-functions/https";

if (!admin.apps.length) {
  admin.initializeApp();
}

export {admin};
export const db = admin.firestore();
export const authAdmin = admin.auth();

export async function requireAdmin(uid: string): Promise<void> {
  const [configDoc, userRecord] = await Promise.all([
    db.doc("config/app").get(),
    authAdmin.getUser(uid),
  ]);
  const adminEmails = (configDoc.data()?.adminEmails as string[]) || [];
  if (!adminEmails.includes(userRecord.email || "")) {
    throw new HttpsError("permission-denied", "Solo administradores pueden realizar esta acción");
  }
}
