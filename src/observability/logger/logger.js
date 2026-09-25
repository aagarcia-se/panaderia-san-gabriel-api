import pino from "pino";
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
 * IMPORTANTE:
 * No hacemos flush para logs normales.
 *
 * Esto permite que Logtail agrupe los eventos
 * y reduzca la cantidad de requests hacia Better Stack.
 */
const sendToBetterStack = (
  level,
  data,
  message
) => {
  if (!logtail) {
    return;
  }

  try {
    const context =
      requestContext.getStore();

    const payload = {
      ...(data || {}),

      ...(context?.requestId
        ? {
            requestId:
              context.requestId,
          }
        : {}),
    };

    switch (level) {
      case "debug":
        logtail.debug(
          message,
          payload
        );
        break;

      case "warn":
        logtail.warn(
          message,
          payload
        );
        break;

      case "error":
        logtail.error(
          message,
          payload
        );
        break;

      case "info":
      default:
        logtail.info(
          message,
          payload
        );
        break;
    }

    /**
     * Iniciamos el flush inmediatamente,
     * pero no bloqueamos el request de la API.
     */
    logtail.flush().catch((error) => {
      console.error(
        "Better Stack flush error:",
        error
      );
    });
  } catch (error) {
    /**
     * Un problema de observabilidad nunca
     * debe afectar el funcionamiento de la API.
     */
    console.error(
      "Better Stack logging error:",
      error
    );
  }
};

/**
 * Obtiene el logger correspondiente
 * al request actual.
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
 * necesitamos hacer un flush controlado desde
 * el ciclo de vida de la aplicación.
 */
export { logtail };

export default baseLogger;