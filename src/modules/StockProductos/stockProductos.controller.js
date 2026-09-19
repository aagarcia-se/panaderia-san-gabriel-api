import { consultarStockDiarioPorSucursalService, consultarStockGeneralService, consultarStockProductoService, consultarStockProductosService, corregirStockProductosService, registrarStockProductosOptimizadoService } from "./stockProductos.service.js";

export const consultarStockProductoController = async (req, res, next) => {
  try {
    const { idProducto, idSucursal } = req.query;
    const stockProducto = await consultarStockProductoService(idProducto, idSucursal);
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
      const { idSucursal } = req.params
      const stockProductos = await consultarStockProductosService(idSucursal);
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
    const stockProducto = await registrarStockProductosOptimizadoService(req.body);
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

/*------------------------------------------------------------------------------
---------- Control de stock productos de venta diaria --------------------------
--------------------------------------------------------------------------------*/
export const consultarStockDiarioPorSucursalController = async (req, res, next) => {
  try {
    const idSucursal = req.query.idSucursal;
    const fecha = req.query.fecha;
    const stockDiario = await consultarStockDiarioPorSucursalService (idSucursal, fecha);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      stockDiario,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

//Consultas unificacion de tablas
//----------------------------------------------------------------------------- 
//----------------------------------------------------------------------------- 
export const consultarStockGeneralController = async (req, res, next) => {
  try {
    const idSucursal = req.query.idSucursal;
    const fecha = req.query.fecha;
    const stockProductos = await consultarStockGeneralService(idSucursal, fecha);
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

