import {onRequest} from "firebase-functions/https";

/**
 * Gasta puntos verdes en la tienda
 */
export const spendPoints = onRequest(async (request, response) => {
  // TODO: Implementar lógica de gasto de puntos
  response.json({message: "spendPoints - TODO"});
});
