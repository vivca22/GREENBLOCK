import {onRequest} from "firebase-functions/https";

/**
 * Marca un curso como completado
 */
export const completeCourse = onRequest(async (request, response) => {
  // TODO: Implementar lógica de completar curso
  response.json({message: "completeCourse - TODO"});
});
