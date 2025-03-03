-- Insertar permisos
-- Permiso para el Dashboard
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(1, 'Dashboard', 'Visualización de gráficas estadísticas', '/dashboard', '2025-01-25', 'A');

-- Permiso para la gestión de usuarios (ruta principal)
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(2, 'Gestión de usuarios', 'Crear, modificar y eliminar usuarios', '/users', '2025-01-25', 'A');

-- Permiso para el control de roles (ruta principal)
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(3, 'Control de Roles', 'Crear, modificar y eliminar roles', '/users/roles', '2025-01-25', 'A');

-- Permiso para la gestión de productos (ruta principal)
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(4, 'Gestión de productos', 'Ingresos, modificación y eliminación de productos', '/productos', '2025-01-25', 'A');

-- Permiso para las órdenes de producción (ruta principal)
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(5, 'Órdenes de producción', 'Gestión de órdenes de producción', '/ordenes-produccion', '2025-01-25', 'A');

-- Permiso para las ventas (ruta principal)
INSERT INTO "`permisos`"("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") 
VALUES(6, 'Ventas', 'Gestión de ventas diarias', '/ventas', '2025-01-25', 'A');
-- Crear Rol administrador por defecto
INSERT INTO ROLES (idRol, nombreRol, descripcionRol, fechaCreacion, estado) VALUES
(1, 'Admin', 'Administrador de todo el sistema', '2025-01-25', 'A');

-- Permisos del rol administrador por defecto
INSERT INTO ROLESPERMISOS (idRol, idPermiso) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);
(1, 5),
(1, 6)

-- Crear usuario administrador
INSERT INTO USUARIOS (idUsuario, nombreUsuario, apellidoUsuario, usuario, contrasena, correoUsuario, idRol, estadoUsuario, fechaCreacion, estado) VALUES
(1, 'admin', '', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$m17OGri+fAMWL2KbqE1xWQ$nitlr6HsWwtXcrt2d8U0PUlLJQ51G6K/iT+0ueVxcB0', 'panaderiasangabrields@gmail.com', 1, 'A', '2025-01-25', 'A');
