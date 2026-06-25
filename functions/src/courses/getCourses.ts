import {onRequest} from "firebase-functions/https";

/**
 * Obtiene los cursos disponibles
 */
export const getCourses = onRequest(async (request, response) => {
  // TODO: Implementar lógica de obtención de cursos
  response.json({message: "getCourses - TODO"});
});
