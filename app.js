import express from "express";
import { connectDB } from "./config/db.js";

const app = express();

connectDB();


app.get("/", (req, res) => {
  res.json({ mensaje: "Mi primer servidor NODE" });
});



const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost${PORT}`);
});
