import { IngresarDescuentoServices } from "./descontarStock.service.js";


export const descontarStockController = async (req, res, next) => {
    try {
      const stockADescontar = await IngresarDescuentoServices(req.body);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        stockADescontar,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };