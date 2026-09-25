const databaseErrorMap = {
  // ==========================================
  // DATABASE
  // ==========================================

  1: {
    message: "No existen los registros consultados en BD.",
    statusCode: 204,
    code: 204,
    category: "DATABASE",
    errorCode: "RECORDS_NOT_FOUND",
  },

  2: {
    message: "No se pudo ingresar el registro en BD.",
    statusCode: 409,
    code: 409,
    category: "DATABASE",
    errorCode: "DATABASE_INSERT_FAILED",
  },

  3: {
    message: "Registro a actualizar no existe en BD.",
    statusCode: 409,
    code: 409,
    category: "DATABASE",
    errorCode: "RECORD_TO_UPDATE_NOT_FOUND",
  },

  4: {
    message: "Registro a eliminar no existe en BD.",
    statusCode: 409,
    code: 409,
    category: "DATABASE",
    errorCode: "RECORD_TO_DELETE_NOT_FOUND",
  },

  // ==========================================
  // AUTH / TOKEN
  // ==========================================

  5: {
    message: "Token expirado.",
    statusCode: 403,
    code: 403,
    category: "AUTH",
    errorCode: "TOKEN_EXPIRED",
  },

  6: {
    message: "Token inválido.",
    statusCode: 403,
    code: 403,
    category: "AUTH",
    errorCode: "TOKEN_INVALID",
  },

  7: {
    message: "Acceso denegado. No hay token.",
    statusCode: 401,
    code: 401,
    category: "AUTH",
    errorCode: "TOKEN_MISSING",
  },

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  8: {
    message: "Usuario o contraseña inválidos.",
    statusCode: 401,
    code: 401,
    category: "AUTH",
    errorCode: "INVALID_CREDENTIALS",
  },

  9: {
    message: "Usuario o contraseña inválidos.",
    statusCode: 401,
    code: 401,
    category: "AUTH",
    errorCode: "INVALID_CREDENTIALS",
  },

  10: {
    message: "Usuario o contraseña inválidos.",
    statusCode: 401,
    code: 401,
    category: "AUTH",
    errorCode: "INVALID_CREDENTIALS",
  },

  // ==========================================
  // VALIDATION
  // ==========================================

  11: {
    message: "Datos de entrada inválidos o incompletos.",
    statusCode: 400,
    code: 400,
    category: "VALIDATION",
    errorCode: "INVALID_INPUT",
  },

  12: {
    message: "El usuario ya existe.",
    statusCode: 409,
    code: 409,
    category: "VALIDATION",
    errorCode: "USER_ALREADY_EXISTS",
  },

  // ==========================================
  // AUTHORIZATION / PERMISSIONS
  // ==========================================

  13: {
    message: "No tienes permisos para realizar esta acción.",
    statusCode: 403,
    code: 403,
    category: "AUTH",
    errorCode: "INSUFFICIENT_PERMISSIONS",
  },

  14: {
    message: "Rol no válido.",
    statusCode: 403,
    code: 403,
    category: "AUTH",
    errorCode: "INVALID_ROLE",
  },

  // ==========================================
  // SERVER
  // ==========================================

  15: {
    message: "Error interno del servidor.",
    statusCode: 500,
    code: 500,
    category: "SYSTEM",
    errorCode: "INTERNAL_SERVER_ERROR",
  },

  16: {
    message: "Error al conectar con la base de datos.",
    statusCode: 500,
    code: 500,
    category: "DATABASE",
    errorCode: "DATABASE_CONNECTION_FAILED",
  },

  // ==========================================
  // USER BLOCKED
  // ==========================================

  17: {
    message: "Usuario o contraseña inválidos.",
    statusCode: 401,
    code: 401,
    category: "AUTH",
    errorCode: "INVALID_CREDENTIALS",
  },

  // ==========================================
  // BUSINESS
  // ==========================================

  18: {
    message:
      "Unidades restantes no puede ser mayor a las unidades producidas.",
    statusCode: 422,
    code: 422,
    category: "BUSINESS",
    errorCode: "INVALID_REMAINING_UNITS",
  },

  19: {
    message:
      "Ya existe una orden con el turno, sucursal y fecha ingresada.",
    statusCode: 409,
    code: 409,
    category: "BUSINESS",
    errorCode: "ORDER_ALREADY_EXISTS",
  },

  20: {
    message:
      "El stock actual es menor que el stock erróneo ingresado. Verifica los datos.",
    statusCode: 409,
    code: 409,
    category: "BUSINESS",
    errorCode: "INVALID_STOCK_ADJUSTMENT",
  },

  21: {
    message:
      "No hay productos vendidos para este turno, no se debe ingresar la venta.",
    statusCode: 422,
    code: 422,
    category: "BUSINESS",
    errorCode: "NO_PRODUCTS_SOLD",
  },

  22: {
    message:
      "No se puede eliminar la categoría porque tiene productos asociados.",
    statusCode: 409,
    code: 409,
    category: "BUSINESS",
    errorCode: "CATEGORY_HAS_PRODUCTS",
  },
};

export const getError = (typeError) => {
  const typeErrorStr = String(typeError);

  for (const [key, value] of Object.entries(databaseErrorMap)) {
    if (typeErrorStr === key) {
      return value;
    }
  }

  return {
    message: "Error desconocido.",
    statusCode: 500,
    code: 500,
    category: "SYSTEM",
    errorCode: "UNKNOWN_ERROR",
  };
};