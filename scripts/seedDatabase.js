import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ──────────────────────────────────────────────
// CONFIGURA TU EMAIL DE ADMIN AQUÍ:
const ADMIN_EMAIL = "jorge.perez01epn@gmail.com";
// ──────────────────────────────────────────────

async function seed() {
  console.log("🌱 Iniciando seed de GREENBLOCK...\n");

  // CONFIG
  await db.doc("config/app").set({
    adminEmails: [ADMIN_EMAIL],
    pointsPerGram: 10,
    referralReward: 200,
    version: "1.0.0",
    maintenanceMode: false,
  });
  console.log("✅ config/app creado");
  console.log(`   └─ adminEmails: [${ADMIN_EMAIL}]`);
  console.log("   └─ pointsPerGram: 10 (1g = 10 GreenPoints)\n");

  // KITS
  const kits = [
    {
      name: "Kit de Inicio Completo",
      description: "Kit completo con todo lo necesario para empezar a cultivar hongos degradadores de plásticos. Incluye micelio, sustrato, nutrientes y guía paso a paso.",
      price: 35,
      stock: 10,
      category: "kits",
      fungiType: "Pleurotus ostreatus",
      tags: ["Degrada PET", "Comestible", "Principiantes"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Kit Hongo Ostra 500g",
      description: "Micelio de Pleurotus ostreatus sobre sustrato inoculado. Degrada PET, HDPE y PP.",
      price: 8,
      stock: 10,
      category: "kits",
      fungiType: "Pleurotus ostreatus",
      tags: ["Degrada PET", "Comestible", "Principiantes"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Kit Hongo Ostra Rosa 250g",
      description: "Variedad rosa con alta producción de lacasas. Ideal para plásticos LDPE y bolsas.",
      price: 5,
      stock: 10,
      category: "kits",
      fungiType: "Pleurotus djamor",
      tags: ["Degrada LDPE", "Comestible", "Color vibrante"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Kit Lion's Mane 500g",
      description: "Hericium erinaceus. Alta concentración enzimática para PP y LDPE. Muy cotizado.",
      price: 10,
      stock: 5,
      category: "kits",
      fungiType: "Hericium erinaceus",
      tags: ["Degrada PP", "Gourmet", "Alta potencia"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Sustrato Premium 2kg",
      description: "Mezcla pasteurizada de aserrín, salvado de trigo y perlita.",
      price: 5,
      stock: 20,
      category: "nutrients",
      fungiType: null,
      tags: ["2 kg", "Pasteurizado", "Bolsa sellada"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Suplemento de Crecimiento 500ml",
      description: "Solución líquida con aminoácidos y minerales. Dilución 1:50 en agua de riego.",
      price: 10,
      stock: 15,
      category: "nutrients",
      fungiType: null,
      tags: ["500 ml", "Dilución 1:50", "Acelera x1.5"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Abono micológico 250g",
      description: "Abono orgánico rico en nitrógeno y fósforo. Mejora la colonización del micelio.",
      price: 10,
      stock: 15,
      category: "nutrients",
      fungiType: null,
      tags: ["250 g", "Orgánico", "Mejora colonización"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      name: "Termómetro-Higrómetro Digital",
      description: "Monitor LCD de temperatura y HR con alarma configurable. Batería incluida.",
      price: 25,
      stock: 12,
      category: "materials",
      fungiType: null,
      tags: ["-10 a 60°C", "HR 0-99%", "Alarma"],
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
  ];

  for (const kit of kits) {
    const ref = await db.collection("kits").add(kit);
    console.log(`✅ Kit: ${kit.name} [${ref.id}]`);
  }
  console.log();

  // SHOP ITEMS
  const shopItems = [
    { name: "Sombrero de esporas", description: "Un sombrero mágico para tu hongo", cost: 100, type: "hat", avatarLevel: 1, isActive: true, order: 1 },
    { name: "Aura verde", description: "Efecto visual especial de nivel 2", cost: 300, type: "effect", avatarLevel: 2, isActive: true, order: 2 },
    { name: "Fondo selva tropical", description: "Background exclusivo para tu avatar", cost: 500, type: "background", avatarLevel: 3, isActive: true, order: 3 },
  ];

  for (const item of shopItems) {
    const ref = await db.collection("shopItems").add(item);
    console.log(`✅ ShopItem: ${item.name} [${ref.id}]`);
  }
  console.log();

  // CURSOS
  const courseRef = await db.collection("courses").add({
    title: "¿Qué son los hongos degradadores?",
    description: "Introducción a la micología y degradación de plásticos",
    category: "fungi",
    completionBonus: 500,
    totalQuestions: 1,
    isPublished: true,
    order: 1,
    lessons: [
      { id: "l1", title: "Introducción a la micología", content: "Los hongos son organismos únicos...", videoUrl: null, order: 1 },
      { id: "l2", title: "Degradación de plásticos", content: "El proceso de micorremediación...", videoUrl: null, order: 2 },
    ],
    createdAt: FieldValue.serverTimestamp(),
  });
  await courseRef.collection("questions").add({
    lessonId: "l1",
    question: "¿Cuál hongo es más eficiente degradando PET?",
    options: ["Aspergillus niger", "Pleurotus ostreatus", "Agaricus bisporus", "Candida tropicalis"],
    correctAnswer: "Pleurotus ostreatus",
    pointsReward: 50,
    order: 1,
  });
  console.log(`✅ Curso: ${courseRef.id} (con 1 pregunta)\n`);

  console.log("🎉 Seed completado!\n");
  console.log("⚠️  IMPORTANTE: Cambia ADMIN_EMAIL en este script por tu email real antes de correrlo.");
  console.log("   El email debe ser el mismo con el que haces login con Google en la app.\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
