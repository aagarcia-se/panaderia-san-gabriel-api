import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarDetalleDeTraladoDao, consultarTrasladosDao, eliminarTrasladoDao, registrarTrasladoProductoDao } from "./traslados.dao.js";

/*--------------------------------------------------------------------
----------------- Gestion de la tabla Traslados Productos ------------
----------------------------------------------------------------------*/
export const registrarTrasladoProductoService = async (trasladoProducto) => {
    try {
        const resTraslado = await registrarTrasladoProductoDao(trasladoProducto);

        if (resTraslado === 0) {
            throw new CustomError(getError(2));
        }
        
        return resTraslado;
    } catch (error) {
        throw error;
    }
};

export const consultarTrasladosService = async () => {
    try {
        const resTraslados = await consultarTrasladosDao();

        if (resTraslados.length === 0) {
            throw new CustomError(getError(1));
        }

        return resTraslados;
    } catch (error) {
        throw error;
    }
}

export const consultarDetalleDeTraladoService = async (idTraslado) => {
    try {
        const resTraslados = await consultarDetalleDeTraladoDao(idTraslado);

        if (resTraslados === 0) {
            throw new CustomError(getError(1));
        }

        return resTraslados;
    } catch (error) {
        throw error;
    }
}

export const eliminarTrasladoService = async (idTraslado) => {
    try {
        const resTraslado = await eliminarTrasladoDao(idTraslado);

        if (resTraslado === 0) {
            throw new CustomError(getError(4));
        }

        return resTraslado;
    } catch (error) {
        throw error;
    }
}
