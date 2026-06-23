
import { consultarProductosOptimizadoService } from "../productos/productos.service.js";
import { ingresarVentaService } from "../ventas/venta.service.js";
import { crearPayloadDetalleVenta } from "./ventasAI.utils.js";
import { procesarImagenOcrService } from "../ocr/ocr.service.js";

export const IngresarVentasAIService = async (venta, image) => {
    try {
        const fechaCreacion = venta.encabezadoVenta.fechaCreacion;

        console.time("ProcesarImagen");
        const detalleProductosImage = await procesarImagenOcrService(image); 
        console.timeEnd("ProcesarImagen");       

        const idsProductos = detalleProductosImage.detalleVenta.map(
            detalle => Number(detalle.idProducto)
        );

        const productosMap = await consultarProductosOptimizadoService(idsProductos);

        const detalleVenta = crearPayloadDetalleVenta(detalleProductosImage.detalleVenta, productosMap, fechaCreacion);

        venta.detalleVenta = detalleVenta;

        const resVenta = await ingresarVentaService(venta);
        
        return resVenta;
    } catch (error) {
        throw error;
    }
};