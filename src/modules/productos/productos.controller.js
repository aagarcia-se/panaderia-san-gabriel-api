import { actualizarProductoService, consultarProductoService, crearProductoService, elminarProductoService } from "./productos.service.js";



export const ingresarProductoController = async (req, res, next) => {
    try {
      const idProducto = await crearProductoService(req.body);
      const responseData = {
        status: 201,
        message: "Inserción exitosa",
        idProducto,
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };

export const consultarProductosController = async (req, res, next) => {
    try {
      const productos = await consultarProductoService();
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        productos,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  
  export const actualizarProductoController= async (req, res, next) => {
    try {
      const rolActualizado = await actualizarProductoService(req.body);
      const responseData = {
        status: 200,
        message: "Actualización exitosa",
        rol: rolActualizado,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  
  export const elminarProductoController = async (req, res, next) => {
    try {
      const {idProducto} = req.params;
      await elminarProductoService(idProducto);
      const responseData = {
        status: 200,
        message: "Eliminación exitosa",
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  








