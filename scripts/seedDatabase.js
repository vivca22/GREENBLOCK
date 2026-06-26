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

async function clearCollection(collectionName) {
  const snap = await db.collection(collectionName).get();
  if (snap.empty) { console.log(`   ⚪ ${collectionName}: vacía`); return; }
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`   🗑️  ${collectionName}: ${snap.size} documentos eliminados`);
}

async function seed() {
  console.log("🌱 Iniciando seed de GREENBLOCK...\n");

  // LIMPIAR COLECCIONES
  console.log("🧹 Limpiando colecciones...");
  await clearCollection("kits");
  await clearCollection("shopItems");
  await clearCollection("courses");
  console.log();

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
  const courses = [
    {
      title: "El hongo y el plástico",
      description: "Aprende cómo los hongos ostra descomponen el plástico a nivel molecular.",
      category: "fungi",
      color: "#D8F3DC",
      order: 1,
      isPublished: true,
      completionBonus: 50,
      lessons: [
        {
          id: "l1-1", order: 1, videoUrl: null,
          title: "El micelio: la red invisible",
          content: [
            "El micelio es la parte vegetativa del hongo — una red de hilos microscópicos llamados hifas que se extienden por el sustrato buscando nutrientes. A diferencia del cuerpo fructífero (el hongo que vemos), el micelio permanece oculto, trabajando silenciosamente.",
            "Cuando el micelio entra en contacto con el plástico, las hifas secretan enzimas especiales —sobre todo lacasas y peroxidasas— que atacan los polímeros del plástico. Este proceso puede reducir el peso del PET hasta un 30% en pocas semanas.",
          ],
        },
        {
          id: "l1-2", order: 2, videoUrl: null,
          title: "Lacasas: las tijeras moleculares",
          content: [
            "Las lacasas son enzimas oxidativas producidas naturalmente por el Pleurotus ostreatus (hongo ostra). Su función en la naturaleza es degradar la lignina de la madera, pero resultan igualmente eficaces contra los polímeros sintéticos.",
            "Estas enzimas actúan cortando los enlaces C–O del PET y otros plásticos, fragmentando cadenas largas de polímeros en moléculas más pequeñas y eventualmente asimilables. El proceso se acelera con temperatura cálida (22–28°C) y humedad alta.",
          ],
        },
        {
          id: "l1-3", order: 3, videoUrl: null,
          title: "El resultado final",
          content: [
            "Después de 4–8 semanas, el plástico tratado con micelio presenta cambios visibles: se vuelve poroso, frágil y de color grisáceo. Su peso puede reducirse un 20–35%. Los fragmentos resultantes son transformados en CO₂ y agua, completando el ciclo.",
            "Es importante destacar que este proceso es seguro: los cuerpos fructíferos (los hongos comestibles) no acumulan los subproductos del plástico. El micelio actúa como barrera, dejando a las setas limpias y nutritivas para el consumo humano.",
          ],
        },
      ],
      quiz: {
        question: "¿Cómo se llama el proceso donde los hongos descomponen materiales contaminantes?",
        options: ["Fotosíntesis", "Micorremediación", "Biogénesis", "Fermentación"],
        correctIndex: 1,
        points: 20,
      },
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "¿Qué es la micorremediación?",
      description: "Explora la ciencia de usar hongos para limpiar contaminantes del ambiente.",
      category: "fungi",
      color: "#DBEAFE",
      order: 2,
      isPublished: true,
      completionBonus: 50,
      lessons: [
        {
          id: "l2-1", order: 1, videoUrl: null,
          title: "Historia de la micorremediación",
          content: [
            "El término 'micorremediación' fue acuñado por el micólogo Paul Stamets en la década de 1990. Stamets documentó cómo diversas especies de hongos podían degradar contaminantes del suelo, incluyendo hidrocarburos del petróleo y pesticidas.",
            "Desde entonces, investigaciones en universidades de todo el mundo han confirmado la capacidad de hongos como Pleurotus ostreatus, Trametes versicolor y Ganoderma lucidum para biodegradar una amplia gama de materiales, desde plásticos hasta metales pesados.",
          ],
        },
        {
          id: "l2-2", order: 2, videoUrl: null,
          title: "Tipos de hongos biorremediadores",
          content: [
            "No todos los hongos tienen la misma capacidad de degradación. Los hongos de podredumbre blanca (white-rot fungi), como el hongo ostra, son los más eficaces porque producen las concentraciones más altas de lacasas y peroxidasas ligninolíticas.",
            "El Pleurotus ostreatus es especialmente versátil: crece en una amplia gama de sustratos, tolera variaciones de temperatura, y produce altos rendimientos de enzimas degradadoras. Por estas razones, es el hongo estrella de Green Block.",
          ],
        },
        {
          id: "l2-3", order: 3, videoUrl: null,
          title: "Aplicaciones globales",
          content: [
            "La micorremediación ya se usa a escala industrial en varios países. En Holanda, hongos de podredumbre blanca se usan para limpiar suelos contaminados con PAHs (hidrocarburos poliaromáticos). En Colombia, equipos universitarios están probando Pleurotus para degradar plásticos de río.",
            "El futuro de la micorremediación incluye hongos genéticamente mejorados con mayor producción enzimática, sistemas de biorreactores para plástico reciclado, y kits domésticos como Green Block para involucrar a ciudadanos de todas las edades.",
          ],
        },
      ],
      quiz: {
        question: "¿Qué tipo de hongos son más efectivos para la biorremediación de plásticos?",
        options: ["Hongos de podredumbre marrón", "Levaduras", "Hongos de podredumbre blanca", "Moho negro"],
        correctIndex: 2,
        points: 20,
      },
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "Cómo cuidar tu kit",
      description: "Guía completa para maximizar el crecimiento y la degradación de plástico.",
      category: "care",
      color: "#FEF3C7",
      order: 3,
      isPublished: true,
      completionBonus: 40,
      lessons: [
        {
          id: "l3-1", order: 1, videoUrl: null,
          title: "Condiciones ideales",
          content: [
            "Para un crecimiento óptimo, mantén tu kit en un lugar con temperatura estable entre 18–24°C. Evita corrientes de aire frío o calor directo. La luz indirecta es perfecta — no es necesaria la luz solar directa, pero tampoco la oscuridad total.",
            "La humedad es crucial. Durante la fase de colonización (bag cerrada), el sustrato ya contiene suficiente humedad. Durante la fructificación, rocía el interior de la apertura con agua limpia 2–3 veces al día. El objetivo es mantener las superficies ligeramente húmedas.",
          ],
        },
        {
          id: "l3-2", order: 2, videoUrl: null,
          title: "Solución de problemas",
          content: [
            "Contaminación: Si ves manchas verdes, negras o rosadas en el sustrato, indica hongos competidores (Trichoderma, Penicillium). Actúa rápido: aísla el kit en una bolsa hermética y deséchalo. No intentes eliminar el moho con vinagre — la cepa está perdida.",
            "Micelio lento: Si después de 14 días no ves micelio blanco, revisa temperatura y humedad. Si el kit está muy seco, agrega 30ml de agua estéril en los bordes del sustrato. Si la temperatura es menor a 15°C, mueve el kit a un lugar más cálido.",
          ],
        },
      ],
      quiz: {
        question: "¿Qué temperatura es ideal para el crecimiento óptimo del micelio?",
        options: ["5–10°C", "18–24°C", "30–35°C", "40–45°C"],
        correctIndex: 1,
        points: 15,
      },
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "El plástico en el océano",
      description: "Descubre el impacto global del plástico marino y cómo los hongos pueden ayudar.",
      category: "environment",
      color: "#E0F2FE",
      order: 4,
      isPublished: true,
      completionBonus: 60,
      lessons: [
        {
          id: "l4-1", order: 1, videoUrl: null,
          title: "La magnitud del problema",
          content: [
            "Cada año se producen alrededor de 400 millones de toneladas de plástico en el mundo. De estas, se estima que entre 8 y 12 millones de toneladas terminan en los océanos, creando lo que los científicos llaman 'islas de basura' — masas flotantes de plástico fragmentado.",
            "El plástico marino no desaparece: se fragmenta en microplásticos (partículas menores a 5mm) que son ingeridos por peces, aves marinas y otros organismos. Estos microplásticos ya han sido encontrados en el agua potable y en la sangre humana.",
          ],
        },
        {
          id: "l4-2", order: 2, videoUrl: null,
          title: "El rol de los hongos marinos",
          content: [
            "Investigadores de la Universidad de Utrecht descubrieron en 2021 que hongos del género Pestalotiopsis pueden crecer sobre superficies plásticas sumergidas en agua de mar, degradando el PET incluso sin oxígeno. Este hallazgo abre posibilidades para la remediación de fondos oceánicos.",
            "El desafío es escalar esta tecnología. Green Block trabaja en la educación comunitaria como primer paso: si reducimos el plástico que llega al océano desde tierra, los hongos pueden concentrarse en la remediación del plástico ya existente. Cada kit que usas es parte de la solución.",
          ],
        },
        {
          id: "l4-3", order: 3, videoUrl: null,
          title: "Qué puedes hacer tú",
          content: [
            "La acción individual importa. Usar tu kit Green Block reduce el plástico que va al relleno sanitario o al ambiente. Al entregar tu plástico en los puntos de recolección, contribuyes directamente a que ese material sea procesado con micelio en lugar de tardar siglos en degradarse.",
            "Comparte tu progreso, invita a amigos, participa en recolecciones. Cada gramo de plástico que rescatas del ambiente antes de que llegue al mar es una pequeña victoria. Juntos, los usuarios de Green Block en Ecuador podemos hacer una diferencia medible.",
          ],
        },
      ],
      quiz: {
        question: "¿Cuánto tiempo tarda en degradarse una botella de PET en el océano sin intervención?",
        options: ["10 años", "50 años", "450 años", "Solo 1 año"],
        correctIndex: 2,
        points: 25,
      },
      createdAt: FieldValue.serverTimestamp(),
    },
  ];

  for (const course of courses) {
    const ref = await db.collection("courses").add(course);
    console.log(`✅ Curso: "${course.title}" [${ref.id}] (${course.lessons.length} lecciones)`);
  }
  console.log();

  console.log("🎉 Seed completado!");
  console.log(`   Admin configurado: ${ADMIN_EMAIL}\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
