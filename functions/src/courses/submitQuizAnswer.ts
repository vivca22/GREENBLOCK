import {onRequest} from "firebase-functions/https";

/**
 * Envía respuestas de cuestionarios
 */
export const submitQuizAnswer = onRequest(async (request, response) => {
  // TODO: Implementar lógica de envío de respuestas
  response.json({message: "submitQuizAnswer - TODO"});
});
