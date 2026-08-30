export const crearPayloadVentaBatch = (venta, productosIngresados, productosEnBD) => {
    const {encabezadoVenta, detalleIngreso, gastosDiarios} = venta;
    const detalleVenta = productosIngresados
        .map(producto => {
            const productoObtenido = productosEnBD.getProductos(producto.idProducto);

            return {
                ...productoObtenido,
                unidadesNoVendidas: producto.unidadesNoVendidas,
                fechaCreacion: encabezadoVenta.fechaCreacion,
                fechaYHoraVenta: encabezadoVenta.fechaCreacion
            };


        });
        
        return {
            encabezadoVenta,
            detalleVenta,
            detalleIngreso,
            gastosDiarios
        };
};
