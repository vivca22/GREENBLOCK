import {onRequest} from "firebase-functions/https";

/**
 * Genera un código de referencia único
 */
export const generateReferralCode = onRequest(async (request, response) => {
  // TODO: Implementar lógica de generación de código
  response.json({message: "generateReferralCode - TODO"});
});
