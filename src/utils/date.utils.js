import dayjs from "dayjs";


export const obtenerSoloFecha = (fechaConHora) => {
    return dayjs(fechaConHora).format('YYYY-MM-DD');
};

export const extraerFechaDeFechaYHora = (fechaYHora) => {
    return dayjs(fechaYHora).format('YYYY-MM-DD');
}

export const formatearFechaHora = (fecha) => {
    return dayjs(fecha).format('YYYY-MM-DD HH:mm:ss');
}

export const formatearFechaHoraSegundos = (fecha) => {
    return dayjs(fecha).format('YYYY-MM-DD HH:mm:ss.SSS');
}
    
export const formatearFechaHoraMinutos = (fecha) => {
    return dayjs(fecha).format('YYYY-MM-DD HH:mm:ss');
}

export const formatearFechaHoraMinutosSegundos = (fecha) => {
    return dayjs(fecha).format('YYYY-MM-DD HH:mm:ss.SSS');
}
