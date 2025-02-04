import { actualizarImgProductoService, eliminarImgProductoService, ingresarImgProductoService } from "./imgproductos.service.js";

export const ingresarImgProductoController = async (req, res, next) => {
    try {
      const idImagen = await ingresarImgProductoService(req.body);
      const responseData = {
        status: 201,
        message: "Inserción exitosa",
        idImagen,
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };

  export const actualizarImgProductoController= async (req, res, next) => {
    try {
      const imgActualizada = await actualizarImgProductoService(req.body);
      const responseData = {
        status: 200,
        message: "Actualización exitosa",
        imgActualizada
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  
  export const eliminarImgProductoController = async (req, res, next) => {
    try {
      const {idProducto} = req.params;
      await eliminarImgProductoService(idProducto);
      const responseData = {
        status: 200,
        message: "Eliminación exitosa",
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };
  








