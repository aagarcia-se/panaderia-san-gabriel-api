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

const logtail = hasBetterStack
  ? new Logtail(sourceToken, {
      endpoint: `https://${ingestingHost}`,
    })
  : null;

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
 * Envía el log a Better Stack.
 *
 * En Vercel hacemos flush después de cada evento para asegurarnos
 * de que el proceso serverless no termine antes de enviar el log.
 */
const sendToBetterStack = async (
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

    await logtail.flush();
  } catch (error) {
    /**
     * Nunca debemos permitir que un problema de observabilidad
     * afecte el funcionamiento normal de la API.
     */
    console.error(
      "Better Stack logging error:",
      error
    );
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

export { logtail };

export default baseLogger;