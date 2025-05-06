
import CustomError from "../../utils/CustomError.js";
import { extraerFechaDeFechaYHora, obtenerSoloFecha } from "../../utils/date.utils.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarStockProductoDao, actualizarStockProductoDiarioDao, consultarStockProductoDao, consultarStockProductoDiarioDao, IngresarHistorialStockDao } from "../StockProductos/stockProductos.dao.js";
import { cancelarDescuentoDeStockDao, consultarDescuentoStockPorSucursalDato, consultarDetalleDescuentosDao, ingresarDescuentoDao } from "./descontarStock.dao.js";
import { crearPayloadDescontarStockDiario, crearPayloadDescontarStockGeneral, crearPayloadHistorialStock } from "./descontarStock.utils.js";


export const consultarDescuentoStockPorSucursalService = async (idSucursal) => {
    try {
        const descuentos = await consultarDescuentoStockPorSucursalDato(idSucursal);
        return descuentos;
    } catch (error) {
        throw error;
    }
}

export const IngresarDescuentoServices = async (stockADescontarData) => {
    try {

        await descontarStockServices(stockADescontarData);

        const res = await ingresarDescuentoDao(stockADescontarData);
        if (res === 0) {
            throw new CustomError(getError(2));
        }

        return res;
    } catch (error) {
        throw error;
    }
}

export const descontarStockServices = async (stockADescontarData) => {
    try{
        const {descuentoInfo, detalleDescuento} = stockADescontarData;
        
        return Promise.all(
            detalleDescuento.map(async (producto) => {
                try{

                    if(producto.controlarStock === 0 && producto.controlarStockDiario === 1){
                        const productoDiarioExist = await consultarStockProductoDiarioDao( producto.idProducto, descuentoInfo.idSucursal, descuentoInfo.fechaCreacion );
                        
                        if(productoDiarioExist.idStock !== 0 ){

                            const payloadDescont = crearPayloadDescontarStockDiario(descuentoInfo, producto, productoDiarioExist);

                            await actualizarStockProductoDiarioDao(payloadDescont);
                        }
                    }else{

                        const produtoExist = await consultarStockProductoDao(producto.idProducto, descuentoInfo.idSucursal);
                        if(produtoExist.idStock !== 0){

                            const payloadDescuentoG = crearPayloadDescontarStockGeneral(descuentoInfo, producto, produtoExist);

                            const payloadHistorial = crearPayloadHistorialStock(descuentoInfo, producto, produtoExist);

                            await actualizarStockProductoDao(payloadDescuentoG);
                            await IngresarHistorialStockDao(payloadHistorial);
                        }
                    }

                }catch(error){
                    throw error;
                }
            })
        );

    }catch(error){
        throw error;
    }
}

export const consultarDetalleDescuentosService = async (idDescuento) => {
    try{
        const res = await consultarDetalleDescuentosDao(idDescuento);
        return res;
    }catch(error){
        throw error;
    }
}

export const cancelarDescuentoStockService = async (idDescuento) => {
    try{

        await revertirDescuentoEnStock(idDescuento);
        
        const res = await cancelarDescuentoDeStockDao(idDescuento);

        if(res === 0){
            throw new CustomError(getError(4));
        }

        return res;
    }catch(error){
        throw error;
    }   
}

export const revertirDescuentoEnStock = async (idDescuento) => {
    try{
        const detalleProductosEnDescuento = await consultarDetalleDescuentosDao(idDescuento); 
        const {encabezadoDescuento, detalleDescuento} = detalleProductosEnDescuento;
        return Promise.all(
            detalleDescuento.map( async (producto) => {
                try{
                    
                    if(producto.controlarStock === 1 && producto.controlarStockDiario === 0){
                        const productoEnStock = await consultarStockProductoDao(producto.idProducto, encabezadoDescuento.idSucursal);
                        
                        const payloadRevertir = {
                            idSucursal: encabezadoDescuento.idSucursal,
                            idProducto: producto.idProducto,
                            stock: productoEnStock.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento
                        }

                        await actualizarStockProductoDao(payloadRevertir);

                        const payloadHistorial = {
                            idUsuario: encabezadoDescuento.idUsuario,
                            idProducto: producto.idProducto,
                            idSucursal: encabezadoDescuento.idSucursal,
                            tipoMovimiento: 'INGRESO',
                            stockAnterior: productoEnStock.stock,
                            cantidad: producto.unidadesDescontadas,
                            stockNuevo: productoEnStock.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento,
                            observaciones: 'Revertir descuento por cancelacion',
                            tipoReferencia: 'DESCUENTO'
                        }

                        await IngresarHistorialStockDao(payloadHistorial);

                    }else{

                        const productoEnStockDiario = await consultarStockProductoDiarioDao(producto.idProducto, encabezadoDescuento.idSucursal, obtenerSoloFecha(encabezadoDescuento.fechaDescuento));
                        const payloadRevertir = {
                            idSucursal: encabezadoDescuento.idSucursal,
                            idProducto: producto.idProducto,
                            stock: productoEnStockDiario.stock + producto.unidadesDescontadas,
                            fechaActualizacion: encabezadoDescuento.fechaDescuento,
                            fechaValidez: obtenerSoloFecha(encabezadoDescuento.fechaDescuento)

                        }

                        await actualizarStockProductoDiarioDao(payloadRevertir);
                    }

                    
                }catch(error){
                    throw error;
                }
            })
            
        );
    }catch(error){
        throw error;
    }
}