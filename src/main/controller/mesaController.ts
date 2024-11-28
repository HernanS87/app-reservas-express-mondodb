import { Request, Response } from "express";
import { MesaService } from "../service/mesaService";
import pc from "picocolors";
import { ValidacionService } from "../service/validacionService";

const mesaService = new MesaService();
const validacionService = new ValidacionService();

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
      const id = await validacionService.validarId(req.params.id);
      const mesa = await mesaService.getById(id);
      return mesa ? res.json(mesa) : res.status(404).json({ message: "Mesa not found" });
    } catch (error: any) {
      console.error(pc.red("❌ Error al buscar una mesa por id:"), error.message);

      if (error.errors) {
        return res.status(400).json({
          message: "Errores de validación",
          errors: error.errors, // Devuelve los errores directamente
        });
      }

      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async save(req: Request, res: Response): Promise<Response> {
    try {
      const requestValida = await validacionService.validarRequestAltaMesa(req.body);

      const newMesa = await mesaService.save(requestValida);
      return res.status(201).json(newMesa);
    } catch (error: any) {
      console.error(pc.red("❌ Error al crear una mesa:"), error.message);
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

  async update(_req: Request, _res: Response): Promise<void> {}
  async delete(_req: Request, _res: Response): Promise<void> {}
}
