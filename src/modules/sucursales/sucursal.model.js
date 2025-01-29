class Sucursal {
  constructor({
    idSucursal,
    nombreSucursal,
    direccionSucursal,
    municipioSucursal,
    departamentoSucursal,
    latitudSucursal,
    longitudSucursal,
    telefonoSucursal,
    correoSucursal,
    fechaCreacion,
    estado
  }) {
    this.idSucursal = idSucursal;
    this.nombreSucursal = nombreSucursal;
    this.direccionSucursal = direccionSucursal;
    this.municipioSucursal = municipioSucursal;
    this.departamentoSucursal = departamentoSucursal;
    this.latitudSucursal = latitudSucursal;
    this.longitudSucursal = longitudSucursal;
    this.telefonoSucursal = telefonoSucursal;
    this.correoSucursal = correoSucursal;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado || "A";
    
  }

  consultarIdSucursal() {
    return this.idSucursal;
  }

}

export default Sucursal;