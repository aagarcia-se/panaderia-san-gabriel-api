-- Insertar permisos
INSERT INTO PERMISOS (idPermiso, nombrePermiso, descripcionPermiso, rutaAcceso, fechaCreacion, estado) VALUES
(1, 'Dashboard', 'Visualización de gráficas estadísticas', '/dashboard', '2025-01-25', 'A'),
(2, 'Crear usuarios', 'Crear usuarios para ingreso al sistema', '/users/create', '2025-01-25', 'A'),
(3, 'Control de Roles', 'Crear roles para asignar al usuario', '/users/roles', '2025-01-25', 'A'),
(4, 'Gestion de productos', 'Ingresos, modificación y eliminación de productos', '/productos', '2025-01-25', 'A');
(5, 'Ingresar Orden Produccion', 'Ingresar orden de produccion', '/ingresar-orden', '2025-01-25', 'A');

-- Crear Rol administrador por defecto
INSERT INTO ROLES (idRol, nombreRol, descripcionRol, fechaCreacion, estado) VALUES
(1, 'Admin', 'Administrador de todo el sistema', '2025-01-25', 'A');

-- Permisos del rol administrador por defecto
INSERT INTO ROLESPERMISOS (idRol, idPermiso) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- Crear usuario administrador
INSERT INTO USUARIOS (idUsuario, nombreUsuario, apellidoUsuario, usuario, contrasena, correoUsuario, idRol, estadoUsuario, fechaCreacion, estado) VALUES
(1, 'admin', '', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$m17OGri+fAMWL2KbqE1xWQ$nitlr6HsWwtXcrt2d8U0PUlLJQ51G6K/iT+0ueVxcB0', 'panaderiasangabrields@gmail.com', 1, 'A', '2025-01-25', 'A');
