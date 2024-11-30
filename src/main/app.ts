import "./config/loadEnv";
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { reservaRouter } from "./route/reservaRouter";
import { mesaRouter } from "./route/mesaRouter";
import { calendarioRouter } from "./route/calendarioRouter";
import { authRouter } from "./route/authRouter";
import { authenticateToken } from "./middleware/authMiddleware";

const app = express();
app.use(
  cors({
    origin: "https://don-mario-kohl.vercel.app", // Cambia esto por el dominio de tu app front-end
    credentials: true, // Habilita envío de cookies
  })
);
app.use(json());
app.use(cookieParser());
app.disable("x-powered-by");

connectDB();

app.get("/", (_req, res) => {
  res.json({ mensaje: "Reserve su lugar en Restaurando Mario!!" });
});

app.use("/auth", authRouter);
app.use("/reservas", authenticateToken, reservaRouter);
app.use("/mesas", mesaRouter);
app.use("/calendario", calendarioRouter);

const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
