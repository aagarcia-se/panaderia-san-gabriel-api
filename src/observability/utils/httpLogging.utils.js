import observabilityConfig from "../config/observability.config";

/**
 * Determina si una ruta está en la lista de exclusión
 * de envío remoto (Better Stack) para requests exitosos.
 *
 * Soporta coincidencia exacta ("/api/health") y
 * prefijo con wildcard ("/api/health/*").
 */
export const isExcludedFromRemoteLogs = (path) => {
  return observabilityConfig.excludedFromRemotePaths.some(
    (excluded) => {
      if (excluded.endsWith("*")) {
        return path.startsWith(excluded.slice(0, -1));
      }
      return path === excluded;
    }
  );
};