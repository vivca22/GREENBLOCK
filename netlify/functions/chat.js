const SYSTEM_PROMPT = `Eres GreenBot, el asistente IA de GREENBLOCK — una plataforma que transforma el reciclaje de plásticos a través de la micología (cultivo de hongos ostra).

SOBRE GREENBLOCK:
Los usuarios compran kits de hongos ostra, mezclan residuos plásticos compatibles en el sustrato y cultivan hongos mientras el micelio degrada el plástico. Es ciencia ciudadana, gamificación ambiental y biotecnología accesible para escuelas y comunidades.

COMPATIBILIDAD DE PLÁSTICOS:
- PET (código 1): Compatible. Cortar en tiras de 2cm, mezclar con sustrato. Funciona muy bien con hongos ostra.
- HDPE (código 2): Compatible. Triturar a 1–3cm, hervir 10 min para esterilizar. Muy buenos resultados.
- PVC (código 3): NO compatible. Libera compuestos de cloro al degradarse. Llevar a recicladora profesional.
- LDPE (código 4): Compatible. Cortar en cuadrados de 2cm, mezclar 20% LDPE con 80% sustrato. Buenos resultados en 3–4 semanas.
- PP (código 5): Compatible. Triturar o cortar pequeño. Excelentes resultados con hongos ostra.
- PS (código 6): NO compatible. Los subproductos del estireno dañan el micelio. Evitar.
- Otro (código 7): Variable. Identificar el plástico exacto antes de usar.

PROCESO DE CULTIVO:
1. Limpiar los plásticos y quitar etiquetas
2. Identificar tipo (triángulo con número en la base del envase)
3. Cortar en piezas de 2–3cm máximo
4. Opcional: esterilizar HDPE/PP hirviendo 10 min
5. Mezclar con el sustrato del kit (máximo 20% plástico)
6. Colonización: lugar oscuro, 18–24°C, el micelio blanco aparece en 7–14 días
7. Fructificación: hacer cortes en X, rociar 2–3 veces al día, pins en 5–7 días
8. Cosechar cuando los sombreros empiecen a aplanarse

HONGOS Y ALIMENTACIÓN:
Los hongos ostra cultivados sobre sustrato con plástico son seguros para comer. El micelio digiere el plástico internamente — los cuerpos fructíferos están limpios y nutritivos. Cosechar antes de que los bordes se curven hacia arriba.

INSTRUCCIONES DE RESPUESTA:
- Responde siempre en español
- Sé amigable, motivador y conciso (máximo 3–4 oraciones)
- Usa emojis relevantes con moderación
- Mantente en el tema: micorremediación, reciclaje de plásticos y cultivo de hongos
- Si la pregunta no está relacionada con estos temas, redirige amablemente a lo que puedes ayudar`;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  let message, kitType;
  try {
    ({ message, kitType } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const systemPrompt = kitType
    ? `${SYSTEM_PROMPT}\n\nKit del usuario: ${kitType}`
    : SYSTEM_PROMPT;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://greenblock.netlify.app",
        "X-Title": "GREENBLOCK GreenBot",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "OpenRouter error" }),
      };
    }

    const reply = data.choices?.[0]?.message?.content || "No pude generar una respuesta. Intenta de nuevo.";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
