const databaseErrorMap = {
  // ==========================================
  // DATABASE - DATA / CONSTRAINTS
  // ==========================================

  "UNIQUE constraint failed": {
    message: "ya existe",
    statusCode: 409,
    code: 401,
    category: "DATABASE",
    errorCode: "UNIQUE_CONSTRAINT",
  },

  "SQLite error: FOREIGN KEY constraint failed": {
    message:
      "Este registro se encuentra relacionado a otro o no existe",
    statusCode: 409,
    code: 402,
    category: "DATABASE",
    errorCode: "FOREIGN_KEY_CONSTRAINT",
  },

  "SQL_INPUT_ERROR: SQL input error: no such column:": {
    message: "Campo no existe en BD",
    statusCode: 500,
    code: 500,
    category: "DATABASE",
    errorCode: "DATABASE_COLUMN_NOT_FOUND",
  },

  // ==========================================
  // DATABASE - CONNECTION / AVAILABILITY
  // ==========================================

  "fetch failed": {
    message: "Servicio de base de datos no disponible",
    statusCode: 503,
    code: 503,
    category: "DATABASE",
    errorCode: "DATABASE_UNAVAILABLE",
  },

  // ==========================================
  // INTERNAL / UNEXPECTED
  // ==========================================

  "Cannot read properties of null (reading 'message')": {
    message: "Internal Server Error",
    statusCode: 500,
    code: 500,
    category: "DATABASE",
    errorCode: "DATABASE_INTERNAL_ERROR",
  },

  "Cannot read properties of undefined (reading 'message')": {
    message: "Internal Server Error",
    statusCode: 500,
    code: 500,
    category: "DATABASE",
    errorCode: "DATABASE_INTERNAL_ERROR",
  },
};

export const getDatabaseError = (errorMessage) => {
  const message = String(errorMessage ?? "");

  for (const [key, value] of Object.entries(databaseErrorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return {
    message: "Internal Server Error",
    statusCode: 500,
    code: 500,
    category: "DATABASE",
    errorCode: "DATABASE_UNKNOWN_ERROR",
  };
};