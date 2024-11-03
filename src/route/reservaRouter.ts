import { Router } from "express";
import { ReservaController } from "../controller/reservaController";

const reservaController = new ReservaController();

export const reservaRouter = Router();

reservaRouter.get("/", async (req, res) => {
  await reservaController.getAll(req, res);
});

reservaRouter.post("/", async (req, res) => {
  await reservaController.save(req, res);
});

reservaRouter.get("/:id", async (req, res) => {
  await reservaController.getById(req, res);
});

reservaRouter.delete("/:id", async (req, res) => {
  await reservaController.delete(req, res);
});

reservaRouter.patch("/:id", async (req, res) => {
  await reservaController.update(req, res);
});
