import { waitUntil } from "@vercel/functions";
import { flushLogs } from "../observability/logger/logger.js";


/**
 * Middleware que garantiza un único flush
 * hacia Better Stack por cada request.
 *
 * Se apoya en waitUntil para que el envío
 * ocurra en segundo plano, sin bloquear la
 * respuesta al cliente, pero sin que Vercel
 * congele el contenedor antes de que termine.
 *
 * Debe registrarse temprano en la cadena de
 * middlewares (antes de las rutas), junto al
 * middleware que arma el requestContext.
 */
export const flushLogsMiddleware = (req, res, next) => {
  res.on("finish", () => {
    waitUntil(flushLogs());
  });

  next();
};