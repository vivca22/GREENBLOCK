import {onRequest} from "firebase-functions/https";

/**
 * Obtiene el historial de transacciones blockchain
 */
export const getHistory = onRequest(async (request, response) => {
  // TODO: Implementar lógica de obtención de historial
  response.json({message: "getHistory - TODO"});
});
