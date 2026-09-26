import observabilityConfig from "../config/observability.config.js";

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