import {
  consultarSucursalesServices,
  ingresarSucursalServices,
  eliminarSucursalServices,
  actualizarSucursalServices,
} from "./sucursales.service.js";

export const consultarSucursalesController = async (req, res, next) => {
  try {
    const sucursales = await consultarSucursalesServices();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      sucursales,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const ingresarSucursalController = async (req, res, next) => {
  try {
    const sucursal = await ingresarSucursalServices(req.body);
    const responseData = {
      status: 201,
      message: "Ingreso exitoso",
      sucursal,
    };
    res.status(responseData.status).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const actualizarSucursalController = async (req, res, next) => {
  try {
    await actualizarSucursalServices(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const eliminarSucursalController = async (req, res, next) => {
  try {
    const {idSucursal} = req.params;
    await eliminarSucursalServices(idSucursal);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};
