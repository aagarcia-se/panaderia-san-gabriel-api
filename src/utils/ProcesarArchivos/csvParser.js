import { parse } from 'csv-parse/sync';

export const parsearCSV = (csvString) => {
    // Eliminar BOM UTF-8 si existe
    const csvLimpio = csvString.replace(/^\uFEFF/, '');

    const delimiter = csvLimpio.includes(';') ? ';' : ',';

    const registros = parse(csvLimpio, {
        delimiter,
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    return registros;
};