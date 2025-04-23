import { actualizarUsuarioService, consultarUsuariosService, crearUsuarioService, bloquearUsuarioService, elminarUsuarioService, desbloquearUsuarioService, cambiarPasswordService } from "./usuarios.service.js";


export const crearUsuarioController = async (req, res, next) => {
  try {
    const usuario = await crearUsuarioService(req.body);
    const responseData = {
      status: 200,
      message: "Creacion de usuario existosa",
      idUsuario: usuario,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const consultarUsuariosController = async (req, res, next) => {
  try {
    const usuarios = await consultarUsuariosService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      usuarios,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const actualizarUsuarioController = async (req, res, next) => {
  try {
    const usuarioActualizado = await actualizarUsuarioService(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
      usuarioActualizado: usuarioActualizado,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const bloquearUsuarioController = async (req, res, next) => {
  try {
    const {idUsuario} = req.params;
    const usuarioBloqueado = await bloquearUsuarioService(idUsuario);
    const responseData = {
      status: 200,
      message: "Bloqueo exitosa",
      usuarioBloqueado
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const desbloquearUsuarioController = async (req, res, next) => {
  try {
    const {idUsuario} = req.params;
    const usuarioDesbloqueado = await desbloquearUsuarioService(idUsuario);
    const responseData = {
      status: 200,
      message: "Desbloqueo exitosa",
      usuarioDesbloqueado
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const eliminarUsuarioController = async (req, res, next) => {
  try {
    const {idUsuario} = req.params;
    const usuarioEliminado = await elminarUsuarioService(idUsuario);
    const responseData = {
      status: 200,
      message: "Bloqueo exitosa",
      usuarioEliminado
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const cambiarPasswordController = async (req, res, next) => {
  try {
    const passActualizado = await cambiarPasswordService(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
      passActualizado
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};