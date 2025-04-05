
export const calcularStockActualizado = (existencias, nuevoIngreso) => {
    const nuevoStock = existencias + nuevoIngreso;
    return nuevoStock;
}

export const payloadStockProductoInexistente = (stockProducto) => {
    const payload = {
        ...stockProducto,
        cantidad: stockProducto.stock,
        stockAnterior: 0,
        stockNuevo: stockProducto.stock,
        observaciones: "Control de stock general - Ingreso Manual",
    };
    
    return payload;
}

export const payloadStockProductoExistente = (productoExistente, stockProducto) => {
    
    const nuevoStock = calcularStockActualizado(productoExistente.stock, stockProducto.stock);

    const payload = {
        idStock: productoExistente.idStock,
        ...stockProducto,
        stock: nuevoStock,
        cantidad: stockProducto.stock,
        stockAnterior: productoExistente.stock,
        stockNuevo: nuevoStock,
        observaciones: "Control de stock general - Ingreso Manual",
    };
    
    return payload;
}

export const payloadStockDiarioIngresoManualInexistente = (stockProducto) => {
    const payload = {
        idUsuario: stockProducto.idUsuario,
        idProducto: stockProducto.idProducto,
        idSucursal: stockProducto.idSucursal,
        stock: stockProducto.stock,
        fechaValidez: stockProducto.fechaCreacion,
        fechaActualizacion: stockProducto.fechaActualizacion,
        fechaCreacion: stockProducto.fechaCreacion,
        cantidad: stockProducto.stock,
        stockAnterior: 0,
        stockNuevo: stockProducto.stock,
        observaciones: "Control de stock diario - Ingreso Manual",
    }

    return payload;
}

export const payloadStockDiarioIngresoManualExistente = (StockExistente, stockProducto) => {

    const nuevoStock = calcularStockActualizado(StockExistente.stock, stockProducto.stock);

    const payload = {
        idUsuario: stockProducto.idUsuario,
        idProducto: stockProducto.idProducto,
        idSucursal: stockProducto.idSucursal,
        stock: nuevoStock,
        cantidad: nuevoStock,
        stockAnterior: StockExistente.stock,
        stockNuevo: stockProducto.stock,
        fechaActualizacion: stockProducto.fechaActualizacion,
        fechaValidez: stockProducto.fechaCreacion,
        fechaCreacion: stockProducto.fechaCreacion,
        observaciones: "Control de stock diario - Ingreso Manual",
    }

    return payload;
}

export const crearPayloadStockProductoDiarioInexistente = (orden, detalle) => {
    const idSucursal = orden.idSucursal;
    const fechaValidez = orden.fechaAProducir;
    const idUsuario = orden.idUsuario;

    const cotrolarStockDiarioPayload = {
        idOrden: orden.idOrden,
        idUsuario: idUsuario,
        idProducto: detalle.idProducto,
        idSucursal: idSucursal,
        stock: detalle.cantidadUnidades,
        fechaValidez: fechaValidez,
        fechaActualizacion: orden.fechaActualizacion,
        fechaCreacion: orden.fechaCreacion,
    }

    return cotrolarStockDiarioPayload;
}

export const crearPayloadStockProductoDiarioExistente = (orden, detalle, StockExistente) => {
    const idSucursal = orden.idSucursal;
    const fechaValidez = orden.fechaAProducir;
    const idUsuario = orden.idUsuario;

    const nuevoStock = calcularStockActualizado(detalle.cantidadUnidades, StockExistente.stock);

    const cotrolarStockDiarioPayload = {
        idOrden: orden.idOrden,
        idUsuario: idUsuario,
        idProducto: detalle.idProducto,
        idSucursal: idSucursal,
        stock: nuevoStock,
        stockAIngresar: detalle.cantidadUnidades,
        fechaValidez: fechaValidez,
        fechaActualizacion: orden.fechaActualizacion,
        fechaCreacion: orden.fechaCreacion,
    }

    return cotrolarStockDiarioPayload;
}

export const crearPayloadHistorial = (dataNueva, dataExistente, tipoMovimiento, observaciones, ref) => {

    let tipoMov = "";
    let observ = "";
    let referencia = "";
    let nuevoStock = 0;

    switch (tipoMovimiento) {
        case 1:
            tipoMov = "INGRESO";
            break;
        case 2:
            tipoMov = "EGRESO";
            break;
        case 3:
            tipoMov = "CORRECCION";
            break;
        case 4:
            tipoMov = "AJUSTE";
            break;
    }

    switch (observaciones) {
        case 1:
            observ = "Ingreso Manual";
            break;
        case 2:
            observ = "Ingreso por Orden de produccion";
            break;
        case 3:
            observ = "Egreso Manual";
            break; 
        case 4:
            observ = "Egreso por ventas";
            break;
    }

    switch (ref) {
        case 1:
            referencia = "Control de stock";
            break;
        case 2:
            referencia = `Orden - ${dataNueva.idOrden}`;
            break;
        case 3:
            referencia = `venta - ${dataNueva.idVenta}`;
            break;
    }

    const payload = {
        idUsuario: dataNueva.idUsuario,
        idProducto: dataNueva.idProducto,
        idSucursal: dataNueva.idSucursal,
        stockAnterior: dataExistente ? dataExistente.stock : 0,
        stockNuevo: dataNueva.stockAIngresar || dataNueva.stock,
        cantidad: dataNueva.stock,
        fechaActualizacion: dataNueva.fechaActualizacion,
        tipoMovimiento: tipoMov,
        observaciones: observ,
        tipoReferencia: referencia,
    }
    return payload;
}
