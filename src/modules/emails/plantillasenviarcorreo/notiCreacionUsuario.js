const generarPlantillaCreacionUsuario = (usuario, contrasena) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Panadería San Gabriel</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #1463C2;
            border-radius: 10px 10px 0 0;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            color: #333333;
          }
          .content h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          .content p {
            font-size: 16px;
            line-height: 1.5;
          }
          .credentials {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .credentials p {
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777777;
          }
          .footer a {
            color: #ff8c42;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Encabezado -->
          <div class="header">
            <h1>¡Bienvenido a Panadería San Gabriel!</h1>
          </div>
  
          <!-- Contenido -->
          <div class="content">
            <h2>Hola ${usuario},</h2>
            <p>
              Te damos la bienvenida a nuestra plataforma. tus creadenciales para el ingreso 
               a <a href="https://panaderiasangabriel.vercel.app">Panadería San Gabriel App</a>,
               son los siguientes
            </p>
  
            <!-- Credenciales -->
            <div class="credentials">
              <p><strong>Usuario:</strong> ${usuario}</p>
              <p><strong>Contraseña:</strong> ${contrasena}</p>
            </div>
  
            <p>
              Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
            </p>
          </div>
  
          <!-- Pie de página -->
          <div class="footer">
            <p>
              Si tienes alguna pregunta, no dudes en contactarnos a través de
              <a href="mailto:soporte@panaderiasangabriel.com">soporte@panaderiasangabriel.com</a>.
            </p>
            <p>¡Gracias por unirte a nosotros!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export default generarPlantillaCreacionUsuario;