import { getLogger, LOG_CATEGORIES } from "../observability/index.js";

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

    logger[logLevel](
      logData,
      "HTTP request completed"
    );
  });

  next();
};

export default requestLogger;