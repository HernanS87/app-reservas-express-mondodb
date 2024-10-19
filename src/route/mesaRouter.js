import { Router } from "express";
import { MesaController } from "../controller/mesaController.js";

export const mesaRouter = Router();

mesaRouter.get("/", MesaController.getAll);
mesaRouter.post("/", MesaController.save);

mesaRouter.get("/:id", MesaController.getById);
mesaRouter.delete("/:id", MesaController.delete);
mesaRouter.patch("/:id", MesaController.update);
