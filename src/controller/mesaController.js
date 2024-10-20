import { Mesa } from "../model/mesa.js";
import { MesaService } from "../service/mesaService.js";
import pc from "picocolors";

const mesaService = new MesaService();

export class MesaController {
  async getAll(req, res) {
    try {
      const mesas = await mesaService.getAll();
      res.json(mesas);
    } catch (error) {
      console.error(pc.red("❌ Error al buscar las mesas:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const mesa = await mesaService.getById(id);
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

  async save(req, res) {
    try {
      const mesaDto = new Mesa(req.body);
      const newMesa = await mesaService.save(mesaDto);
      res.status(201).json(newMesa);
    } catch (error) {
      console.error(pc.red("❌ Error al crear una mesa:"), error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {}
  async delete(req, res) {}
}
