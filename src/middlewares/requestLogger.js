import { getLogger, LOG_CATEGORIES } from "../observability/index.js";
import { isExcludedFromRemoteLogs } from "../observability/utils/httpLogging.utils.js";

const getLogLevel = (statusCode) => {
  if (statusCode >= 500) {
    return "error";
  }

  if (statusCode >= 400) {
    return "warn";
  }

  return "info";
};

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const durationMs =
      Number(endTime - startTime) / 1_000_000;

    const logger = getLogger();

    const statusCode = res.statusCode;

    const logData = {
      category: LOG_CATEGORIES.API,
      operation: "httpRequest",
      method: req.method,
      url: req.path,
      statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    };

    const logLevel = getLogLevel(statusCode);

    /**
     * Rutas de health check / monitoreo (definidas en
     * observabilityConfig.excludedFromRemotePaths): se
     * loguean local siempre, pero solo se envían a Better
     * Stack si la respuesta fue un error (4xx/5xx). Si el
     * health check responde bien (2xx/3xx), no viaja a
     * Better Stack para no gastar cuota del plan free.
     */
    const isSuccess = statusCode < 400;
    const skipRemote = isExcludedFromRemoteLogs(req.path) && isSuccess;

    logger[logLevel](
      logData,
      "HTTP request completed",
      { skipRemote }
    );
  });

  next();
};

export default requestLogger;