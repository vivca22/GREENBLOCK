import {onRequest} from "firebase-functions/https";

/**
 * Despliega un contrato inteligente en blockchain
 */
export const deployContract = onRequest(async (request, response) => {
  // TODO: Implementar lógica de despliegue de contrato
  response.json({message: "deployContract - TODO"});
});
