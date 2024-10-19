import mongoose from "mongoose";
import pc from "picocolors";

const { connection } = mongoose;

const connectionString = "mongodb://localhost:27017/test";

export const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error(pc.red("❌ Error de conexión:"), error.message);
    process.exit(1); // Salir del proceso si la conexión falla
  }
};

// Manejo de eventos de la conexión
connection.on("close", () => {
  console.log("Conexión cerrada");
});

connection.on("error", (error) => {
  console.error(pc.red("❌ Error de conexión:"), error.message);
});

// Manejo de excepciones no capturadas
process.on("uncaughtException", (error) => {
  console.error(pc.red("❌ Excepción no capturada:"), error.message);
  mongoose.disconnect();
});
