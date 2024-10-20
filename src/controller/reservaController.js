import { Reserva } from "../model/reserva.js";
import { ReservaService } from "../service/reservaService.js";
import pc from "picocolors";

const reservaService = new ReservaService();

export class ReservaController {
  async getAll(req, res) {
    try {
      const reservas = await reservaService.getAll();
      res.json(reservas);
    } catch (error) {
      console.error(pc.red("❌ Error al buscar las reservas:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.getById(id);
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

  async save(req, res) {
    try {
      const reservaDto = new Reserva(req.body);
      const newReserva = await reservaService.save(reservaDto);
      res.status(201).json(newReserva);
    } catch (error) {
      console.error(pc.red("❌ Error al crear una reserva:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {}

  async delete(req, res) {
    try {
      const { id } = req.params;
      const reserva = await reservaService.delete(id);
      return reserva
        ? res.json({ message: "Se eliminó la reserva con éxito!!" })
        : res.status(404).json({ message: "Reserva not found" });
    } catch (error) {
      console.error(
        pc.red("❌ Error al buscar una reserva para eliminar por id:"),
        error.message
      );
      res.status(500).json({ message: error.message });
    }
  }
}
