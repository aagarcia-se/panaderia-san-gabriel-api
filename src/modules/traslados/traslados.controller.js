import { consultarDetalleDeTraladoService, consultarTrasladosService, eliminarTrasladoService, registrarTrasladoProductoService } from "./traslados.service.js";

export const registrarTrasladoController = async (req, res, next) => {
    try {
      const resTraslado = await registrarTrasladoProductoService(req.body);
      const responseData = {
        status: 200,
        message: "Ingreso exitoso",
        resTraslado,    
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const consultarTrasladosController = async (req, res, next) => {
    try {
        const traslados = await consultarTrasladosService();
        const responseData = {
            status: 200,
            message: "Consulta exitosa",
            traslados,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const consultarDetalleDeTraladoController = async (req, res, next) => {
    try {
        const resTraslados = await consultarDetalleDeTraladoService(req.params.idTraslado);
        const responseData = {
            status: 200,
            message: "Consulta exitosa",
            resTraslados,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const eliminarTrasladoController = async (req, res, next) => {
    try {
        const resTraslado = await eliminarTrasladoService(req.params.idTraslado);
        const responseData = {
            status: 200,
            message: "Eliminación exitosa",
            TraladaoElminado: resTraslado,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
};