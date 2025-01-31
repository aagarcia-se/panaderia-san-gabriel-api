import crypto from 'crypto';

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

export const generaContrasena = () => {
  const numeros = "0123456789"; // Cadena de números posibles
  let contrasena = "Sg-"; // Inicia con "Sg-"

  // Generar 7 números aleatorios usando crypto
  for (let i = 0; i < 7; i++) {
    const randomByte = crypto.randomBytes(1)[0]; // Genera un byte aleatorio
    const numeroAleatorio = numeros[randomByte % numeros.length]; // Selecciona un número aleatorio
    contrasena += numeroAleatorio; // Concatenar cada número aleatorio
  }

  return contrasena; // Devolver la contraseña en el formato deseado
};
