
import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarIngresosAnualesDao, consultarIngresosMensualesDao, consultarResumenIngresosPorMesDao } from "../ingresos/ingresos.dao.js";
import { consultarCantidadSucursalesDao } from "../sucursales/sucursales.Dao.js";
import { consultarCantidadEmpleadosDao } from "../usuarios/usuarios.dao.js";
import { consultarTopProductosMasVendiddosDao } from "../ventas/ventas.dao.js";

export const consultarDataDashboardService = async () => {
    try {
        const resCantidadEmpleados = await consultarCantidadEmpleadosDao();
        const resCantidadSucursales = await consultarCantidadSucursalesDao();
        const resIngresosMensuales = await consultarIngresosMensualesDao();
        const resIngresosAnuales = await consultarIngresosAnualesDao();
        const resIngresosPorMes = await consultarResumenIngresosPorMesDao();
        const resTopProductosMasVendidos = await consultarTopProductosMasVendiddosDao();

        const dataDashboard = {
            cantidadEmpleados: resCantidadEmpleados,
            cantidadSucursales: resCantidadSucursales,
            ingresosMensuales: resIngresosMensuales,
            ingresosAnuales: resIngresosAnuales,
            resumenMensual: resIngresosPorMes,
            topProductosMasVendidos: resTopProductosMasVendidos
        }

        return dataDashboard;
    } catch (error) {
        throw error;
    }
}