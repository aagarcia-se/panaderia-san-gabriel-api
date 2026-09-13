export const crearPayloadOrdenProduccionBatch = (ordenProduccion, registros) => {
    let tipoProduccionActual = 'bandejas';

    const detalleOrden = [];

    registros.forEach(fila => {

        // Normalizar nombres de propiedades
        const codigo = fila.Codigo ?? fila['﻿Codigo'];
        const producto = fila.Producto;
        const bandejas = fila.Bandejas;

        // Detectar cambio de sección
        if (
            String(codigo).trim() === 'Codigo' &&
            String(producto).trim() === 'Producto'
        ) {
            tipoProduccionActual =
                String(bandejas).trim().toLowerCase() === 'harina'
                    ? 'harina'
                    : 'bandejas';

            return;
        }

        // Ignorar filas vacías
        if (!codigo || !producto) return;

        const codigoNumerico = parseInt(codigo);
        const cantidad = parseFloat(bandejas);

        // Validar código
        if (isNaN(codigoNumerico)) return;

        // Validar cantidad
        if (
            bandejas === undefined ||
            bandejas === null ||
            String(bandejas).trim() === '' ||
            isNaN(cantidad)
        ) {
            return;
        }

        detalleOrden.push({
            idProducto: codigoNumerico,
            cantidadBandejas:
                tipoProduccionActual === 'bandejas' ? cantidad : 0,
            cantidadHarina:
                tipoProduccionActual === 'harina' ? cantidad : 0,
            tipoProduccion: tipoProduccionActual,
            fechaCreacion: ordenProduccion.fechaCreacion,
        });
    });

    return {
        encabezadoOrden: {
            idSucursal: ordenProduccion.idSucursal,
            ordenTurno: ordenProduccion.ordenTurno,
            nombrePanadero: ordenProduccion.nombrePanadero,
            fechaAProducir: ordenProduccion.fechaAProducir,
            idUsuario: ordenProduccion.idUsuario,
            fechaCreacion: ordenProduccion.fechaCreacion,
        },
        detalleOrden,
    };
};