import {onRequest} from "firebase-functions/https";

/**
 * Obtiene el saldo de puntos verdes del usuario
 */
export const getBalance = onRequest(async (request, response) => {
  // TODO: Implementar lógica de obtención de balance
  response.json({message: "getBalance - TODO"});
});
