import { actualizarProductoService, constultarProductosParaInventarioService, consultarProductoService, crearProductoService, desactivarProductoService, elminarProductoService, } from "./productos.service.js";

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

export const actualizarProductoController = async (req, res, next) => {
  try {
    const precioActualizado = await actualizarProductoService(req.body);
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

export const elminarProductoController = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
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

export const desactivarProductoController = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const produtoDesactivado = await desactivarProductoService(idProducto);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
      produtoDesactivado
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const consultarProductosParaInventarioController = async (req, res, next) => {
  try {
    const productos = await constultarProductosParaInventarioService();
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