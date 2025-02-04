import { actualizarPrecioProductoService, consultarPreciosProductosService, elminarPrecioProductoService, ingresarPrecioProductoService } from "./precios.service.js";

export const ingresarPrecioProductoController = async (req, res, next) => {
    try {
      const idPrecio = await ingresarPrecioProductoService(req.body);
      const responseData = {
        status: 201,
        message: "Inserción exitosa",
        idPrecio,
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };

export const consultarPreciosProductosController = async (req, res, next) => {
    try {
      const preciosProductos = await consultarPreciosProductosService();
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        preciosProductos,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  
  export const actualizarPrecioProductoController= async (req, res, next) => {
    try {
      const precioActualizado = await actualizarPrecioProductoService(req.body);
      const responseData = {
        status: 200,
        message: "Actualización exitosa",
        precioActualizado,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  
  export const eliminarPrecioProductoController = async (req, res, next) => {
    try {
      const {idProducto} = req.params;
      await elminarPrecioProductoService(idProducto);
      const responseData = {
        status: 200,
        message: "Eliminación exitosa",
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  








