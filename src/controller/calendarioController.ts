import { Request, Response } from "express";
import pc from "picocolors";
import { CalendarioService } from "../service/calendarioService";
import {
  validateTurnoPersonas,
  validateTurnoPersonasFecha,
} from "../model/validation/calendarioValidation";
import { convertirAFechaLocal } from "../util/dateUtil";

const calendarioService = new CalendarioService();

export class CalendarioController {
  async getDisponibilidadDias(req: Request, res: Response): Promise<Response> {
    try {
      const turno = req.query.turno as string;
      const personas = req.query.personas as string;

      const validate = await validateTurnoPersonas({ turno, personas });
      if (!validate.success) {
        // Si la validación falla, devolver un error 400 con los errores
        return res.status(400).json({
          message: "Errores de validación",
          errors: validate.error.errors,
        });
      }

      const infoDias = await calendarioService.getDisponibilidadDias(
        turno,
        Number(personas)
      );
      return res.json(infoDias);
    } catch (error: any) {
      console.error(
        pc.red("❌ Error al buscar la disponibilidad:"),
        error.message
      );
      return res.status(500).json({ message: error.message });
    }
  }

  async getDisponibilidadHorariosXFecha(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const fecha = req.params.fecha as string;
      const turno = req.query.turno as string;
      const personas = req.query.personas as string;

      const validate = await validateTurnoPersonasFecha({
        turno,
        personas,
        fecha,
      });
      if (!validate.success) {
        // Si la validación falla, devolver un error 400 con los errores
        return res.status(400).json({
          message: "Errores de validación",
          errors: validate.error.errors,
        });
      }

      const horariosFecha =
        await calendarioService.getDisponibilidadHorariosFechaDiaAnteriorYPosterior(
          turno,
          Number(personas),
          convertirAFechaLocal(fecha)
        );
      return res.json(horariosFecha);
    } catch (error: any) {
      console.error(
        pc.red("❌ Error al buscar la disponibilidad por fecha:"),
        error.message
      );
      return res.status(500).json({ message: error.message });
    }
  }
}
