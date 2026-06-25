import {onRequest} from "firebase-functions/https";

/**
 * Crea una nueva orden de kit de hongos
 */
export const createOrder = onRequest(async (request, response) => {
  // TODO: Implementar lógica de creación de orden
  response.json({message: "createOrder - TODO"});
});
