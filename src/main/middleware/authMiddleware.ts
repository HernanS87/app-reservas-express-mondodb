import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthTokenPayload } from "../model/interface/authInterface";

// Middleware para autenticar el token
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies["don-mario-token"];

  if (!token) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "Token inválido o expirado" });
      return;
    }

    // Token válido: añade los datos del usuario a la solicitud y continúa
    req.user = decoded as IAuthTokenPayload;
    next(); // Continúa con el siguiente middleware o controlador
  });
}
