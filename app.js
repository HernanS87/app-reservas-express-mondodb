import express from "express";
const app = express();

const PORT = process.env.PORT ?? 1234;

app.get("/", (req, res) => {
  res.json({ mensaje: "Mi primer servidor NODE" });
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost${PORT}`);
});
