import CustomError from "../utils/CustomError.js";
import { getLogger, LOG_CATEGORIES, } from "../observability/index.js";

const getErrorLogLevel = (error) => {
  const errorCode = error?.errorCode;

  const criticalErrors = [
    "DATABASE_UNAVAILABLE",
    "DATABASE_CONNECTION_FAILED",
    "DATABASE_UNKNOWN_ERROR",
    "INTERNAL_SERVER_ERROR",
    "UNEXPECTED_ERROR",
  ];

  if (criticalErrors.includes(errorCode)) {
    return "error";
  }

  return "warn";
};

const errorHandler = (err, req, res, next) => {
  const logger = getLogger();

  const isCustomError =
    typeof CustomError === "function" &&
    err instanceof CustomError;

  if (isCustomError || err?.name === "CustomError") {
    const logLevel = getErrorLogLevel(err);

    logger[logLevel](
      {
        category:
        err.category || LOG_CATEGORIES.SYSTEM,
        operation: "errorHandler",
        statusCode: err.statusCode,
        errorCode:
        err.errorCode || "UNKNOWN_ERROR",
        method: req.method,
        url: req.path,
        requestId: req.requestId,
      },
      err.message
    );

    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        data: err.data ?? null,
      },
    });
  }

  logger.error(
    {
      category: LOG_CATEGORIES.SYSTEM,
      operation: "errorHandler",
      statusCode: 500,
      errorName: err?.name || "Error",
      errorCode: "UNEXPECTED_ERROR",
      method: req.method,
      url: req.path,
      requestId: req.requestId,
      stack: err?.stack,
    },
    err?.message ||
      "Error interno del servidor"
  );

  return res.status(500).json({
    error: {
      message:
        err?.message ||
        "Error interno del servidor",

      code: 500,
    },
  });
};

export default errorHandler;