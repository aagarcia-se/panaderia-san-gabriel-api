import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarIngresoDiarioPorTurnoService } from "../ingresos/ingresos.service.js";
import { crearPayloadingresos } from "../ingresos/ingresos.utils.js";
import { actualizarEstadoOrdenProduccionServices } from "../oredenesproduccion/ordenesproduccion.service.js";
import {
  consultarDetalleVentaDao,
  consultarVentasPorUsuarioDao,
  eliminarVentaDao,
  ingresarVentaDao,
} from "./ventas.dao.js";
import { procesarVentaService } from "./ventas.utils.js";

export const ingresarVentaService = async (venta) => {
  try {
    // Procesar detalles de la venta antes de ingresarla
    const ventaDetalleProcesado = await procesarVentaService(venta);

    // Guardar la venta en la base de datos
    const resVenta = await ingresarVentaDao(ventaDetalleProcesado);

    if (resVenta === 0) {
      throw new CustomError(getError(2));
    }

    const detalleingreso = crearPayloadingresos(
      resVenta.idVenta,
      ventaDetalleProcesado
    );

    await registrarIngresoDiarioPorTurnoService(detalleingreso);

    if (venta.encabezadoVenta.idOrdenProduccion) {
      await actualizarEstadoOrdenProduccionServices(
        resVenta.encabezadoVenta.idOrdenProduccion
      );
    }

    return resVenta;
  } catch (error) {
    throw error;
  }
};

export const consultarVentasPorUsuarioService = async (idUsuariol) => {
  try {
    const ventas = await consultarVentasPorUsuarioDao(idUsuariol);

    if (ventas.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return ventas;
  } catch (error) {
    throw error;
  }
};

export const eliminarVentaService = async (idVenta) => {
  try {
    const resElminacion = await eliminarVentaDao(idVenta);
    if (resElminacion === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return resElminacion;
  } catch (error) {
    throw error;
  }
};

export const consultarDetalleVentaService = async (idVenta) => {
  try{

    const venta = await consultarDetalleVentaDao(idVenta);
    if (venta === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return venta;
  }catch(error){
    throw error;
  }
}
