import { Reserva } from "../model/reserva.js";
import { ReservaService } from "../service/reservaService.js";
import pc from "picocolors";

export class ReservaController {
  static async getAll(req, res) {
    try {
      const reservas = await ReservaService.getAll();
      res.json(reservas);
    } catch (error) {
      console.error(pc.red("❌ Error al buscar las reservas:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const reserva = await ReservaService.getById(id);
      return reserva
        ? res.json(reserva)
        : res.status(404).json({ message: "Reserva not found" });
    } catch (error) {
      console.error(
        pc.red("❌ Error al buscar una reserva por id:"),
        error.message
      );
      res.status(500).json({ message: error.message });
    }
  }

  static async save(req, res) {
    try {
      const reservaDto = new Reserva(req.body);
      const newReserva = await ReservaService.save(reservaDto);
      res.status(201).json(newReserva);
    } catch (error) {
      console.error(pc.red("❌ Error al crear una reserva:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }
  static async update(req, res) {}
  static async delete(req, res) {}
}
