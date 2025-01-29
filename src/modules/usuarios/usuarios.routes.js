import { Router } from "express";
import { actualizarUsuarioController, bloquearUsuarioController, consultarUsuariosController, crearUsuarioController, desbloquearUsuarioController, eliminarUsuarioController } from "./usuarios.controller.js";

export const usuariosRoute = Router();

usuariosRoute.post("/crearUsuario", crearUsuarioController);
usuariosRoute.get("/consultarUsuarios", consultarUsuariosController);
usuariosRoute.put("/actualizarUsuario/", actualizarUsuarioController);
usuariosRoute.put("/bloquearUsuario/:idUsuario", bloquearUsuarioController);
usuariosRoute.put("/desbloquearUsuario/:idUsuario", desbloquearUsuarioController);
usuariosRoute.delete("/eliminarUsuario/:idUsuario", eliminarUsuarioController);