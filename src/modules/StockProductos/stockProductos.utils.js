
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
        observaciones: "Control de stock general",
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
        observaciones: "Control de stock general",
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
        observaciones: "Control de stock diario",
    
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
        observaciones: "Control de stock diario",
    }

    return payload;
}

export const crearPayloadStockProductoDiarioInexistente = (orden, detalle) => {
    const idSucursal = orden.idSucursal;
    const fechaValidez = orden.fechaAProducir;

    const cotrolarStockDiarioPayload = {
        idProducto: detalle.idProducto,
        idSucursal: idSucursal,
        stock: detalle.cantidadUnidades,
        fechaValidez: fechaValidez,
        fechaActualizacion: orden.fechaCreacion,
        fechaCreacion: orden.fechaCreacion,
        observaciones: "Control de stock diario",
    }

    return cotrolarStockDiarioPayload;
}

export const crearPayloadStockProductoDiarioExistente = (orden, detalle, StockExistente) => {
    const idSucursal = orden.idSucursal;
    const fechaValidez = orden.fechaAProducir;

    const nuevoStock = calcularStockActualizado(detalle.cantidadUnidades, StockExistente.stock);

    const cotrolarStockDiarioPayload = {
        idProducto: detalle.idProducto,
        idSucursal: idSucursal,
        stock: nuevoStock,
        fechaValidez: fechaValidez,
        fechaActualizacion: orden.fechaCreacion,
        fechaCreacion: orden.fechaCreacion,
        observaciones: "Control de stock diario",
    }

    return cotrolarStockDiarioPayload;
}
