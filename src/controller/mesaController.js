import { Mesa } from "../model/mesa.js";
import { MesaService } from "../service/mesaService.js";
import pc from "picocolors";

export class MesaController {
  static async getAll(req, res) {
    try {
      const mesas = await MesaService.getAll();
      res.json(mesas);
    } catch (error) {
      console.error(pc.red("❌ Error al buscar las mesas:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const mesa = await MesaService.getById(id);
      return mesa
        ? res.json(mesa)
        : res.status(404).json({ message: "Mesa not found" });
    } catch (error) {
      console.error(
        pc.red("❌ Error al buscar una mesa por id:"),
        error.message
      );
      res.status(500).json({ message: error.message });
    }
  }

  static async save(req, res) {
    try {
      const mesaDto = new Mesa(req.body);
      const newMesa = await MesaService.save(mesaDto);
      res.status(201).json(newMesa);
    } catch (error) {
      console.error(pc.red("❌ Error al crear una mesa:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {}
  static async delete(req, res) {}
}
