import { parsearCSV } from "../../utils/ProcesarArchivos/csvParser.js";
import { consultarProductosOptimizadoService } from "../productos/productos.service.js";
import { ingresarVentaService } from "../ventas/venta.service.js";
import { crearPayloadVentaBatch } from "./ventasbatch.utils.js";

export const ingresarVentaBatchService = async (venta, csvString) => {
    try {
        const registros = parsearCSV(csvString);

        const productos = registros.map(fila => {
            if(fila.Codigo && fila.Producto){
                return {
                    idProducto: parseInt(fila.Codigo),
                    nombre: fila.Producto,
                    unidadesNoVendidas: fila.Sobrante ? parseInt(fila.Sobrante) : 0
                };
            }
            
        })

        const idsProductos = productos.map(producto => {
            return producto.idProducto;
        })

        const productosMap = await consultarProductosOptimizadoService(idsProductos);

        const payload = crearPayloadVentaBatch(venta, productos, productosMap);

        const resVenta = await ingresarVentaService(payload);

        return resVenta;
    } catch (error) {
        throw error;
    }
}