import {onRequest} from "firebase-functions/https";

/**
 * Mejora el avatar del usuario usando puntos
 */
export const upgradeAvatar = onRequest(async (request, response) => {
  // TODO: Implementar lógica de mejora de avatar
  response.json({message: "upgradeAvatar - TODO"});
});
