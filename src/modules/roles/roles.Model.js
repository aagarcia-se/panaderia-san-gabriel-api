// models/roleModel.js
class Role {
  constructor({ idRol, nombreRol, descripcionRol, fechaCreacion, estado }) {
    this.idRol = idRol;
    this.nombreRol = nombreRol;
    this.descripcionRol = descripcionRol;
    this.fechaCreacion = fechaCreacion || ''; // Valor por defecto fecha actual
    this.estado = estado || "A"; // Valor por defecto 'A'
  }

  // Método para validar si el rol tiene los campos mínimos requeridos
  isValid() {
    return this.nombreRol && this.nombreRol.trim().length > 0;
  }

  // Método para verificar si el estado es válido
  isEstadoValido() {
    return ["A", "I"].includes(this.estado);
  }

  // Método para marcar el rol como inactivo
  deactivate() {
    this.estado = "I";
  }

  // Método para marcar el rol como activo
  activate() {
    this.estado = "A";
  }

  // Método para actualizar el nombre y descripción
  updateDetails(nombreRol, descripcion) {
    if (nombreRol) this.nombreRol = nombreRol;
    if (descripcion) this.descripcion = descripcion;
  }
}

export default Role;
