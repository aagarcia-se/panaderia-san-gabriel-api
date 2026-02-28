import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import { rolesRoute } from "./modules/roles/roles.Routes.js";
import { sucursalesRoute } from "./modules/sucursales/sucursal.routes.js";
import { permisosRoute } from "./modules/permisos/permisos.routes.js";
import { rolesPermisosRoute } from "./modules/rolespermisos/rolespermisos.routes.js";
import { usuariosRoute } from "./modules/usuarios/usuarios.routes.js";
import { authRoute } from "./modules/auth/auth.routes.js";
import { productosRoute } from "./modules/productos/productos.routes.js";
import { preciosRoute } from "./modules/precios/precios.routes.js";
import { categoriasRoute } from "./modules/categorias/categorias.routes.js";
import { ordenesRoutes } from "./modules/oredenesproduccion/ordenesproduccion.routes.js";
import { consumoIngredientesRoute } from "./modules/consumosordenesproduccion/consumosordenes.routes.js";
import { ventasRoutes } from "./modules/ventas/ventas.routes.js";
import { stockRoute } from "./modules/StockProductos/stockProductos.routes.js";
import { recetasRoute } from "./modules/recetas/recetas.routes.js";
import { ordenEspecialRoutes } from "./modules/OrdenesEspeciales/ordenesEspeciales.routes.js";
import { descontarStockRoute } from "./modules/descontarStock/descontarStock.routes.js";
import { reportesRoute } from "./modules/reportes/reportes.routes.js";
import { trasladosRoute } from "./modules/traslados/traslados.routes.js";
import { eliminacionesRoute } from "./modules/eliminacionesTracking/eliminaciones.routes.js";
import { dashboardDataRoute } from "./modules/dashboardData/dashboardData.routes.js";
import { surveysRoute } from "./modules/Surveys/surveys.routes.js";
import { activarFechaProduccionRoute } from "./modules/activar_fecha_produccion/activar-fecha-produccioin.routes.js";

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
app.use("/api", preciosRoute);
app.use("/api", categoriasRoute);
app.use("/api", ordenesRoutes);
app.use("/api", consumoIngredientesRoute);
app.use("/api", ventasRoutes);
app.use("/api", stockRoute);
app.use("/api", recetasRoute);
app.use("/api", ordenEspecialRoutes);
app.use("/api", descontarStockRoute);
app.use("/api", reportesRoute);
app.use("/api", trasladosRoute);
app.use("/api", eliminacionesRoute);
app.use("/api", dashboardDataRoute);
app.use("/api", surveysRoute);
app.use("/api", activarFechaProduccionRoute);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
