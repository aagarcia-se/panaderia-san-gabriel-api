

export const crearPayloadingresos = (idVenta, venta) => {
    const {encabezadoVenta, detalleIngreso, gastosDiarios} = venta;

   return {
        idVenta: Number(idVenta),
        ...detalleIngreso,
        montoEsperado: encabezadoVenta.totalVenta,
        montoTotalGasto: gastosDiarios && gastosDiarios.encabezadoGastosDiarios ? gastosDiarios.encabezadoGastosDiarios.montoTotalGasto : 0
    }
}

export const calcularDiferencia = (montoEsperado, montoTotalIngresado, montoTotalGasto) => {

    return (montoTotalIngresado + montoTotalGasto ) - montoEsperado;

}