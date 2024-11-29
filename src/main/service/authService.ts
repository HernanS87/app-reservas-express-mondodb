import { UserModelType } from "../model/entity/user";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { EmailService } from "./emailService";
import { IAuthTokenPayload, IAuthUserAndToken, ILoginTokenPayload } from "../model/interface/authInterface";
import { UserService } from "./userService";

const userService = new UserService();
const emailService = new EmailService();

export class AuthService {
  async register(user: UserModelType): Promise<void> {
    const userExists = await userService.findByEmailOrUserName(user);
    if (userExists) throw new Error("El email o nombre de usuario ya están registrados");

    await userService.save(user);

    await this.login(user);
  }

  async login(userData: UserModelType): Promise<void> {
    const user = await userService.findByEmailOrUserName(userData);
    if (!user) throw new Error("Usuario no identificado");

    // Se genera un loginToken único para evitar reutilización de enlaces de inicio de sesión
    // y agregar una capa adicional de seguridad contra ataques de repetición (Replay Attacks).
    const loginToken = crypto.randomBytes(32).toString("hex");
    const jwtToken = jwt.sign({ id: user._id, loginToken }, process.env.JWT_SECRET!, {
      expiresIn: "15m", // Válido por 15 minutos
    });

    await emailService.enviarCorreoInicioSesion(user.email, jwtToken);

    //acá puedo devolver un mjs de que ya se envio un correo para iniciar sesion o simplemente lo devuelvo en el controller
  }

  async verifyLogin(token: string): Promise<IAuthUserAndToken> {
    try {
      // Verificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ILoginTokenPayload;

      // Buscar usuario por ID decodificado
      const user = await userService.findById(decoded.id);
      if (!user) throw new Error("Usuario no identificado");

      // Generar token JWT de sesión
      return {
        jwtToken: jwt.sign({ id: user._id, userName: user.userName } as IAuthTokenPayload, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        }),
        user,
      };
    } catch (error) {
      // Manejar errores de verificación de JWT
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expirado");
      }
      // Manejar otros errores inesperados
      throw new Error("Error al verificar el token");
    }
  }
}
