import { Router } from "express";
import { MesaController } from "../controller/mesaController.js";

const mesaController = new MesaController();

export const mesaRouter = Router();

mesaRouter.get("/", mesaController.getAll);
mesaRouter.post("/", mesaController.save);

mesaRouter.get("/:id", mesaController.getById);
mesaRouter.delete("/:id", mesaController.delete);
mesaRouter.patch("/:id", mesaController.update);
