import { parse } from "csv-parse/sync";

export const parsearCSV = (csvString) => {
  const csvLimpio = csvString
    .replace(/^\uFEFF/, "")       // ✅ elimina BOM UTF-8
    .replace(/^sep=.*\n/i, "")   // ✅ elimina línea sep= si existe
    .trim();

  const delimiter = csvLimpio.includes(";") ? ";" : ",";

  const registros = parse(csvLimpio, {
    delimiter,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return registros;
};