class CustomError extends Error {
  constructor({ message = "Unknown Error", statusCode = 500, code = 500}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code
  }
}

export default CustomError;
