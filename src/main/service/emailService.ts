import nodemailer from "nodemailer";
import { ReservaModelType } from "../model/entity/reserva";
import { formatDateString } from "../util/dateUtil";
import { UserModelType } from "../model/entity/user";

// Configuración del transporte de correos
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  /**
   * Enviar correo de confirmación de reserva
   */
  async enviarCorreoConfirmacion(reserva: ReservaModelType, user: UserModelType) {
    const { cantidadPersonas, fecha, hora } = reserva;

    const fechaFormateada = formatDateString(fecha);

    const mailOptions = {
      from: '"Restaurante Don Mario" <emimimoutd@gmail.com>',
      to: user.email,
      subject: "Restaurante Don Mario - Confirmación de reserva",
      html: `
          <h2>Hola ${user.userName}!</h2>
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
      await transporter.sendMail(mailOptions);
      console.log("Correo de confirmación enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el correo de confirmación: ", error);
      throw new Error("No se pudo enviar el correo de confirmación");
    }
  }

  /**
   * Enviar enlace de inicio de sesión
   */
  async enviarCorreoInicioSesion(email: string, token: string) {
    //TODO a la hora del deploy o de probar con el front debo cambiar el loginURL
    //para que apunte a una ruta del front y sea éste quien llame al back para verificar el login
    // tambien debería cambiar el verbo GET a POST ya que todos son métodos q modifican el estado de las sesion
    const loginUrl = `${process.env.FRONTEND_URL}=${token}`;
    const mailOptions = {
      from: '"Restaurante Don Mario" <emimimoutd@gmail.com>',
      to: email,
      subject: "Inicia sesión en Restaurando Mario",
      text: `Haz clic en el siguiente enlace para iniciar sesión: ${loginUrl}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Correo de inicio de sesión enviado correctamente");
    } catch (error) {
      console.error("Error al enviar el correo de inicio de sesión: ", error);
      throw new Error("No se pudo enviar el correo de inicio de sesión");
    }
  }
}
