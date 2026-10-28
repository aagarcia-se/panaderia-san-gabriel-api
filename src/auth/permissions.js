/**
 * Catálogo de permisos usados por la API.
 *
 * Los valores deben coincidir con la columna `rutaAcceso` de la tabla
 * PERMISOS, que es la misma que utiliza el frontend para proteger sus rutas.
 */
export const PERMISSIONS = Object.freeze({
  USERS: "/users",
  RESET_PASSWORD: "/reset-pass",

  DASHBOARD: "/dashboard",
  STOCK: "/stock-productos",
  PRODUCTION: "/ordenes-produccion",
  SPECIAL_ORDERS: "/pedido-especial",
  SALES: "/ventas",
  REPORTS: "/reportes",

  PRODUCTS: "/productos",
  CATEGORIES: "/categorias",
  BRANCHES: "/sucursales",
  RAW_MATERIALS: "/config/gestionar-materia-prima",
  PROFILE: "/config/configuracion-perfil",

  SURVEYS: "/encuestas-config",
  NOTIFICATIONS: "/habilitar-notificaciones",
  PRODUCTION_DATE: "/activar-fecha-produccion",
});
