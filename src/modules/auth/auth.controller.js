import { iniciarSesionService } from "./auth.service.js";


export const iniciarSesionController = async (req, res, next) => {
    try {
      const usuarioAuth = await iniciarSesionService(req.body);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        usuarioAuth
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  };