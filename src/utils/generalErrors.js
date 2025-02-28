const databaseErrorMap = {
  // Errores de Base de Datos
  1: {
    message: "No existen los registros consultados en BD.",
    statusCode: 204,
    code: 204,
  },
  2: {
    message: "No se pudo ingresar el registro en BD.",
    statusCode: 409,
    code: 409,
  },
  3: {
    message: "Registro a actualizar no existe en BD.",
    statusCode: 409,
    code: 409,
  },
  4: {
    message: "Registro a eliminar no existe en BD.",
    statusCode: 409,
    code: 409,
  },

  // Errores de Token
  5: {
    message: "Token expirado.",
    statusCode: 403,
    code: 403,
  },
  6: {
    message: "Token inválido.",
    statusCode: 403,
    code: 403,
  },
  7: {
    message: "Acceso denegado. No hay token.",
    statusCode: 401,
    code: 401,
  },

  // Errores de Autenticación
  8: {
    message: "Usuario o contraseña inválidos.",
    statusCode: 404,
    code: 404,
  },
  9: {
    message: "Usuario no encontrado.",
    statusCode: 404,
    code: 404,
  },
  10: {
    message: "Contraseña incorrecta.",
    statusCode: 401,
    code: 401,
  },

  // Errores de Validación de Datos
  11: {
    message: "Datos de entrada inválidos o incompletos.",
    statusCode: 400,
    code: 400,
  },
  12: {
    message: "El usuario ya existe.",
    statusCode: 409,
    code: 409,
  },

  // Errores de Permisos
  13: {
    message: "No tienes permisos para realizar esta acción.",
    statusCode: 403,
    code: 403,
  },
  14: {
    message: "Rol no válido.",
    statusCode: 403,
    code: 403,
  },

  // Errores de Servidor
  15: {
    message: "Error interno del servidor.",
    statusCode: 500,
    code: 500,
  },
  16: {
    message: "Error al conectar con la base de datos.",
    statusCode: 500,
    code: 500,
  },
  17: {
    message: "Usuario bloqueado",
    statusCode: 403,
    code: 403,
  },
  18: {
    message: "Unidades restantes no puede ser mayor a las unidades producidas",
    statusCode: 422,
    code: 422,
  },
  19: {
    message: "Ya existe una orden con el turno, sucursal y fecha ingresada",
    statusCode: 409,
    code: 409,
  }
  // Agregar más errores de base de datos aquí según sea necesario
};

export const getError = (typeError) => {
  const typeErrorStr = String(typeError);
  for (const [key, value] of Object.entries(databaseErrorMap)) {
    if (typeErrorStr === key) { // Comparación exacta
      return value;
    }
  }
  return {
    message: "Error desconocido.",
    statusCode: 500,
    code: 500,
  };
};
