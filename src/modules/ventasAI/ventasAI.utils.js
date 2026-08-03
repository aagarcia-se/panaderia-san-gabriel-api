

export const crearPayloadDetalleVenta = (detalleVenta, productosMap, fechaCreacion) => {
    const lista = Array.isArray(detalleVenta)
        ? detalleVenta
        : detalleVenta.detalleventa ?? [];

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

export const convertirFilasAUnidadesFrances = (productos) => {
    return productos.map((producto) => {
        if (producto.idProducto != 1) return producto;

        const cantidad = parseFloat(producto.Sobrantes);
        const filasEnteras = Math.floor(cantidad);
        const mediaFila = cantidad % 1 >= 0.5 ? 3 : 0; // 0.5 = media fila = 3 unidades

        const unidades = (filasEnteras * 6) + mediaFila;

        return {
            ...producto,
            Sobrantes: unidades,
        };
    });
};