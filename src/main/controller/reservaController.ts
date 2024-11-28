import { Request, Response } from "express";
import { ReservaService } from "../service/reservaService";
import pc from "picocolors";
import { ValidacionService } from "../service/validacionService";

const reservaService = new ReservaService();
const validacionService = new ValidacionService();

export class ReservaController {
  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const reservas = await reservaService.getAll();
      return res.json(reservas);
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar las reservas:"), error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = await validacionService.validarId(req.params.id);
      const reserva = await reservaService.getById(id);
      return reserva ? res.json(reserva) : res.status(404).json({ message: "Reserva not found" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar una reserva por id:"), error.message);
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

  async save(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user?.id;
      const reservaValidada = await validacionService.validarRequestAltaReserva({ ...req.body, user });
      const respuesta = await reservaService.save(reservaValidada);
      return res.status(201).json(respuesta);
    } catch (error: any) {
      console.error("❌ Error al crear una reserva:", error.message);

      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async update(_req: Request, _res: Response): Promise<void> {}

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      //Hay que hacer una baja lógica. No debería eliminarlo realmente de la base
      const id = await validacionService.validarId(req.params.id);
      const reserva = await reservaService.delete(id);
      return reserva ? res.json({ message: "Se eliminó la reserva con éxito!!" }) : res.status(404).json({ message: "Reserva not found" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar una reserva para eliminar por id:"), error.message);

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
