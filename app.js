import express, { json } from "express";
import { connectDB } from "./config/db.js";
import { reservaRouter } from "./route/reservaRouter.js";


const app = express();
app.use(json())
app.disable('x-powered-by')

connectDB();

app.get("/", (req, res) => {
  res.json({ mensaje: "Reserve su lugar en Restaurando Mario!!" });
});

app.use("/reservas", reservaRouter);


const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost${PORT}`);
});
