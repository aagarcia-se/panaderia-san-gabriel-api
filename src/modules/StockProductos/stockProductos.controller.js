import { consultarStockProductoService, consultarStockProductosService, corregirStockProductosService, registrarStockProductosService } from "./stockProductos.service.js";

export const consultarStockProductoController = async (req, res, next) => {
  try {
    const { idProducto } = req.params
    const stockProducto = await consultarStockProductoService(idProducto);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      stockProducto,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const consultarStockProductosController = async (req, res, next) => {
    try {
      const { idProducto } = req.params
      const stockProductos = await consultarStockProductosService (idProducto);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        stockProductos,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const registrarStockProductoController = async (req, res, next) => {
  try {
    const stockProducto = await registrarStockProductosService(req.body);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      stockProducto,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const corregirStockProductosController = async (req, res, next) => {
    try {
        const stockProducto = await corregirStockProductosService(req.body);
        const responseData = {
        status: 200,
        message: "Actualización exitosa",
        stockProducto,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
}