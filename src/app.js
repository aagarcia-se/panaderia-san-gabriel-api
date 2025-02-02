import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import { rolesRoute } from "./modules/roles/roles.Routes.js";
import { sucursalesRoute } from "./modules/sucursales/sucursal.routes.js";
import { permisosRoute } from "./modules/permisos/permisos.routes.js";
import { rolesPermisosRoute } from "./modules/rolespermisos/rolespermisos.routes.js";
import { usuariosRoute } from "./modules/usuarios/usuarios.routes.js";
import { smsRoute } from "./modules/enviarsms/enviarsms.routes.js";
import { authRoute } from "./modules/auth/auth.routes.js";
import { productosRoute } from "./modules/productos/productos.routes.js";
import { preciosRoute } from "./modules/precios/precios.routes.js";




const app = express();
app.use(express.json());
app.use(cors());

// Tus rutas
app.use("/api", authRoute);
app.use("/api", rolesRoute);
app.use("/api", sucursalesRoute);
app.use("/api", permisosRoute);
app.use("/api", rolesPermisosRoute);
app.use("/api", usuariosRoute);
app.use("/api", productosRoute);
app.use("/api", smsRoute);
app.use("/api", preciosRoute);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;