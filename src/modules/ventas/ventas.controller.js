import { ingresarVentaService } from "./venta.service.js";


export const ingresarVentaController = async (req, res, next) => {
  try {
    const ventaIngresada = await ingresarVentaService(req.body);
    const responseData = {
      status: 200,
      message: "Ingreso exitoso",
      ventaIngresada
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}