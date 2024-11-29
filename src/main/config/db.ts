import mongoose from "mongoose";
import pc from "picocolors";

const { connection } = mongoose;

const connectionString = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASS}@cluster0.kctfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDB = async () => {
  try {
    console.log("Intentando conectar a la base de datos");
    await mongoose.connect(connectionString);
    console.log("Conectado a la base de datos");
  } catch (error: any) {
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
