

export const crearPayloadDetalleVenta = (detalleVentaImage, productosMap, fechaCreacion) => {
    const lista = Array.isArray(detalleVentaImage)
        ? detalleVentaImage
        : detalleVentaImage.detalleventa ?? [];

    return lista
        .map((detalle) => {
            const producto = productosMap.getProductos(Number(detalle.idProducto)); // 👈 getProductos en lugar de .find()

            return {
                idProducto:           Number(detalle.idProducto),
                nombreProducto:       producto?.nombreProducto ?? '',
                unidadesNoVendidas:   detalle.Sobrantes,
                fechaCreacion,
                controlarStock:       producto?.controlarStock ?? 0,
                controlarStockDiario: producto?.controlarStockDiario ?? 0,
            };
        });
};