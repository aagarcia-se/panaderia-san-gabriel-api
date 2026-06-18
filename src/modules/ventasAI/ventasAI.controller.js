import { IngresarVentasAIService } from "./ventasAI.service.js";


export const IngresarVentasAIController = async (req, res, next) => {
  try {

    if (!req.file) {
      console.log('No se recibió ningún archivo');
      return res.status(400).json({ status: 400, message: 'No se recibió ningún archivo' });
    }

    if (!req.body.ventaHeader) {
      console.log('No se recibieron datos de la venta');
      return res.status(400).json({ status: 400, message: 'No se recibieron datos de la venta' });
    }
    
    const image       = req.file;
    const ventaHeader = JSON.parse(req.body.ventaHeader);
    const productos   = await IngresarVentasAIService(ventaHeader, image);

    res.status(200).json({
      status: 200,
      message: "Imagen procesada exitosamente",
      productos
    });
  } catch (error) {
    next(error);
  }
};