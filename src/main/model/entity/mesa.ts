import { Schema, model, InferSchemaType } from "mongoose";

const mesaSchema = new Schema({
  numero: {
    type: Number,
    min: 1,
    default: undefined,
  },
  capacidad: {
    type: Number,
    enum: [2, 4, 6, 10],
    required: true,
  },
  fechaBaja: {
    type: Date,
    default: undefined,
  },
});

// Pre-hook para asignar número de mesa secuencial basado en el número más alto existente
mesaSchema.pre("save", async function (next) {
  if (this.isNew && !this.numero) {
    // Buscar la mesa con el número más alto
    const lastMesa = await Mesa.findOne().sort({ numero: -1 });

    this.numero = (lastMesa?.numero ?? 0) + 1;
  }
  next();
});

mesaSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Inferir el tipo a partir del esquema
export type MesaModelType = InferSchemaType<typeof mesaSchema>;

export const Mesa = model<MesaModelType>("Mesa", mesaSchema);
