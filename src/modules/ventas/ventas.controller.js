import { consultarDetalleVentaService, consultarVentasPorUsuarioService, eliminarVentaService, ingresarVentaService } from "./venta.service.js";


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

export const consultarVentasPorUsuarioController = async (req, res, next) => {
  try {
    const {idUsuario} = req.query;
    const ventas = await consultarVentasPorUsuarioService(idUsuario);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      ventas,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const elminarVentaController = async (req, res, next) => {
  try {
    const { idVenta } = req.params;
    await eliminarVentaService(idVenta);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const consultarDetalleVentaController = async (req, res, next) => {
  try{
    const {idVenta} = req.params;
    const venta = await consultarDetalleVentaService(idVenta);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      venta,
    };
    res.status(200).json(responseData);

  }catch(error){
    next(error);
  }
}