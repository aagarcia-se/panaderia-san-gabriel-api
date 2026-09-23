import * as XLSX from "xlsx";

export const parsearXLSX = (buffer) => {
  // ── Leer el archivo Excel desde el buffer ─────────────────────────────────
  const wb = XLSX.read(buffer, { type: "buffer" });

  // ── Tomar la primera hoja ─────────────────────────────────────────────────
  const ws = wb.Sheets[wb.SheetNames[0]];

  // ── Convertir a array de objetos con los headers de la primera fila ───────
  const registros = XLSX.utils.sheet_to_json(ws, {
    defval: "",   // valor por defecto para celdas vacías
    raw:    false, // convertir todo a string para consistencia
  });

  return registros;
};