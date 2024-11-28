import { Request, Response } from "express";
import pc from "picocolors";
import { CalendarioService } from "../service/calendarioService";
import { ValidacionService } from "../service/validacionService";

const calendarioService = new CalendarioService();
const validacionService = new ValidacionService();

export class CalendarioController {
  async getDisponibilidadDias(req: Request, res: Response): Promise<Response> {
    try {
      const requestValida = await validacionService.validarRequestDisponibilidadDias(req.query);

      const infoDias = await calendarioService.getDisponibilidadDias(requestValida);
      return res.json(infoDias);
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar la disponibilidad:"), error.message);
      // Verifica si el error tiene la propiedad 'errors' (indicando un error de validación)
      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors, // Devuelve los errores directamente
        });
      }

      // Maneja otros errores
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getDisponibilidadHorariosXFecha(req: Request, res: Response): Promise<Response> {
    try {
      const requestValida = await validacionService.validarRequestDisponibilidadHorariosXFecha({
        ...req.params,
        ...req.query,
      });

      const horariosFecha = await calendarioService.getDisponibilidadHorariosFechaDiaAnteriorYPosterior(requestValida);
      return res.json(horariosFecha);
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar la disponibilidad por fecha:"), error.message);

      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
