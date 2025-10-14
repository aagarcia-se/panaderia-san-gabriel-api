

export const detalleVentaEliminadaPayload = (venta) => {
    try {

        const encabezado = venta.encabezadoVenta;
        const detVenta = venta.detalleVenta;
        const ingresos = venta.detalleIngresos;

        const encabezadoVetaEliminada = {
            idVenta: encabezado.idVenta,
            idUsuario: encabezado.idUsuario,
            idSucursal: encabezado.idSucursal,
            turno: encabezado.ventaTurno,
            montoTotalIngresado: ingresos.montoTotalIngresado,
            montoTotalGastos: ingresos.montoTotalGastos,
            montoEsperado: ingresos.montoEsperado,
            diferencia: ingresos.diferencia,
            fechaEliminacion: encabezado.fechaVenta
        }

        const detalleVentaEliminada = detVenta.map((detalle) => {

            const productosVendidos = {
                idProducto: detalle.idProducto,
                cantidadVendidaEliminada: detalle.cantidadVendida,
                precioUnitario: detalle.precioUnitario,
                subtotal: detalle.subtotal
            }

            return productosVendidos;
        });

        const ingresosVentaEliminada = {
            montoTotalIngresado: ingresos.montoTotalIngresado,
            montoTotalGastos: ingresos.montoTotalGastos,
            montoEsperado: ingresos.montoEsperado,
            diferencia: ingresos.diferencia
        }

        const paylod = {
            encabezadoVetaEliminada,
            detalleVentaEliminada,
            ingresosVentaEliminada
        }


        return paylod;
    } catch (error) {
        // Manejar errores
        throw error;
    }

}