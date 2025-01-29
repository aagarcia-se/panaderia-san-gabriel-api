import { Router } from "express";
import { actualizarUsuarioController, bloquearUsuarioController, consultarUsuariosController, crearUsuarioController, desbloquearUsuarioController, eliminarUsuarioController } from "./usuarios.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const usuariosRoute = Router();

usuariosRoute.post("/crearUsuario", authMiddleware, crearUsuarioController);
usuariosRoute.get("/consultarUsuarios", authMiddleware, consultarUsuariosController);
usuariosRoute.put("/actualizarUsuario/", authMiddleware, actualizarUsuarioController);
usuariosRoute.put("/bloquearUsuario/:idUsuario", authMiddleware, bloquearUsuarioController);
usuariosRoute.put("/desbloquearUsuario/:idUsuario", authMiddleware, desbloquearUsuarioController);
usuariosRoute.delete("/eliminarUsuario/:idUsuario", authMiddleware, eliminarUsuarioController);