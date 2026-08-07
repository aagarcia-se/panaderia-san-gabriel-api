
export const normalizarObjetoDescuentoProductoOrigenTraslado = (trasladoProducto) => {

    const { traladoHeader, trasladoDetalle } = trasladoProducto;

    const stockADescontarData = {
        descuentoInfo: {
            idSucursal: traladoHeader.idSucursalOrigen, // descuenta del origen
            idUsuario: traladoHeader.idUsuario,
            fechaDescuento: traladoHeader.fechaTraslado,
            fechaCreacion: traladoHeader.fechaTraslado,
        },
        detalleDescuento: trasladoDetalle.map(d => ({
            idProducto: d.idProducto,
            controlarStock: d.controlarStock,
            controlarStockDiario: d.controlarStockDiario,
            stockADescontar: d.cantidadATrasladar, // mapear el campo cantidad
            fechaDescuento: traladoHeader.fechaTraslado,
            fechaCreacion: traladoHeader.fechaTraslado,
        }))
    };

    return stockADescontarData;
}

export const normalizarObjetoAgregarProductoDestinoTraslado = (trasladoProducto) => {

    const { traladoHeader, trasladoDetalle } = trasladoProducto;

    const stockAAgregar = {
        stockProductos: trasladoDetalle.map(d => ({
            idUsuario: traladoHeader.idUsuario,
            idProducto: d.idProducto,
            idSucursal: traladoHeader.idSucursalDestino, // 👈 destino
            stock: d.cantidadATrasladar,
            tipoProduccion: d.tipoProduccion || "",
            controlarStock: d.controlarStock || 0,
            controlarStockDiario: d.controlarStockDiario || 0,
            fechaActualizacion: traladoHeader.fechaTraslado,
            fechaCreacion: traladoHeader.fechaTraslado,
        }))
    };

    return stockAAgregar;
}
