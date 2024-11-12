import { Request, Response } from "express";
import pc from "picocolors";
import { CalendarioService } from '../service/calendarioService';
import { validateTurnoPersonas } from "../model/validation/turnoPersonasValidation";

const calendarioService = new CalendarioService();

export class CalendarioController {

  async getDisponibilidadDias(req: Request, res: Response): Promise<Response> {
    try {
      const validate = await validateTurnoPersonas(req.query);
      if (!validate.success) {
        // Si la validación falla, devolver un error 400 con los errores
        return res.status(400).json({ message: 'Errores de validación', errors: validate.error.errors });
      }

      const turno = req.query.turno as string;
      const personas = req.query.personas as string;

      const infoDias = await calendarioService.getDisponibilidadDias(turno, Number(personas));
      return res.json(infoDias);
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar la disponibilidad:"), error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async getDisponibilidadHorariosXFecha(_req: Request, _res: Response): Promise<void> {

  }
}