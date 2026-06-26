import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function backfill() {
  console.log("♻️  Backfill de leaderboard desde colección users...\n");

  const usersSnap = await db.collection("users").get();
  console.log(`   ${usersSnap.size} usuarios encontrados`);

  let written = 0;
  let skipped = 0;

  const batch = db.batch();

  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data();
    const totalGrams = data.recyclingStats?.totalGrams || 0;
    const totalDeliveries = data.recyclingStats?.totalDeliveries || 0;

    if (totalGrams <= 0) {
      skipped++;
      continue;
    }

    const name = data.name || data.email?.split("@")[0] || "Usuario";
    const photo = data.photo || "";

    batch.set(
      db.doc(`leaderboard/${userDoc.id}`),
      {
        name,
        photo,
        totalGrams,
        totalDeliveries,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`   ✅ ${name} — ${totalGrams}g (${totalDeliveries} entrega${totalDeliveries !== 1 ? "s" : ""})`);
    written++;
  }

  if (written === 0) {
    console.log("\n   ⚠️  Ningún usuario tiene reciclajes registrados aún.");
    return;
  }

  await batch.commit();
  console.log(`\n✅ Leaderboard actualizado: ${written} entrada${written !== 1 ? "s" : ""} escritas, ${skipped} usuarios sin reciclajes omitidos.`);
}

backfill().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
