import {onRequest} from "firebase-functions/https";

/**
 * Obtiene el historial de transacciones de puntos verdes
 */
export const getTransactions = onRequest(async (request, response) => {
  // TODO: Implementar lógica de obtención de transacciones
  response.json({message: "getTransactions - TODO"});
});
