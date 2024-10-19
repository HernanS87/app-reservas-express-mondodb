import { Schema, model } from "mongoose";

const mesaSchema = new Schema({
  numero: {
    type: Number,
    min: 1,
  },
  capacidad: {
    type: Number,
    enum: [2, 4, 6, 10],
    required: true,
  },
  estado: {
    type: String,
    enum: ["OCUPADA", "DISPONIBLE"],
    required: true,
  },
  fechaBaja: {
    type: Date,
    default: null,
  },
});

// Pre-hook para asignar número de mesa secuencial basado en el número más alto existente
mesaSchema.pre("save", async function (next) {
  if (this.isNew && !this.numero) {
    // Buscar la mesa con el número más alto
    const lastMesa = await this.constructor.findOne().sort({ numero: -1 });

    this.numero = lastMesa ? lastMesa.numero + 1 : 1;
  }
  next();
});

mesaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Mesa = model("Mesa", mesaSchema);
