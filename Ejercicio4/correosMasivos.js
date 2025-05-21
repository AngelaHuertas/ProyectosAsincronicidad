// Importamos las librerías necesarias
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const nodemailer = require('nodemailer'); // Nodemailer nos ayuda a enviar correos

// Configuración de Nodemailer para usar el servicio de Gmail (puedes cambiarlo si usas otro servicio)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos Gmail como servicio de correo
  auth: {
    user: process.env.EMAIL,  // Usamos la variable de entorno EMAIL que definimos en el archivo .env
    pass: process.env.PASS    // Usamos la variable de entorno PASS que definimos en el archivo .env
  }
});

// Lista de destinatarios a los que les enviaremos los correos
const destinatarios = [
  'santi123@ejemplo.com',  // Dirección de correo de ejemplo 1
  'santi123@ejemplo.com',  // Dirección de correo de ejemplo 2
  'santi123@ejemplo.com'   // Dirección de correo de ejemplo 3
];

// Función para enviar un correo a cada destinatario
const enviarCorreo = (destinatario) => {
  // Usamos el transportador para enviar un correo con los detalles especificados
  return transporter.sendMail({
    from: process.env.EMAIL,    // De quién se envía el correo (usamos nuestra variable de entorno EMAIL)
    to: destinatario,           // A quién se envía el correo (en cada ciclo, uno de los destinatarios)
    subject: 'Prueba de envío masivo',  // Asunto del correo
    text: 'Hola, este es un correo de prueba enviado con Node.js y Nodemailer.' // Contenido del correo
  });
};

// Usamos Promise.all para enviar todos los correos en paralelo
// Promise.all se asegura de que todos los correos se envíen antes de continuar con el siguiente paso
Promise.all(destinatarios.map(enviarCorreo))  // Para cada destinatario, llamamos a la función enviarCorreo
  .then(() => {
    // Si todo sale bien, mostramos un mensaje en la consola indicando que los correos fueron enviados correctamente
    console.log('Todos los correos fueron enviados correctamente');
  })
  .catch(err => {
    // Si ocurre un error, lo capturamos aquí y mostramos un mensaje de error
    console.error('Error en el envío:', err);
  });
