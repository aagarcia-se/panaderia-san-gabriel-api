import { actualizarRecetaService, consultarRecetaService, eliminarRecetaService, ingresarRecetaService } from "./recetas.service.js";

export const consultarRecetaController = async (req, res, next) => {
  try {
    const {idProducto} = req.params;
    const receta = await consultarRecetaService(idProducto);
    const responseData = {
      status: 200,
      receta,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const ingresarRecetaController = async (req, res, next) => {
  try {
    const receta = await ingresarRecetaService(req.body);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      receta,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const actualizarRecetaController = async (req, res, next) => {
    try {
      const receta = await actualizarRecetaService(req.body);
      const responseData = {
        status: 201,
        message: "Actualizacion exitosa",
        receta,
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const elminarRectaControler = async (req, res, next) => {
    try {

      const {idProducto} = req.params;
      const receta = await eliminarRecetaService(idProducto);
      const responseData = {
        status: 201,
        message: "Eliminacion exitosa",
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
}