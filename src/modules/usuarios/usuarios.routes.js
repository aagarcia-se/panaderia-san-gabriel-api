import { Router } from "express";
import { actualizarContraseniaController, actualizarDatosUsuarioController, actualizarUsuarioController, bloquearUsuarioController, cambiarPasswordController, consultarUsuariosController, crearUsuarioController, desbloquearUsuarioController, eliminarUsuarioController, resetarContraseniaController } from "./usuarios.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission, requireSelfOrPermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const usuariosRoute = Router();

const usersPermission = requirePermission(PERMISSIONS.USERS);

// Perfil propio: solo puede editar sus propios datos (no rol ni sucursal).
const selfProfilePermission = requireSelfOrPermission(
  { idFields: ["idUsuario"], usernameFields: ["usuario"], matchAll: true },
  PERMISSIONS.USERS
);

// Cambio de contraseña propia: el DAO actualiza por `usuario`.
const selfPasswordByUsernamePermission = requireSelfOrPermission(
  { usernameFields: ["usuario"] },
  PERMISSIONS.USERS
);

// Cambio de contraseña propia: el DAO actualiza por `idUsuario`.
const selfPasswordByIdPermission = requireSelfOrPermission(
  { idFields: ["idUsuario"] },
  PERMISSIONS.USERS
);

usuariosRoute.post("/crearUsuario", authMiddleware, usersPermission, crearUsuarioController);
usuariosRoute.get("/consultarUsuarios", authMiddleware, usersPermission, consultarUsuariosController);
usuariosRoute.put("/actualizarUsuario/", authMiddleware, selfProfilePermission, actualizarUsuarioController);
usuariosRoute.put("/bloquearUsuario/:idUsuario", authMiddleware, usersPermission, bloquearUsuarioController);
usuariosRoute.put("/desbloquearUsuario/:idUsuario", authMiddleware, usersPermission, desbloquearUsuarioController);
usuariosRoute.delete("/eliminarUsuario/:idUsuario", authMiddleware, usersPermission, eliminarUsuarioController);
usuariosRoute.put("/actualizar-pass", authMiddleware, selfPasswordByUsernamePermission, cambiarPasswordController);
usuariosRoute.put("/actualizar-datos-usuario", authMiddleware, usersPermission, actualizarDatosUsuarioController);
usuariosRoute.put("/resetear-contrasenia", authMiddleware, requirePermission(PERMISSIONS.USERS, PERMISSIONS.RESET_PASSWORD), resetarContraseniaController);
usuariosRoute.put("/actualizar-contrasenia", authMiddleware, selfPasswordByIdPermission, actualizarContraseniaController);
