const databaseErrorMap = {
  1:{
    message: "No existen los regisgtros consultados en BD",
    statusCode: 204,
    code: 204
  },
  2:{
    message: "No se pudo ingresar el registro en BD",
    statusCode: 409,
  },
  3:{
    message: "Registro a actualizar no existe en BD",
    statusCode: 409,
  }, 
  4:{
    message: "Registro a elmiminar no existe en BD",
    statusCode: 409,
  },
  

  // Agregar más errores de base de datos aquí según sea necesario
};

export const getError = (typeError) => {
  const typeErrorStr = String(typeError);
  for (const [key, value] of Object.entries(databaseErrorMap)) {
    if (typeErrorStr.includes(key)) {
      return value;
    }
  }
  return null;
};
