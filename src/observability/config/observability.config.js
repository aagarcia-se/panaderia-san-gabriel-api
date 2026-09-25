import { config } from "../../config/index.js";

const configLog = config.observability;

const observabilityConfig = {
  environment: configLog.environment || "development",
  application: configLog.application|| "unknown",
  service: configLog.service || "api",
  logLevel: configLog.logLevel || "info",

  betterStack: {
    sourceToken: configLog.betterStack.sourceToken,
    ingestingHost: configLog.betterStack.ingestingHost,
  },
};

export default observabilityConfig;