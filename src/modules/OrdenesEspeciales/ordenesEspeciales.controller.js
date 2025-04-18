import { consultarOrdenesEspecialesServices, consultarOrdenEspecialByIdServices, ingresarOrdenEspecialServices } from "./ordenesEspeciales.service.js";


export const ingresarOrdenEspecialController = async (req, res, next) => {
    try {
      const ordenEspecial = await ingresarOrdenEspecialServices(req.body);
      const responseData = {
        status: 200,
        message: "Ingreso exitoso",
        ordenEspecial
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  }

export const consultarOrdenesEspecialesController = async (req, res, next) => {
    try{
        const ordenesEspeciales = await consultarOrdenesEspecialesServices();
        const responseData = {
            status: 200,
            message: "Constulta exitosa",
            ordenesEspeciales,
        }

        res.status(200).json(responseData);
    }catch(error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
}

export const consultarOrdenEspecialByIdController = async (req, res, next) => {
    try{
        const {idOrdenEspecial} = req.params;
        const ordenEspecial = await consultarOrdenEspecialByIdServices(idOrdenEspecial);
        const responseData = {
            status: 200,
            message: "Constulta exitosa",
            ordenEspecial,
        }

        res.status(200).json(responseData);
    }catch(error){
        next(error); // Pasa el error al middleware de manejo de errores
    }
}