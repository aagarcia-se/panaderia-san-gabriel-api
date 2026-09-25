import pino from "pino";

import config from "../config/observability.config.js";
import requestContext from "../context/requestContext.js";

const isProduction =
  config.environment === "production";

const hasBetterStack =
  isProduction &&
  Boolean(process.env.BETTER_STACK_SOURCE_TOKEN) &&
  Boolean(process.env.BETTER_STACK_INGESTING_HOST);

const targets = [
  {
    target: "pino/file",
    level: config.logLevel,
    options: {
      destination: 1,
    },
  },
];

if (hasBetterStack) {
  targets.push({
    target: "@logtail/pino",
    level: config.logLevel,
    options: {
      sourceToken: process.env.BETTER_STACK_SOURCE_TOKEN,
      options: {
        endpoint: `https://${process.env.BETTER_STACK_INGESTING_HOST}`,
      },
    },
  });
}

const transport = pino.transport({
  targets,
});

const baseLogger = pino(
  {
    level: config.logLevel,

    base: {
      application: config.application,
      service: config.service,
      environment: config.environment,
    },

    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export const getLogger = () => {
  const context = requestContext.getStore();

  if (!context?.requestId) {
    return baseLogger;
  }

  return baseLogger.child({
    requestId: context.requestId,
  });
};

export default baseLogger;