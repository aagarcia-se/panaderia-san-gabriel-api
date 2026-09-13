export const crearPayloadOrdenProduccionBatch = (ordenProduccion, registros) => {
    let tipoProduccionActual = 'bandejas';

    const detalleOrden = [];

    registros.forEach(fila => {
        // Detectar cambio de sección
        if (fila.Codigo === 'Codigo' && fila.Producto === 'Producto') {
            tipoProduccionActual = fila.Bandejas === 'Harina' ? 'harina' : 'bandejas';
            return;
        }

        // Ignorar filas vacías o sin código numérico válido
        if (!fila.Codigo || !fila.Producto || isNaN(parseInt(fila.Codigo))) return;

        const cantidad = parseFloat(fila.Bandejas);

        // 👈 Si la cantidad es vacía o no es un número válido, no agregar
        if (!fila.Bandejas || fila.Bandejas === '' || isNaN(cantidad)) return;

        detalleOrden.push({
            idProducto:       parseInt(fila.Codigo),
            cantidadBandejas: tipoProduccionActual === 'bandejas' ? cantidad : 0,
            cantidadHarina:   tipoProduccionActual === 'harina'   ? cantidad : 0,
            tipoProduccion:   tipoProduccionActual,
            fechaCreacion:    ordenProduccion.fechaCreacion,
        });
    });

    return {
        encabezadoOrden: {
            idSucursal:     ordenProduccion.idSucursal,
            ordenTurno:     ordenProduccion.ordenTurno,
            nombrePanadero: ordenProduccion.nombrePanadero,
            fechaAProducir: ordenProduccion.fechaAProducir,
            idUsuario:      ordenProduccion.idUsuario,
            fechaCreacion:  ordenProduccion.fechaCreacion,
        },
        detalleOrden,
    };
};