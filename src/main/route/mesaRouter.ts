import { Router } from "express";
import { MesaController } from "../controller/mesaController";

const mesaController = new MesaController();
export const mesaRouter = Router();


mesaRouter.get("/", async (req, res) => {
  await mesaController.getAll(req, res);
});

mesaRouter.post("/", async (req, res) => {
  await mesaController.save(req, res);
});

mesaRouter.get("/:id", async (req, res) => {
  await mesaController.getById(req, res);
});

mesaRouter.delete("/:id", async (req, res) => {
  await mesaController.delete(req, res);
});

mesaRouter.patch("/:id", async (req, res) => {
  await mesaController.update(req, res);
});
