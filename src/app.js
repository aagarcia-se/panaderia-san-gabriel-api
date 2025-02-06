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
import { productoImgRoutes } from "./modules/imagenesproductos/imgproductos.routes.js";
import { categoriasRoute } from "./modules/categorias/categorias.routes.js";

const app = express();

// Aumentar el límite del body-parser a 10MB o más si es necesario
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Habilitar CORS
app.use(cors());

// Rutas de la API
app.use("/api", authRoute);
app.use("/api", rolesRoute);
app.use("/api", sucursalesRoute);
app.use("/api", permisosRoute);
app.use("/api", rolesPermisosRoute);
app.use("/api", usuariosRoute);
app.use("/api", productosRoute);
app.use("/api", smsRoute);
app.use("/api", preciosRoute);
app.use("/api", categoriasRoute);
app.use("/api", productoImgRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
