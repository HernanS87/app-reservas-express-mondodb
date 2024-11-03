import { Request, Response } from "express";
import { MesaService } from "../service/mesaService";
import pc from "picocolors";

const mesaService = new MesaService();

export class MesaController {
  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const mesas = await mesaService.getAll();
      return res.json(mesas);
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar las mesas:"), error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      // validar formato de id
      const { id } = req.params;
      const mesa = await mesaService.getById(id);
      return mesa
        ? res.json(mesa)
        : res.status(404).json({ message: "Mesa not found" });
    } catch (error: any) {
      console.error(
        pc.red("❌ Error al buscar una mesa por id:"),
        error.message
      );
      return res.status(500).json({ message: error.message });
    }
  }

  async save(req: Request, res: Response): Promise<Response> {
    try {
      // deberia hacer lo siguiente antes de continuar al service

      // const { error } = validateMesa(req.body);
      // if (error) {
      //   return res.status(400).json({ message: error.message });
      // }

      const newMesa = await mesaService.save(req.body);
      return res.status(201).json(newMesa);
    } catch (error: any) {
      console.error(pc.red("❌ Error al crear una mesa:"), error.message);
      return res.status(500).json({ message: error.message });
    }
  }

  async update(_req: Request, _res: Response): Promise<void> {}
  async delete(_req: Request, _res: Response): Promise<void> {}
}
