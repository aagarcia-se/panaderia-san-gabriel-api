import { consultarCategoriasService, ingresarCategoriaService } from "./categorias.service.js";

export const ingresarCategoriaController = async (req, res, next) => {
    try {
      const categoriaId = await ingresarCategoriaService(req.body);
      const responseData = {
        status: 201,
        message: "Inserción exitosa",
        categoriaId,
      };
      res.status(201).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };

export const consultarCategoriasController = async (req, res, next) => {
  try {
    const categorias = await consultarCategoriasService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      categorias,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};