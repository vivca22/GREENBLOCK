import {onRequest} from "firebase-functions/https";

/**
 * Obtiene las órdenes del usuario
 */
export const getOrders = onRequest(async (request, response) => {
  // TODO: Implementar lógica de obtención de órdenes
  response.json({message: "getOrders - TODO"});
});
