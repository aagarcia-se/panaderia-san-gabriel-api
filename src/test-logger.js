import { logger, LOG_CATEGORIES, } from "./observability/index.js";

logger.debug(
    {
        category: LOG_CATEGORIES.SYSTEM,
        operation: "testLogger",
    },
    "Este es un log DEBUG"
);

logger.info(
    {
        category: LOG_CATEGORIES.SYSTEM,
        operation: "testLogger",
    },
    "Logger iniciado correctamente"
);

logger.warn(
    {
        category: LOG_CATEGORIES.SYSTEM,
        operation: "testLogger",
    },
    "Este es un warning de prueba"
);

logger.error(
    {
        category: LOG_CATEGORIES.API,
        operation: "testLogger",
    },
    "Este es un error de prueba"
);