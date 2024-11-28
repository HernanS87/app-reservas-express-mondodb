import { Router } from "express";
import { AuthController } from "../controller/authController";

const authController = new AuthController();

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  await authController.register(req, res);
});

authRouter.post("/login", async (req, res) => {
  await authController.login(req, res);
});

authRouter.get("/login/verify", async (req, res) => {
  await authController.verifyLogin(req, res);
});

authRouter.get("/logout", async (req, res) => {
  await authController.logout(req, res);
});
