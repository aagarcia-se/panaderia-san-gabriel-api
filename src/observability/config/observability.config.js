import { config } from "../../config/index.js";
const configLog = config.observability;

const observabilityConfig = {
  enabled: process.env.OBSERVABILITY_ENABLED === "true",
  environment: configLog.environment || "development",
  application: configLog.application || "unknown",
  service: configLog.service || "api",
  logLevel: configLog.logLevel || "info",

  betterStack: {
    sourceToken: configLog.betterStack.sourceToken,
    ingestingHost: configLog.betterStack.ingestingHost,
  },

  /**
   * Rutas que SIEMPRE se loguean localmente (Pino/consola
   * de Vercel) pero que NO se envían a Better Stack cuando
   * la respuesta es exitosa (2xx/3xx) — para no saturar la
   * cuota del plan free con tráfico de monitoreo (health
   * checks, pings de BD, etc.).
   *
   * Si estas rutas fallan (4xx/5xx), SÍ se envían a Better
   * Stack, porque eso ya es una señal real de un problema.
   *
   * Prefijo con "*" al final: "/api/health/*" cubre
   * /api/health/db, etc.
   */
  excludedFromRemotePaths: [
    "/api/health*",
  ],
};

export default observabilityConfig;