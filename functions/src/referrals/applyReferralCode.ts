import {onRequest} from "firebase-functions/https";

/**
 * Aplica un código de referencia al usuario
 */
export const applyReferralCode = onRequest(async (request, response) => {
  // TODO: Implementar lógica de aplicación de código
  response.json({message: "applyReferralCode - TODO"});
});
