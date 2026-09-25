import pino from "pino";
import observabilityConfig from "../config/observability.config.js";
import requestContext from "../context/requestContext.js";

try {
  const logtailPino = await import("@logtail/pino");

  console.log("LOGTAIL IMPORT OK:", Boolean(logtailPino));

  console.log(
    "LOGTAIL MODULE:",
    Object.keys(logtailPino)
  );
} catch (error) {
  console.error("LOGTAIL IMPORT ERROR:", error);
}

const isEnabled = observabilityConfig.enabled === true;

const hasBetterStack =
  isEnabled &&
  Boolean(observabilityConfig.betterStack?.sourceToken) &&
  Boolean(observabilityConfig.betterStack?.ingestingHost);

const targets = [
  {
    target: "pino/file",
    level: observabilityConfig.logLevel,
    options: {
      destination: 1,
    },
  },
];

if (hasBetterStack) {
  targets.push({
    target: "@logtail/pino",
    level: observabilityConfig.logLevel,
    options: {
      sourceToken:
        observabilityConfig.betterStack.sourceToken,
      options: {
        endpoint:
          `https://${observabilityConfig.betterStack.ingestingHost}`,
      },
    },
  });
}

const transport = pino.transport({
  targets,
});

const baseLogger = pino(
  {
    level: observabilityConfig.logLevel,

    base: {
      application: observabilityConfig.application,
      service: observabilityConfig.service,
      environment: observabilityConfig.environment,
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