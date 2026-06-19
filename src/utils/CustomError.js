class CustomError extends Error {
  constructor({ message = "Unknown Error", statusCode = 500, code = 500, data = null }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.data = data; // 👈 agregar
  }
}

export default CustomError;