import {onRequest} from "firebase-functions/https";

/**
 * Registra la degradación de plástico en blockchain
 */
export const registerDegradation = onRequest(async (request, response) => {
  // TODO: Implementar lógica de registro de degradación
  response.json({message: "registerDegradation - TODO"});
});
