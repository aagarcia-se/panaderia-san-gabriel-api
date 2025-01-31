-- Eliminar las tablas si existen
DROP TABLE IF EXISTS ROLESPERMISOS;
DROP TABLE IF EXISTS PERMISOS;
DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS ROLES;
DROP TABLE IF EXISTS ACCESOS_USUARIOS;
DROP TABLE IF EXISTS SUCURSALES;

-- Tabla USUARIOS (Información general del usuario)
CREATE TABLE USUARIOS (
    idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreUsuario TEXT NOT NULL,
    apellidoUsuario TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    aliasUsuario TEXT,
    correoUsuario TEXT,
    telefonoUsuario TEXT,
    idRol INTEGER NOT NULL,
    estadoUsuario TEXT NOT NULL CHECK(estadoUsuario IN ('A', 'B')) DEFAULT 'A',
    fechaCreacion DATE  NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol)
);

-- Tabla ACCESOS_USUARIOS (Información de acceso y seguridad)
CREATE TABLE ACCESOS_USUARIOS (
    idAcceso INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario INTEGER NOT NULL,
    cambioContrasena BOOLEAN NOT NULL DEFAULT 0,
    ultimaConexion DATETIME,
    intentosFallidos INTEGER DEFAULT 0,
    tokenRecuperacion TEXT,
    fechaExpiracionToken DATETIME,
    fechaCreacion DATE  NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario) ON UPDATE CASCADE
);


-- Tabla ROLES
CREATE TABLE ROLES (
    idRol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreRol TEXT NOT NULL UNIQUE,
    descripcionRol TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);


-- Tabla PERMISOS
CREATE TABLE PERMISOS (
    idPermiso INTEGER PRIMARY KEY AUTOINCREMENT,
    nombrePermiso TEXT NOT NULL UNIQUE,
    descripcionPermiso TEXT,
    rutaAcceso TEXT,
    fechaCreacion DATE  NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla ROLESPERMISOS
CREATE TABLE ROLESPERMISOS (
    idRol INTEGER NOT NULL,
    idPermiso INTEGER NOT NULL,
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol) ON DELETE CASCADE,
    FOREIGN KEY (idPermiso) REFERENCES PERMISOS(idPermiso) ON DELETE CASCADE
);

-- Tabla SUCURSALES
CREATE TABLE SUCURSALES (
    idSucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreSucursal TEXT NOT NULL UNIQUE,
    direccionSucursal TEXT NOT NULL,
    municipioSucursal TEXT NOT NULL,
    departamentoSucursal TEXT NOT NULL,
    latitudSucursal TEXT NOT NULL,
    longitudSucursal TEXT NOT NULL,
    telefonoSucursal TEXT ,
    correoSucursal TEXT ,
    fechaCreacion DATE NOT NULL ,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Insertar permisos ----
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(1, 'Dashboard', 'Visualizacion de graficas estadisticas', '/dashboard', '2025-01-25', 'A');
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(2, 'Crear usuarios', 'Crear usuarios para ingreso al sistema', '/users/create', '2025-01-25', 'A');
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(3, 'Control de Roles', 'Crear roles para asignar al usaurio', '/users/roles', '2025-01-25', 'A');

-- Crear Rol administrador por defecto--
INSERT INTO roles ("idRol", "nombreRol", "descripcionRol", "fechaCreacion", "estado") VALUES(1, 'Admin', 'Administrador de todo el sistema', '2025-01-25', 'A');

-- Permisos del rol administrador --
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 1);
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 3);
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 2);

-- Crear usuio administrador --
INSERT INTO usuarios ("idUsuario", "nombreUsuario", "apellidoUsuario", "usuario", "contrasena", "correoUsuario", "idRol", "estadoUsuario", "fechaCreacion", "estado") VALUES(1, 'admin', '', 'admin', '$2b$10$Hc2gvMXzcEqWAghdz1MvluiJFBq3slluVrhq/1LCI7EZ7nmIy43NS', 'panaderiasangabrields@gmail.com', 1, 'A', '2025-01-25', 'A');