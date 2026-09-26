import pino from "pino";
import { Logtail } from "@logtail/node";
import observabilityConfig from "../config/observability.config.js";
import requestContext from "../context/requestContext.js";

const isEnabled = observabilityConfig.enabled;

const sourceToken = observabilityConfig.betterStack?.sourceToken;

const ingestingHost = observabilityConfig.betterStack?.ingestingHost;

const hasBetterStack =
  isEnabled &&
  Boolean(sourceToken) &&
  Boolean(ingestingHost);

/**
 * Cliente de Better Stack.
 *
 * Se crea una sola instancia para reutilizarla
 * durante la vida de la ejecución.
 */
const logtail = hasBetterStack
  ? new Logtail(sourceToken, {
    endpoint: `https://${ingestingHost}`,
  })
  : null;

/**
 * Logger local con Pino.
 *
 * Estos campos aparecen automáticamente
 * en los logs de Vercel.
 */
const baseLogger = pino({
  level: observabilityConfig.logLevel,
  base: {
    application: observabilityConfig.application,
    service: observabilityConfig.service,
    environment: observabilityConfig.environment,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Encola un log en Better Stack.
 *
 * IMPORTANTE: esto ya NO envía el log de inmediato.
 * Solo lo agrega a la cola interna de @logtail/node.
 * El envío real ocurre una sola vez por request,
 * mediante flushLogs(), llamado desde el middleware
 * flushLogs.middleware.js cuando la respuesta termina.
 *
 * Los campos application, service y environment
 * se agregan explícitamente porque este log
 * se envía directamente mediante @logtail/node
 * y no pasa por Pino.
 */
const sendToBetterStack = (level, data, message) => {
  if (!logtail) {
    return;
  }

  try {
    const context = requestContext.getStore();

    const payload = {
      /**
       * Información general de la aplicación.
       */
      application: observabilityConfig.application,
      service: observabilityConfig.service,
      environment: observabilityConfig.environment,

      /**
       * Información específica del evento.
       */
      ...(data || {}),

      /**
       * requestId del request actual.
       *
       * Se agrega al final para garantizar
       * que el contexto actual tenga prioridad.
       */
      ...(context?.requestId
        ? {
          requestId: context.requestId,
        }
        : {}),
    };

    switch (level) {
      case "debug":
        logtail.debug(message, payload);
        break;

      case "warn":
        logtail.warn(message, (payload));
        break;

      case "error":
        logtail.error(message, payload);
        break;

      case "info":
      default:
        logtail.info(message, payload);
        break;
    }
  } catch (error) {
    /**
     * La observabilidad nunca debe provocar
     * un fallo en nuestra API.
     */
    console.error("Better Stack logging error:", error);
  }
};

/**
 * Envía a Better Stack todo lo que se haya
 * encolado durante el request actual.
 *
 * Se llama UNA SOLA VEZ por request, desde
 * flushLogs.middleware.js, envuelto en waitUntil
 * para no bloquear la respuesta y a la vez
 * garantizar que el contenedor no se congele
 * antes de que el envío termine.
 */
export const flushLogs = async () => {
  if (!logtail) {
    return;
  }

  try {
    await logtail.flush();
  } catch (error) {
    console.error("Better Stack flush error:", error);
  }
};

/**
 * Obtiene un logger asociado al request actual.
 *
 * Si existe requestId en AsyncLocalStorage,
 * Pino crea un child logger con ese requestId.
 */
export const getLogger = () => {
  const context =
    requestContext.getStore();

  const logger =
    context?.requestId
      ? baseLogger.child({
          requestId:
            context.requestId,
        })
      : baseLogger;

  return {
    debug(data, message, options = {}) {
      logger.debug(data, message);

      if (!options.skipRemote) {
        sendToBetterStack(
          "debug",
          data,
          message
        );
      }
    },

    info(data, message, options = {}) {
      logger.info(data, message);

      if (!options.skipRemote) {
        sendToBetterStack(
          "info",
          data,
          message
        );
      }
    },

    warn(data, message, options = {}) {
      logger.warn(data, message);

      if (!options.skipRemote) {
        sendToBetterStack(
          "warn",
          data,
          message
        );
      }
    },

    error(data, message, options = {}) {
      logger.error(data, message);

      if (!options.skipRemote) {
        sendToBetterStack(
          "error",
          data,
          message
        );
      }
    },
  };
};

/**
 * Exportamos el cliente por si posteriormente
 * necesitamos realizar un flush controlado
 * desde otro punto de la aplicación.
 */
export { logtail };

export default baseLogger;