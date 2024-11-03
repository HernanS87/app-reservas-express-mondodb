import { Request, Response } from "express";
import { ReservaService } from "../service/reservaService";
import pc from "picocolors";

const reservaService = new ReservaService();

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
      //validar id
      const { id } = req.params;
      const reserva = await reservaService.getById(id);
      return reserva
        ? res.json(reserva)
        : res.status(404).json({ message: "Reserva not found" });
    } catch (error: any) {
      console.error(
        pc.red("❌ Error al buscar una reserva por id:"),
        error.message
      );
      return res.status(500).json({ message: error.message });
    }
  }

  async save(req: Request, res: Response): Promise<Response> {
    try {
      // deberia validar el body y despues continuar
      const newReserva = await reservaService.save(req.body);
      return res.status(201).json(newReserva);
    } catch (error: any) {
      console.error(pc.red("❌ Error al crear una reserva:"), error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async update(_req: Request, _res: Response): Promise<void> {}

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      //validar id
      const { id } = req.params;
      const reserva = await reservaService.delete(id);
      return reserva
        ? res.json({ message: "Se eliminó la reserva con éxito!!" })
        : res.status(404).json({ message: "Reserva not found" });
    } catch (error: any) {
      console.error(
        pc.red("❌ Error al buscar una reserva para eliminar por id:"),
        error.message
      );
      return res.status(500).json({ message: error.message });
    }
  }
}
