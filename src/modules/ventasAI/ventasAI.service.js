
import { consultarProductosOptimizadoService } from "../productos/productos.service.js";
import { ingresarVentaService } from "../ventas/venta.service.js";
import { convertirFilasAUnidadesFrances, crearPayloadDetalleVenta } from "./ventasAI.utils.js";
import { procesarImagenOcrService } from "../ocr/ocr.service.js";

export const IngresarVentasAIService = async (venta, image) => {
    try {
        const fechaCreacion = venta.encabezadoVenta.fechaCreacion;

        console.time("ProcesarImagen");
        const detalleProductosImage = await procesarImagenOcrService(image); 
        console.timeEnd("ProcesarImagen");  
        
        const detalleProductosConvertido = convertirFilasAUnidadesFrances(detalleProductosImage.detalleVenta);


        const idsProductos = detalleProductosConvertido.map(
            detalle => Number(detalle.idProducto)
        );

        const productosMap = await consultarProductosOptimizadoService(idsProductos);

        const detalleVenta = crearPayloadDetalleVenta(detalleProductosConvertido, productosMap, fechaCreacion);

        venta.detalleVenta = detalleVenta;

        const resVenta = await ingresarVentaService(venta);
        
        return resVenta;
    } catch (error) {
        throw error;
    }
};