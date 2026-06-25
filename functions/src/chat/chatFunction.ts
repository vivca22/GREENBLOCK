import {onRequest} from "firebase-functions/https";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import {GREENBOT_SYSTEM_PROMPT} from "../utils/constants";

const openRouterKey = defineSecret("OPENROUTER_API_KEY");
const corsHandler = cors({origin: true});

export const chat = onRequest({secrets: [openRouterKey]}, (request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).json({error: "Method Not Allowed"});
      return;
    }

    const apiKey = openRouterKey.value();
    if (!apiKey) {
      logger.error("API key not configured");
      response.status(500).json({error: "API key not configured"});
      return;
    }

    const {message, kitType} = request.body;

    if (!message) {
      response.status(400).json({error: "Message is required"});
      return;
    }

    const systemPrompt = kitType ?
      `${GREENBOT_SYSTEM_PROMPT}\n\nKit del usuario: ${kitType}` :
      GREENBOT_SYSTEM_PROMPT;

    try {
      const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://green-block-ec.netlify.app",
          "X-Title": "GREENBLOCK GreenBot",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: message},
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        logger.error("OpenRouter error:", data);
        response.status(apiResponse.status).json({
          error: data.error?.message || "OpenRouter error",
        });
        return;
      }

      const reply = data.choices?.[0]?.message?.content ||
        "No pude generar una respuesta. Intenta de nuevo.";
      response.status(200).json({reply});
    } catch (err) {
      logger.error("Chat function error:", err);
      response.status(500).json({error: "Internal server error"});
    }
  });
});
