import CustomError from "../utils/CustomError.js";
import { getError } from "../utils/generalErrors.js";
import { getLogger, LOG_CATEGORIES } from "../observability/index.js";

/**
 * Normaliza rutas y nombres de permisos para compararlos sin importar
 * mayúsculas, espacios ni barras finales.
 */
const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\/+$/, "");

const getUserPermissions = (req) =>
  Array.isArray(req.user?.permisos) ? req.user.permisos : [];

/**
 * Un permiso concedido cubre al permiso requerido cuando:
 * - coincide exactamente con su `rutaAcceso` o `nombrePermiso`, o
 * - es una ruta padre (ej. "/users" cubre "/users/roles").
 */
const permissionMatches = (granted, required) => {
  const requiredPath = normalize(required);

  if (!requiredPath) {
    return false;
  }

  const grantedPath = normalize(granted?.rutaAcceso);
  const grantedName = normalize(granted?.nombrePermiso);

  if (grantedPath === requiredPath || grantedName === requiredPath) {
    return true;
  }

  return Boolean(
    grantedPath && requiredPath.startsWith(`${grantedPath}/`)
  );
};

/**
 * Indica si el usuario autenticado tiene al menos uno de los permisos
 * solicitados. Los permisos provienen del JWT generado en el login.
 */
export const hasPermission = (req, requiredPermissions) => {
  const required = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const grantedPermissions = getUserPermissions(req);

  return required.some((requiredPermission) =>
    grantedPermissions.some((grantedPermission) =>
      permissionMatches(grantedPermission, requiredPermission)
    )
  );
};

const deniedError = () => new CustomError(getError(13));

const auditDenied = (req, requiredPermissions) => {
  getLogger().warn(
    {
      category: LOG_CATEGORIES.SECURITY,
      operation: "authorizationDenied",
      userId: req.user?.usuario?.idUsuario,
      username: req.user?.usuario?.usuario,
      method: req.method,
      url: req.path,
      requiredPermissions,
    },
    "Acceso denegado por permisos insuficientes"
  );
};

/**
 * Middleware de autorización por permisos.
 *
 * Uso:
 *   router.post("/ruta", authMiddleware, requirePermission(PERMISSIONS.USERS), controller)
 *
 * Con varios permisos se autoriza si el usuario tiene al menos uno.
 */
export const requirePermission =
  (...requiredPermissions) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new CustomError(getError(7)));
    }

    if (hasPermission(req, requiredPermissions)) {
      return next();
    }

    auditDenied(req, requiredPermissions);
    return next(deniedError());
  };

const getFieldValues = (source, fields) =>
  fields
    .map((field) => source[field])
    .filter((value) => value !== undefined && value !== null);

const valuesMatch = (values, expected) =>
  values.length > 0 &&
  values.every((value) => String(value).trim() === String(expected).trim());

const isSelf = (
  req,
  { idFields = [], usernameFields = [], matchAll = false } = {}
) => {
  const currentUser = req.user?.usuario ?? {};
  const source = {
    ...(req.params || {}),
    ...(req.query || {}),
    ...(req.body || {}),
  };

  const idValues = getFieldValues(source, idFields);
  const usernameValues = getFieldValues(source, usernameFields);

  const idMatches =
    idValues.length > 0 &&
    currentUser.idUsuario !== undefined &&
    valuesMatch(idValues, currentUser.idUsuario);

  const usernameMatches =
    usernameValues.length > 0 &&
    Boolean(currentUser.usuario) &&
    usernameValues.every(
      (value) => normalize(value) === normalize(currentUser.usuario)
    );

  if (matchAll) {
    // Todos los campos enviados deben corresponder al usuario autenticado
    // (ej. no se puede enviar el id propio con el usuario de otra persona).
    const checks = [];

    if (idValues.length > 0) checks.push(idMatches);
    if (usernameValues.length > 0) checks.push(usernameMatches);

    return checks.length > 0 && checks.every(Boolean);
  }

  return idMatches || usernameMatches;
};

/**
 * Permite la operación cuando el recurso objetivo es el propio usuario
 * autenticado, o cuando se tiene alguno de los permisos indicados.
 * Se usa en endpoints de perfil y cambio de contraseña propia.
 */
export const requireSelfOrPermission =
  (selfOptions, ...requiredPermissions) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new CustomError(getError(7)));
    }

    if (isSelf(req, selfOptions)) {
      return next();
    }

    if (hasPermission(req, requiredPermissions)) {
      return next();
    }

    auditDenied(req, requiredPermissions);
    return next(deniedError());
  };
