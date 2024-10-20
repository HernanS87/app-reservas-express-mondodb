import { Router } from "express";
import { ReservaController } from "../controller/reservaController.js";

const reservaController = new ReservaController();

export const reservaRouter = Router();

reservaRouter.get("/", reservaController.getAll);
reservaRouter.post("/", reservaController.save);

reservaRouter.get("/:id", reservaController.getById);
reservaRouter.delete("/:id", reservaController.delete);
reservaRouter.patch("/:id", reservaController.update);
