import { config } from "../../config/index.js";

const configLog = config.observability;
console.log("OBSERVABILITY CONFIG", {
  environment: configLog.environment,
  application: configLog.application,
  service: configLog.service,
  logLevel: configLog.logLevel,
  hasSourceToken: Boolean(configLog.betterStack.sourceToken),
  hasIngestingHost: Boolean(configLog.betterStack.ingestingHost),
});
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