export const generaNombreUsuario = (data) => {
  const { nombreUsuario, apellidoUsuario } = data;

  if (!nombreUsuario || !apellidoUsuario) {
    throw new Error("Datos incompletos: nombre y apellido son obligatorios");
  }

  // Dividir nombre y apellido en palabras
  const nombres = nombreUsuario
    .split(" ")
    .map((n) => n.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const apellidos = apellidoUsuario
    .split(" ")
    .map((a) => a.toLowerCase().replace(/[^a-z0-9]/g, ""));

  // Estrategias para generar nombres de usuario
  const estrategias = [
    // Opción 1: Primera letra del primer nombre + apellido completo
    () => `${nombres[0]?.charAt(0)}${apellidos[0]}`,

    // Opción 2: Segunda palabra del nombre + primer apellido
    () => `${nombres[1] || nombres[0]}${apellidos[0]}`,

    // Opción 3: Nombre completo + primera letra del primer apellido
    () => `${nombres.join("")}${apellidos[0]?.charAt(0)}`,

    // Opción 4: Primera letra del primer nombre + segundo apellido (si existe)
    () => `${nombres[0]?.charAt(0)}${apellidos[1] || apellidos[0]}`,

    // Opción 5: Segundo nombre (si existe) + primer apellido
    () => `${nombres[1] || nombres[0]}${apellidos[1] || apellidos[0]}`,
  ];

  // Seleccionar estrategia aleatoria
  const estrategiaSeleccionada =
    estrategias[Math.floor(Math.random() * estrategias.length)];

  // Generar nombre de usuario
  return estrategiaSeleccionada().replace(/[^a-z0-9]/g, ""); // Asegurarse de que no tenga caracteres especiales
};

export const generaContrasena = (nombreUsuario) => {
  const caracteresEspeciales = "@";
  const numeros = "0123456789";

  // Tomar las primeras 4 letras del nombre de usuario
  const primerasLetras = nombreUsuario.substring(0, 4).toLowerCase();

  // Elegir un carácter especial aleatorio
  const caracterEspecial = caracteresEspeciales.charAt(
    Math.floor(Math.random() * caracteresEspeciales.length)
  );

  // Elegir un número aleatorio
  const numeroAleatorio = numeros.charAt(
    Math.floor(Math.random() * numeros.length)
  );

  // Concatenar todo: primeras 4 letras, un carácter especial y un número
  const contraseña = `${primerasLetras}${caracterEspecial}${numeroAleatorio}`;

  return contraseña;
};


/* este es un comentario para el fork */