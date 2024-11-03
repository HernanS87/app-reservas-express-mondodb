import "./config/loadEnv";
import express, { json } from "express";
import { connectDB } from "./config/db";
import { reservaRouter } from "./route/reservaRouter";
import { mesaRouter } from "./route/mesaRouter";

const app = express();
app.use(json());
app.disable("x-powered-by");

connectDB();

app.get("/", (_req, res) => {
  res.json({ mensaje: "Reserve su lugar en Restaurando Mario!!" });
});

app.use("/reservas", reservaRouter);
app.use("/mesas", mesaRouter);

const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost${PORT}`);
});
