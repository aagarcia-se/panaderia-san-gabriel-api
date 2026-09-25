class CustomError extends Error {
  constructor({
    message = "Unknown Error",
    statusCode = 500,
    code = 500,
    data = null,
    category = "SYSTEM",
    errorCode = "UNKNOWN_ERROR",
  }) {
    super(message);

    this.name = "CustomError";

    // Datos actuales de la API
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;

    // Datos para observabilidad
    this.category = category;
    this.errorCode = errorCode;
  }
}

export default CustomError;