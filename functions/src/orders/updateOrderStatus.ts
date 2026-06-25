import {onRequest} from "firebase-functions/https";

/**
 * Actualiza el estado de una orden
 */
export const updateOrderStatus = onRequest(async (request, response) => {
  // TODO: Implementar lógica de actualización de estado
  response.json({message: "updateOrderStatus - TODO"});
});
