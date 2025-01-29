const databaseErrorMap = {
  "UNIQUE constraint failed": {
    message: "Dato Ingresado ya existe",
    statusCode: 409,
    code: 401
  },
  "Cannot read properties of null (reading 'message')": {
    message: "Internal Server Error",
    statusCode: 500,
  },
  "Unsupported type of value": {
    message: "Tipo de valor no soportado",
    statusCode: 400,
  },
  "fetch failed": {
    message: "Servicio de base de datos no disponible",
    statusCode: 500,
  },
  "Cannot read properties of undefined (reading 'message')":{
    message: "Internal Server Error",
    statusCode: 500,
  },
  "SQL_INPUT_ERROR: SQL input error: no such column:":{
      message: "Campo no existen en BD",
      statusCode: 500,

  },
  "SQLite error: FOREIGN KEY constraint failed":{
    message: "Este registro se encuentra relacionado a otro",
    statusCode: 409,
    code: 402
  }

  // Agregar más errores de base de datos aquí según sea necesarior
};

export const getDatabaseError = (errorMessage) => {
  for (const [key, value] of Object.entries(databaseErrorMap)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  return {
    message: "Internal Server Error",
    statusCode: 500,
  };
};
