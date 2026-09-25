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

const sendToBetterStack = (
  level,
  data,
  message
) => {
  if (!logtail) {
    return;
  }

  try {
    const context = requestContext.getStore();

    const payload = {
      ...(data || {}),

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
  } catch (error) {
    console.error(
      "Better Stack logging error:",
      error
    );
  }
};

export const getLogger = () => {
  const context = requestContext.getStore();

  const logger = context?.requestId
    ? baseLogger.child({
        requestId: context.requestId,
      })
    : baseLogger;

  return {
    debug(data, message) {
      logger.debug(data, message);

      sendToBetterStack(
        "debug",
        data,
        message
      );
    },

    info(data, message) {
      logger.info(data, message);

      sendToBetterStack(
        "info",
        data,
        message
      );
    },

    warn(data, message) {
      logger.warn(data, message);

      sendToBetterStack(
        "warn",
        data,
        message
      );
    },

    error(data, message) {
      logger.error(data, message);

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