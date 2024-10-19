import { Router } from "express";
import { ReservaController } from "../controller/reservaController.js";

export const reservaRouter = Router();

reservaRouter.get("/", ReservaController.getAll);
reservaRouter.post("/", ReservaController.save);

reservaRouter.get("/:id", ReservaController.getById);
reservaRouter.delete("/:id", ReservaController.delete);
reservaRouter.patch("/:id", ReservaController.update);
