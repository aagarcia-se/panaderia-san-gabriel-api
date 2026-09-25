import pino from "pino";
import { waitUntil } from "@vercel/functions";
import { Logtail } from "@logtail/node";
import observabilityConfig from "../config/observability.config.js";
import requestContext from "../context/requestContext.js";

const isEnabled = observabilityConfig.enabled;

const sourceToken =
  observabilityConfig.betterStack?.sourceToken;

const ingestingHost =
  observabilityConfig.betterStack?.ingestingHost;

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
    application:
      observabilityConfig.application,

    service:
      observabilityConfig.service,

    environment:
      observabilityConfig.environment,
  },

  timestamp:
    pino.stdTimeFunctions.isoTime,
});

/**
 * Envía un log a Better Stack.
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
      application: observabilityConfig.application,
      service: observabilityConfig.service,
      environment: observabilityConfig.environment,
      ...(data || {}),
      ...(context?.requestId ? { requestId: context.requestId } : {}),
    };

    switch (level) {
      case "debug":
        logtail.debug(message, payload);
        break;
      case "warn":
        logtail.warn(message, payload);
        break;
      case "error":
        logtail.error(message, payload);
        break;
      case "info":
      default:
        logtail.info(message, payload);
        break;
    }

    /**
     * En lugar de un fire-and-forget que Vercel puede
     * cortar a mitad de camino, le decimos al runtime
     * que mantenga viva la función hasta que el flush
     * termine, sin bloquear la respuesta al cliente.
     */
    waitUntil(
      logtail.flush().catch((error) => {
        console.error("Better Stack flush error:", error);
      })
    );
  } catch (error) {
    console.error("Better Stack logging error:", error);
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
    debug(data, message) {
      logger.debug(
        data,
        message
      );

      sendToBetterStack(
        "debug",
        data,
        message
      );
    },

    info(data, message) {
      logger.info(
        data,
        message
      );

      sendToBetterStack(
        "info",
        data,
        message
      );
    },

    warn(data, message) {
      logger.warn(
        data,
        message
      );

      sendToBetterStack(
        "warn",
        data,
        message
      );
    },

    error(data, message) {
      logger.error(
        data,
        message
      );

      sendToBetterStack(
        "error",
        data,
        message
      );
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