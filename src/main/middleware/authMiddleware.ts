import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware para autenticar el token
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies["don-mario-token"];

  if (!token) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any) => {
    if (err) {
      res.status(403).json({ message: "Token inválido o expirado" });
      return;
    }

    // Token válido: añade los datos del usuario a la solicitud y continúa
    //req.user = decoded; // Extiende el tipo Request para incluir "user" (si es necesario)
    next(); // Continúa con el siguiente middleware o controlador
  });
}
