import nodemailer from "nodemailer";

// Configuración del transporte
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatearFecha = (fecha) => {
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("es-AR", opciones).format(fecha);
};

export async function enviarCorreoConfirmacion(reserva) {
  const { email, cantidadPersonas, fecha, hora, nombreCliente } = reserva;

  const fechaFormateada = formatearFecha(fecha);

  const mailOptions = {
    from: '"Restaurante Don Mario" <emimimoutd@gmail.com>',
    to: email,
    subject: "Restaurante Don Mario - Confirmación de reserva",
    html: `
            <h2>Hola ${nombreCliente}!</h2>
            <p>A continuación te enviamos los datos de tu reserva en nuestro restaurante:</p>
            <ul>
                <li><strong>Día:</strong> ${fechaFormateada}</li>
                <li><strong>Hora:</strong> ${hora}</li>
                <li><strong>Cantidad de personas:</strong> ${cantidadPersonas}</li>
            </ul>
            <p>¡Gracias por confiar en nosotros! Esperamos verte pronto.</p>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente");
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
  }
}
