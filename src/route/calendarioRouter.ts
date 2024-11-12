import { Router } from "express";
import { CalendarioController } from "../controller/calendarioController";

const calendarioController = new CalendarioController();
export const calendarioRouter = Router();


calendarioRouter.get("/dias", async (req, res) => {
  await calendarioController.getDisponibilidadDias(req, res);
});

calendarioRouter.get("/dias/:fecha/horarios", async (req, res) => {
  await calendarioController.getDisponibilidadHorariosXFecha(req, res);
});
