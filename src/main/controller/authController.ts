import { Request, Response } from "express";
import { AuthService } from "../service/authService";
import pc from "picocolors";
import { ValidacionService } from "../service/validacionService";

const authService = new AuthService();
const validacionService = new ValidacionService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const requestValida = await validacionService.validarRequestRegisterUser(req.body);
      await authService.register(requestValida);
      return res.json({ mensaje: "Se registró exitosamente y se envió el mail para iniciar sesión" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al dar de alta un usuario:"), error.message);
      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const requestValida = await validacionService.validarRequestLoginUser(req.body);
      await authService.login(requestValida);
      return res.json({ mensaje: "Se envió el mail para iniciar sesión" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al enviar el mail para iniciar sesión:"), error.message);
      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async verifyLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { jwtToken, user } = await authService.verifyLogin(req.query.token as string);
      res.cookie("don-mario-token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hora
      });
      return res.json({ userName: user.userName, email: user.email });
    } catch (error: any) {
      console.error(pc.red("❌ Error al iniciar sesion:"), error.message);

      return res.status(500).json({ message: "Error al iniciar sesion" });
    }
  }

  async logout(_req: Request, res: Response): Promise<Response> {
    try {
      res.cookie("don-mario-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // Invalida la cookie
      });
      return res.json({ mensaje: "Sesión cerrada correctamente" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al cerrar sesión:"), error.message);
      return res.status(500).json({ message: "Error al cerrar sesión" });
    }
  }
}
