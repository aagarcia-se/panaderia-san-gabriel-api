import CustomError from "../utils/CustomError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    console.error(`${err.message} (Status: ${err.statusCode})`);
    return res.status(err.statusCode).json({
      error: {
        servicio: err.servicio,
        message: err.message,
        code: err.code,
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      message: err || err.message || "Error interno del servidor",
      code: 500,
    },
  });
};

export default errorHandler;
